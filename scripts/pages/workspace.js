/* ==========================================================================
   pages/workspace.js — Customer Intelligence workspace (the core screen)
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var STEPS_UI = [
    { label: 'Analyzing customer issue…', meta: 'Parsing the reported symptom and the affected service' },
    { label: 'Reviewing historical interactions…', meta: 'Loading every stored memory for this customer' },
    { label: 'Detecting recurring patterns…', meta: 'Comparing this ticket with previous outcomes' },
    { label: 'Generating support recommendation…', meta: 'Choosing the next step from recorded fix results' }
  ];

  function stepRow(i, state) {
    var cls = i < state ? 'is-done' : i === state ? 'is-active' : 'is-pending';
    var marker = cls === 'is-done'
      ? SIQ.icon('check', 13, { strokeWidth: 2.6 })
      : cls === 'is-active' ? '<span class="spinner" style="width:12px;height:12px"></span>' : '';
    return SIQ.dom.html`
      <div class="analyze-step ${cls}">
        <span class="analyze-step__marker">${SIQ.dom.raw(marker)}</span>
        <div class="grow">
          <div class="analyze-step__label">${STEPS_UI[i].label}</div>
          <div class="analyze-step__meta">${STEPS_UI[i].meta}</div>
        </div>
      </div>`;
  }

  /* --------------------------------------------------------- pre-analysis */
  function idleCard(c) {
    var noMemory = c.coverage === 'none';
    return SIQ.dom.html`
      <div class="card anim-up">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('sparkles', 16)} Ready to analyze</div>
            <div class="card__sub">SupportIQ reads stored memory first, then recommends — it never guesses from the ticket alone.</div>
          </div>
          <span class="badge badge--slate">Not yet analyzed</span>
        </div>
        <div class="card__body">
          ${noMemory ? SIQ.dom.html`
            <div class="row-t gap-3 mb-4" style="padding:12px 13px;border-radius:var(--r-md);background:var(--purple-50);border:1px solid var(--purple-100)">
              <span style="color:var(--purple-600)">${SIQ.icon('layers', 17)}</span>
              <div>
                <div class="strong" style="font-size:13px">This customer has no memory yet</div>
                <div class="t-xs ink-3">Analysis will still run, but the recommendation will be based on the current report only.</div>
              </div>
            </div>` : ''}
          <div class="analyze__steps">
            ${STEPS_UI.map(function (_, i) { return stepRow(i, 99); })}
          </div>
          <div class="row gap-2 wrap" style="padding-top:4px;border-top:1px dashed var(--border)">
            <span class="tag">${SIQ.icon('database', 12)} ${c.memories} memories</span>
            <span class="tag">${SIQ.icon('clipboard', 12)} ${c.openTickets} open tickets</span>
            <span class="tag">${SIQ.icon('clock', 12)} Last contact ${SIQ.fmt.ago(c.lastInteraction)}</span>
            <span class="tag">${SIQ.icon('shieldCheck', 12)} No customer data leaves the platform</span>
          </div>
        </div>
      </div>`;
  }

  /* -------------------------------------------------------------- running */
  function runningCard(state) {
    var ws = state.ws;
    return SIQ.dom.html`
      <div class="card anim-up">
        <div class="analyze">
          <div class="analyze__head">
            <span class="spinner spinner-lg" style="color:var(--indigo-600)"></span>
            <div class="grow">
              <div class="analyze__title">Analyzing customer issue…</div>
              <div class="analyze__sub">Running the memory read for ${ws.id}. This usually takes a few seconds.</div>
            </div>
            <span class="badge badge--indigo badge--dot">Intelligence engine</span>
          </div>

          <div class="progress mt-5"><div class="progress__fill" style="width:${ws.progress}%"></div></div>

          <div class="analyze__steps">
            ${STEPS_UI.map(function (_, i) { return stepRow(i, ws.step); })}
          </div>

          <div class="analyze__log">
            ${ws.log.length
              ? ws.log.map(function (line) { return SIQ.dom.html`<div class="analyze__log-line">› ${line}</div>`; })
              : SIQ.dom.html`<div class="analyze__log-line ink-4">› Preparing memory reader…</div>`}
          </div>

          <div class="analyze__foot">
            <span class="analyze__elapsed">${ws.elapsed.toFixed(1)}s elapsed</span>
            <span class="t-xs ink-4">Reading stored outcomes only — no live diagnostics are run.</span>
          </div>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------------- error */
  function errorCard(state) {
    var ws = state.ws;
    return SIQ.dom.html`
      <div class="card anim-up">
        ${SIQ.States.error({
          title: ws.error ? ws.error.title : 'Analysis could not be completed',
          desc: ws.error ? ws.error.desc : 'The memory index did not respond.',
          action: SIQ.dom.html`
            <div class="row gap-2 mt-3">
              <button class="btn btn--primary" data-action="analyze">${SIQ.icon('refresh', 15)} Retry analysis</button>
              <a class="btn" href="#/memory" data-nav="memory">${SIQ.icon('layers', 15)} Open memory records</a>
            </div>`,
          meta: 'The backend did not return an analysis. Retrying the same issue is safe.'
        })}
      </div>`;
  }

  /* ------------------------------------------------------------ no memory */
  function noMemoryCard(c) {
    return SIQ.dom.html`
      <div class="card anim-up">
        <div class="card__head">
          <div class="card__title">${SIQ.icon('layers', 16)} No memory to read</div>
          <span class="badge badge--slate">First interaction</span>
        </div>
        <div class="card__body">
          ${SIQ.States.memory({
            title: 'SupportIQ has no history for this customer',
            desc: 'Nothing has been stored for ' + c.name + ' yet, so the recommendation can only reflect the current report. This interaction will become the first memory record.',
            action: SIQ.dom.html`
              <div class="row gap-2 mt-3">
                <button class="btn btn--sm" data-action="analyze">${SIQ.icon('refresh', 14)} Run again</button>
                <a class="btn btn--sm btn--indigo-soft" href="#/customers" data-nav="customers">${SIQ.icon('users', 14)} Browse customers with memory</a>
              </div>`
          })}
          <div class="row gap-2 wrap" style="justify-content:center;border-top:1px dashed var(--border);padding-top:16px">
            <span class="tag">${SIQ.icon('plus', 12)} This report will be stored</span>
            <span class="tag">${SIQ.icon('layers', 12)} Enables pattern detection next time</span>
            <span class="tag">${SIQ.icon('shieldCheck', 12)} Agent reviews before anything is sent</span>
          </div>
        </div>
      </div>`;
  }

  /* -------------------------------------------------------------- results */

  /**
   * The analysis API returns the issue, the recommended action and the
   * customer response. Panels that the API does not answer keep their place in
   * the layout, but say plainly that the API sent no data for them instead of
   * showing invented content. Memory Insight and the Memory Timeline are the
   * exception: both read the customer's own stored memory records.
   */
  function notInApi(opts) {
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon(opts.icon, 16)} ${opts.title}</div>
            ${opts.sub ? SIQ.dom.html`<div class="card__sub">${opts.sub}</div>` : ''}
          </div>
          <span class="badge badge--slate">Not returned by the API</span>
        </div>
        <div class="card__body">
          ${SIQ.States.empty({
            icon: opts.icon,
            title: 'This panel is not part of the analysis response',
            desc: 'POST /api/analyze returns the issue, the recommended action and the customer response. “' + opts.title + '” is not among them, so there is nothing to show here.',
            meta: 'No placeholder content is generated for fields the API does not return.'
          })}
        </div>
      </div>`;
  }

  function results(state) {
    var ws = state.ws;
    var a = ws.result;
    var ticket = SIQ.data.tickets.filter(function (t) { return t.customerId === ws.id; })[0];

    var recommendation = a.action
      ? SIQ.RecommendationCard.render({ title: a.action }, ws, ticket ? ticket.id : '')
      : notInApi({ icon: 'target', title: 'Recommended Next Action' });

    return SIQ.dom.html`
      <div class="anim-up">${notInApi({ icon: 'arrowUpDown', title: 'Memory Delta' })}</div>

      <div class="ws-grid mt-5">
        <div class="ws-col">
          ${SIQ.MemoryInsight.render(SIQ.data.customer(ws.id), state.ws.expanded)}
          ${SIQ.MemoryTimeline.render(SIQ.data.customer(ws.id), null)}
          ${notInApi({ icon: 'database', title: 'Memory used in this analysis' })}
        </div>
        <div class="ws-col">
          ${notInApi({ icon: 'cpu', title: 'Support Intelligence', sub: 'What the stored history says about this ticket' })}
          ${notInApi({ icon: 'lightbulb', title: 'Why this recommendation?' })}
          ${recommendation}
          ${notInApi({ icon: 'alert', title: 'Escalation Status', sub: 'Escalation is a decision, not an automatic step' })}
        </div>
      </div>

      <div class="mt-5">${SIQ.CustomerResponse.render(ws)}</div>`;
  }

  /* ----------------------------------------------------------- memory log */
  function memoryLog(state) {
    var c = SIQ.data.customer(state.ws.id);
    var entries = SIQ.data.memoryFor(c.id);
    if (!entries.length) {
      return SIQ.dom.html`<div class="card">${SIQ.States.memory({ title: 'No memory records stored for this customer' })}</div>`;
    }
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('database', 16)} Memory log · ${c.id}</div>
            <div class="card__sub">${entries.length} stored records, newest first. Expand any record to see how it was used.</div>
          </div>
          <a class="btn btn--sm btn--ghost" href="#/memory" data-nav="memory">Open memory page ${SIQ.icon('arrowRight', 13)}</a>
        </div>
        <div class="card__body">
          ${entries.map(function (e) {
            var type = SIQ.data.memoryTypes[e.type];
            var key = e.id;
            var open = !!state.ws.expanded[key];
            return SIQ.dom.html`
              <div class="mem-entry">
                <button class="mem-entry__head" data-action="toggle-memory" data-value="${key}" aria-expanded="${open}">
                  <span class="mem-entry__type tone-${SIQ.MemoryTimeline.TONE[e.type]}">${SIQ.icon(type.icon, 12)} ${type.short}</span>
                  <span class="mem-entry__body">
                    <span class="mem-entry__title">${e.title}</span>
                    <span class="mem-entry__meta">
                      ${SIQ.fmt.mediumDate(e.date)}
                      ${e.ticket ? '· ' + e.ticket : ''}
                      ${e.outcome ? '· ' + SIQ.data.outcomeMeta[e.outcome].label : ''}
                    </span>
                  </span>
                  ${e.outcome ? SIQ.StatusBadge.outcome(e.outcome) : ''}
                  <span class="mem-entry__chev${open ? ' is-open' : ''}">${SIQ.icon('chevronDown', 15)}</span>
                </button>
                ${open ? SIQ.dom.html`
                  <div class="mem-entry__detail">
                    <div class="mem-entry__detail-grid">
                      <div class="mem-kv"><span class="mem-kv__k">Record</span><span class="mem-kv__v mono">${e.id}</span></div>
                      <div class="mem-kv"><span class="mem-kv__k">Summary</span><span class="mem-kv__v">${e.summary}</span></div>
                      <div class="mem-kv"><span class="mem-kv__k">Type</span><span class="mem-kv__v">${type.label}</span></div>
                      <div class="mem-kv"><span class="mem-kv__k">Outcome</span><span class="mem-kv__v">${e.outcome ? SIQ.data.outcomeMeta[e.outcome].label : 'Not recorded'}</span></div>
                      <div class="mem-kv"><span class="mem-kv__k">Used in</span><span class="mem-kv__v">${e.usedIn ? e.usedIn + ' later recommendation' + (e.usedIn > 1 ? 's' : '') : 'Not yet reused'}</span></div>
                    </div>
                    <div class="mem-tags">${(e.tags || []).map(function (t) { return SIQ.dom.html`<span class="tag">${SIQ.icon('hash', 11)} ${t}</span>`; })}</div>
                  </div>` : ''}
              </div>`;
          })}
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------- not found */
  function notFound() {
    return SIQ.dom.html`
      <div class="card">
        ${SIQ.States.empty({
          icon: 'users',
          title: 'Customer not found',
          desc: 'That customer ID is not in the current directory. Search for an existing account to open its intelligence workspace.',
          action: SIQ.dom.html`
            <div class="row gap-2 mt-3">
              <a class="btn btn--primary" href="#/customers" data-nav="customers">${SIQ.icon('users', 15)} Browse customers</a>
              <a class="btn" href="#/overview" data-nav="overview">Back to overview</a>
            </div>`
        })}
      </div>`;
  }

  function render(state) {
    var c = SIQ.data.customer(state.route.param);
    if (!c) return notFound();

    var ws = state.ws;
    var tab = ws.tab;

    var body;
    if (ws.phase === 'analyzing') body = runningCard(state);
    else if (ws.phase === 'error') body = errorCard(state);
    else if (ws.phase === 'no-memory') body = noMemoryCard(c);
    else if (ws.phase === 'ready') body = tab === 'memory-log' ? memoryLog(state) : results(state);
    else body = idleCard(c);

    return SIQ.dom.html`
      <div class="ws-bar">
        <div class="ws-id grow">
          <a class="icon-btn" href="#/customers" data-nav="customers" aria-label="Back to customers" title="Back to customers">
            ${SIQ.icon('arrowLeft', 17)}
          </a>
          <div>
            <div class="row gap-2 wrap">
              <span class="ws-id__code">${c.id}</span>
              <span class="strong" style="font-size:14.5px;letter-spacing:-.016em">${c.name}</span>
              ${SIQ.StatusBadge.customer(c.status)}
            </div>
            <div class="t-xs ink-4" style="margin-top:2px">
              ${c.plan} · ${c.connection} · ${SIQ.fmt.ago(c.lastInteraction)} · ${c.memories} memories
            </div>
          </div>
        </div>
        ${ws.phase === 'ready' ? SIQ.dom.html`
          <div class="tabbar" style="border:0;margin:0">
            <button class="tab${tab === 'intelligence' ? ' is-active' : ''}" data-action="ws-tab" data-value="intelligence">
              ${SIQ.icon('sparkles', 15)} Intelligence
            </button>
            <button class="tab${tab === 'memory-log' ? ' is-active' : ''}" data-action="ws-tab" data-value="memory-log">
              ${SIQ.icon('database', 15)} Memory log <span class="tab__count">${c.memories}</span>
            </button>
          </div>` : ''}
      </div>

      ${SIQ.CustomerSummary.render(c)}
      <div class="mt-4">${SIQ.CurrentIssue.render(c, ws)}</div>
      <div class="mt-4">${body}</div>`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.workspace = { render: render, title: 'Customer Intelligence' };
})(window.SIQ);
