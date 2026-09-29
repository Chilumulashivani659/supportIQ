/* ==========================================================================
   escalationcard.js — escalation position and the ladder that leads there
   Supports both states: not required yet, and escalation required.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var RUNGS = ['Monitor', 'Escalate', 'Field team'];

  function render(esc, ws) {
    var required = esc.state === 'required';
    var ladder = SIQ.data.escalations.filter(function (e) { return e.customerId === ws.id; })[0];
    var rungIndex = esc.ladder || 1;
    var alreadyEscalated = ws.escalated;

    return SIQ.dom.raw(SIQ.dom.html`
      <div class="card esc--${required ? 'required' : 'ok'}">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('alert', 16)} Escalation Status</div>
            <div class="card__sub">Escalation is a decision, not an automatic step</div>
          </div>
          <span class="badge ${required ? 'badge--red' : 'badge--green'} badge--dot">
            ${required ? 'Escalation required' : 'Not required'}
          </span>
        </div>
        <div class="card__body">
          <div class="esc__status">
            <span class="esc__status-ico">${SIQ.icon(required ? 'alert' : 'shieldCheck', 17)}</span>
            <div class="grow">
              <div class="esc__status-label">${required ? 'ESCALATION REQUIRED' : 'NOT REQUIRED YET'}</div>
              <div class="esc__status-sub">${esc.description}</div>
            </div>
          </div>

          <div class="esc__ladder">
            ${RUNGS.map(function (label, i) {
              var cls = i + 1 < rungIndex ? 'is-done' : i + 1 === rungIndex ? 'is-current' : '';
              return SIQ.dom.html`
                <div class="esc__rung ${cls}">
                  <span class="esc__rung-dot">${i + 1 < rungIndex ? SIQ.icon('check', 12, { strokeWidth: 2.6 }) : i + 1}</span>
                  <span class="esc__rung-label">${label}</span>
                </div>`;
            })}
          </div>

          <div class="esc__next">
            <span class="esc__next-label">Next step</span>
            <span class="esc__next-text">${esc.nextStep}</span>
          </div>

          <div class="row gap-2 wrap mt-4">
            ${required
              ? (alreadyEscalated
                ? SIQ.dom.html`<span class="badge badge--green badge--dot">Field team notified</span>`
                : SIQ.dom.html`<button class="btn btn--sm btn--danger" data-action="escalate">${SIQ.icon('alert', 14)} Notify field team</button>`)
              : (alreadyEscalated
                ? SIQ.dom.html`<span class="badge badge--red badge--dot">Escalated by agent</span>`
                : SIQ.dom.html`<button class="btn btn--sm" data-action="escalate">${SIQ.icon('arrowUpRight', 14)} Escalate anyway</button>`)}
            ${ladder ? SIQ.dom.html`<span class="badge badge--slate">${SIQ.icon('layers', 11)} ${ladder.id} · ${SIQ.data.escalationStatusLabel[ladder.status]}</span>` : ''}
          </div>
        </div>
      </div>`);
  }

  SIQ.EscalationCard = { render: render, RUNGS: RUNGS };
})(window.SIQ);
