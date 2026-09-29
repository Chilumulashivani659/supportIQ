/* ==========================================================================
   currentissue.js — the reported problem and the main Analyze action
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function render(c, ws) {
    var ticket = SIQ.data.tickets.filter(function (t) { return t.customerId === c.id; })[0];
    var busy = ws.phase === 'analyzing';
    var hasResult = ws.phase === 'ready';
    // Once the analysis has run, the issue shown is the one the API parsed
    // out of the report. Before that, the customer's own words.
    var issueText = (hasResult && ws.result && ws.result.issue) ? ws.result.issue : c.currentMessage;

    var button;
    if (busy) {
      button = SIQ.dom.html`
        <button class="btn btn--analyze is-busy" disabled>
          <span class="spinner"></span> Analyzing…
        </button>`;
    } else if (hasResult) {
      button = SIQ.dom.html`
        <button class="btn btn--analyze" data-action="analyze">
          ${SIQ.icon('refresh', 17)} Re-analyze issue
        </button>`;
    } else {
      button = SIQ.dom.html`
        <button class="btn btn--analyze" data-action="analyze">
          ${SIQ.icon('sparkles', 18, { strokeWidth: 1.9 })} Analyze Issue
        </button>`;
    }

    var hint = busy
      ? SIQ.dom.html`<span class="issue__actions-note">${SIQ.icon('info', 13)} Reading stored interactions…</span>`
      : hasResult
        ? SIQ.dom.html`<span class="issue__actions-note">${SIQ.icon('checkCircle', 13)} Issue parsed from the report by the analysis API</span>`
        : SIQ.dom.html`<span class="issue__actions-note">${SIQ.icon('database', 13)} Matches this issue against ${c.memories} stored memories across previous tickets</span>`;

    return SIQ.dom.raw(SIQ.dom.html`
      <div class="card card--pad">
        <div class="row-b" style="align-items:flex-start">
          <div class="eyebrow">Current Customer Issue</div>
          ${SIQ.StatusBadge.priority(c.priority)}
        </div>

        <div class="issue__quote-wrap mt-4">
          <p class="issue__quote">${issueText}</p>
        </div>

        <div class="issue__meta">
          <span class="issue__meta-item">${SIQ.icon('phone', 14)} Reported by phone</span>
          <span class="issue__meta-item">${SIQ.icon('clock', 14)} ${SIQ.fmt.ago(c.openSince)}</span>
          ${ticket ? SIQ.dom.raw('<span class="issue__meta-item">' + SIQ.icon('clipboard', 14).__siqRaw + ' Ticket ' + ticket.id + '</span>') : ''}
          <span class="issue__meta-item">${SIQ.icon('layers', 14)} ${c.memories} memories stored</span>
          <span class="issue__meta-item">${SIQ.icon('hash', 14)} ${c.plan}</span>
        </div>

        <div class="issue__actions">
          ${button}
          ${hint}
        </div>
      </div>`);
  }

  SIQ.CurrentIssue = { render: render };
})(window.SIQ);
