/* ==========================================================================
   api.js — SupportIQ analysis API client
   The only place the frontend talks to the backend:

     POST {baseUrl}{path}
     { "customer_id": "<id>", "issue": "<current customer issue>" }
     -> { "customer_id": "<id>", "issue": "<echo>", "result": "<text block>" }

   `result` is a single plain-text block carrying three labelled sections.
   parseResult() splits it into issue / recommended action / customer response.
   Nothing is generated locally: a field the API does not return stays empty
   and is reported through `missing`.
   Classic script: attaches to the single SIQ namespace.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var CONFIG = {
    baseUrl: 'http://192.168.88.14:8000',
    path: '/api/analyze',
    // The backend runs a real analysis, so allow a generous wait per call.
    timeoutMs: 90000
  };

  var SECTIONS = [
    { key: 'issue', label: 'ISSUE' },
    { key: 'action', label: 'RECOMMENDED ACTION' },
    { key: 'response', label: 'CUSTOMER RESPONSE' }
  ];

  /* -------------------------------------------------------------- errors */

  function ApiError(message, detail) {
    this.name = 'ApiError';
    this.message = message;
    this.detail = detail || null;
  }
  ApiError.prototype = Object.create(Error.prototype);
  ApiError.prototype.constructor = ApiError;

  /* ------------------------------------------------------------- parsing */

  /**
   * Matches a section header: the label at the start of a line, optionally
   * bold, followed by a colon (which may be followed by inline text) or by
   * the end of the line. Anchoring at the line start keeps ordinary prose
   * such as "issue reported" from being read as a header.
   */
  function headerPattern(label) {
    var spaced = label.split(' ').join('[ \\t]+');
    return new RegExp(
      '^[ \\t]*(?:\\*\\*|__)?[ \\t]*' + spaced +
      '[ \\t]*(?:\\*\\*|__)?[ \\t]*(?::[ \\t]*(?:\\*\\*|__)?[ \\t]*|$)',
      'im'
    );
  }

  var HEADERS = SECTIONS.map(function (s) { return { key: s.key, re: headerPattern(s.label) }; });

  /**
   * Splits the `result` block into its sections. Headers are matched in
   * order, each search resuming where the previous header ended, so the body
   * text of one section can never be mistaken for the next header.
   *
   * Returns {issue, action, response, raw, missing}.
   */
  function parseResult(raw) {
    var text = String(raw === null || raw === undefined ? '' : raw).replace(/\r\n?/g, '\n');
    var out = { raw: text, issue: '', action: '', response: '', missing: [] };
    var found = [];
    var cursor = 0;

    HEADERS.forEach(function (h) {
      h.re.lastIndex = 0;
      var m = h.re.exec(text.slice(cursor));
      if (!m) {
        out.missing.push(h.key);
        return;
      }
      var from = cursor + m.index;
      found.push({ key: h.key, from: from, start: from + m[0].length });
      cursor = from + m[0].length;
    });

    found.forEach(function (f, i) {
      var end = i + 1 < found.length ? found[i + 1].from : text.length;
      out[f.key] = text.slice(f.start, end).trim();
    });

    return out;
  }

  /* ------------------------------------------------------------- failures */

  /** Turns a non-2xx response into a message an agent can act on. */
  function describeFailure(status, body) {
    if (body && Array.isArray(body.detail)) {
      var msgs = body.detail.map(function (d) { return d && d.msg ? d.msg : String(d); });
      if (msgs.length) return 'The backend rejected the request: ' + msgs.join(' ') + '.';
    }
    if (body && typeof body.detail === 'string' && body.detail) return body.detail;
    if (status === 404) return 'No analysis endpoint at ' + CONFIG.baseUrl + CONFIG.path + '.';
    if (status === 422) return 'The backend rejected the request payload.';
    if (status >= 500) return 'The backend failed while analysing this issue (HTTP ' + status + ').';
    return 'The analysis request failed with HTTP ' + status + '.';
  }

  function readBody(res) {
    return res.text().then(function (text) {
      if (!text) return null;
      try { return JSON.parse(text); } catch (e) { return { raw: text }; }
    });
  }

  /* -------------------------------------------------------------- request */

  /**
   * analyze(customerId, issue, opts) → Promise<result>
   *
   * Resolves with {id, issue, action, response, raw, missing, source, receivedAt}.
   * Rejects with an ApiError carrying a human-readable message.
   * opts.signal lets the engine cancel an in-flight run.
   */
  function analyze(customerId, issue, opts) {
    var o = opts || {};
    var timeoutMs = o.timeoutMs || CONFIG.timeoutMs;

    if (!customerId) {
      return Promise.reject(new ApiError('No customer id was supplied to the analysis request.'));
    }
    if (!String(issue === null || issue === undefined ? '' : issue).trim()) {
      return Promise.reject(new ApiError('No customer issue was supplied to the analysis request.'));
    }

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timedOut = false;
    var cancelled = false;

    var timer = setTimeout(function () {
      timedOut = true;
      if (controller) controller.abort();
    }, timeoutMs);

    if (o.signal && controller) {
      if (o.signal.aborted) {
        cancelled = true;
        controller.abort();
      } else {
        o.signal.addEventListener('abort', function () {
          cancelled = true;
          controller.abort();
        });
      }
    }

    function settle(value) { clearTimeout(timer); return value; }
    function fail(err) {
      clearTimeout(timer);
      if (timedOut) {
        throw new ApiError('The analysis request timed out after ' + Math.round(timeoutMs / 1000) +
          ' seconds. The backend may still be processing — retry the analysis.');
      }
      if (cancelled || (err && err.name === 'AbortError')) {
        throw new ApiError('The analysis request was cancelled.');
      }
      if (err instanceof ApiError) throw err;
      throw new ApiError('Could not reach the analysis API at ' + CONFIG.baseUrl +
        '. Check that the backend is running and reachable from this browser.', { cause: err });
    }

    return fetch(CONFIG.baseUrl + CONFIG.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ customer_id: customerId, issue: String(issue) }),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        return readBody(res).then(function (body) {
          if (!res.ok) throw new ApiError(describeFailure(res.status, body), { status: res.status, body: body });

          if (!body || typeof body.result !== 'string' || !body.result.trim()) {
            throw new ApiError('The backend replied without a result to display.', { status: res.status, body: body });
          }

          var parsed = parseResult(body.result);
          if (!parsed.issue && !parsed.action && !parsed.response) {
            throw new ApiError('The backend result could not be read. Expected ISSUE:, RECOMMENDED ACTION: and CUSTOMER RESPONSE: sections.', { status: res.status, body: body });
          }

          return {
            id: body.customer_id || customerId,
            issue: parsed.issue,
            action: parsed.action,
            response: parsed.response,
            raw: parsed.raw,
            missing: parsed.missing,
            source: 'api',
            receivedAt: Date.now()
          };
        });
      })
      .then(settle, fail);
  }

  SIQ.api = { analyze: analyze, parseResult: parseResult, config: CONFIG, ApiError: ApiError };
})(window.SIQ);
