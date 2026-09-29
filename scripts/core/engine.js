/* ==========================================================================
   engine.js — runs the real analysis request behind the existing progress UI
   Sends the customer's current issue to POST /api/analyze and puts the
   returned sections into the workspace state. The step rows are presentation
   only: the analysis result always comes from the backend, never from a local
   fixture, and a run is only marked ready once the response has arrived.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var timers = [];
  var runId = 0;
  var controller = null;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function schedule(fn, ms) {
    var t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  }

  /**
   * Progress rows shown while the request is in flight. `log` feeds the
   * activity log; `ms` is when the next row becomes active. Neither decides
   * the outcome — only the API response does.
   */
  var STEPS = [
    { log: 'Reading the current report', ms: 900 },
    { log: 'Loading stored interactions for this customer', ms: 1500 },
    { log: 'Comparing this ticket with previous outcomes', ms: 1400 },
    { log: 'Building the recommended next action', ms: 1300 }
  ];

  function abortInFlight() {
    if (controller) {
      try { controller.abort(); } catch (e) { /* already settled */ }
      controller = null;
    }
  }

  /**
   * analyze(customerId) → drives store.ws through the staged flow and puts the
   * API result in ws.result on success, or ws.error on failure.
   */
  function analyze(customerId) {
    clearTimers();
    abortInFlight();
    var id = ++runId;

    var customer = SIQ.data.customer(customerId);
    if (!customer) return;

    controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var startedAt = Date.now();
    var currentStep = 0;

    SIQ.store.ws({
      phase: 'analyzing',
      step: 0,
      log: [],
      progress: 4,
      elapsed: 0,
      error: null,
      result: null,
      response: '',
      editing: false,
      sent: false,
      copied: false
    });

    var elapsedTick = setInterval(function () {
      if (id !== runId) return;
      SIQ.store.ws({ elapsed: (Date.now() - startedAt) / 1000 });
    }, 250);
    timers.push(elapsedTick);

    function advance() {
      if (id !== runId) return;
      var step = STEPS[currentStep];
      if (!step) return;
      SIQ.store.ws({
        step: currentStep,
        log: SIQ.store.state.ws.log.concat([step.log]),
        progress: Math.round(((currentStep + 0.35) / STEPS.length) * 100)
      });
      currentStep++;
      schedule(advance, step.ms);
    }

    advance();

    SIQ.api.analyze(customerId, customer.currentMessage, {
      signal: controller ? controller.signal : null
    })
      .then(function (result) {
        if (id !== runId) return;
        clearTimers();
        controller = null;
        SIQ.store.ws({
          phase: 'ready',
          step: STEPS.length,
          progress: 100,
          log: SIQ.store.state.ws.log.concat([
            'Analysis complete · ' + ((Date.now() - startedAt) / 1000).toFixed(1) + 's'
          ]),
          result: result,
          recState: 'recommended',
          response: result.response || '',
          editing: false,
          sent: false,
          copied: false
        });
      })
      .catch(function (err) {
        if (id !== runId) return;
        var message = (err && err.message) ? err.message : 'The analysis request failed.';
        // A cancelled run is superseded by a newer one, not a failure.
        if (/cancelled/i.test(message)) return;
        clearTimers();
        controller = null;
        SIQ.store.ws({
          phase: 'error',
          progress: 100,
          log: SIQ.store.state.ws.log.concat(['Analysis failed · ' + message]),
          error: {
            title: 'Analysis could not be completed',
            desc: message
          }
        });
      });
  }

  function cancel() {
    clearTimers();
    runId++;
    abortInFlight();
  }

  SIQ.engine = { analyze: analyze, cancel: cancel };
})(window.SIQ);
