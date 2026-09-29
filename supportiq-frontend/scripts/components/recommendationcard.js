/* ==========================================================================
   recommendationcard.js — the recommended next action
   Deliberately never styled as something already done: a recommendation is
   an outlined, flagged state that must be advanced explicitly.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var STATES = {
    recommended: {
      badge: 'badge badge--flag badge--flag-indigo',
      label: 'Recommended',
      modifier: '',
      note: 'Recommendation only — this action has not been performed yet.',
      primary: 'Mark as in progress',
      primaryIcon: 'play',
      secondary: 'Mark completed',
      secondaryIcon: 'check'
    },
    'in-progress': {
      badge: 'badge badge--flag badge--flag-indigo',
      label: 'In progress',
      modifier: 'rec--in-progress',
      note: 'Started by an agent. The diagnostic has not reported a result yet.',
      primary: 'Mark completed',
      primaryIcon: 'check',
      secondary: 'Reset to recommended',
      secondaryIcon: 'refresh'
    },
    completed: {
      badge: 'badge badge--flag badge--flag-green',
      label: 'Completed',
      modifier: 'rec--completed',
      note: 'Completed by the assigned agent. This is now a completed action, not a recommendation.',
      primary: 'Completed',
      primaryIcon: 'checkCircle',
      secondary: 'Undo completion',
      secondaryIcon: 'refresh'
    }
  };

  function stateTrack(state) {
    var order = ['recommended', 'in-progress', 'completed'];
    var current = order.indexOf(state);
    var labels = ['Recommended', 'In progress', 'Completed'];
    return SIQ.dom.html`
      <div class="rec__states">
        ${labels.map(function (l, i) {
          var cls = i < current ? 'is-done' : i === current ? (state === 'in-progress' ? 'is-current is-amber' : 'is-current') : '';
          return SIQ.dom.html`
            <span class="rec__state ${cls}">
              <span class="rec__state-dot"></span>${l}
            </span>`;
        })}
      </div>`;
  }

  function render(rec, ws, ticketId) {
    var state = ws.recState || 'recommended';
    var s = STATES[state] || STATES.recommended;
    var isDone = state === 'completed';

    return SIQ.dom.raw(SIQ.dom.html`
      <section class="rec ${s.modifier}">
        <div class="rec__head">
          <span class="rec__head-label">${SIQ.icon('target', 13)} Recommended Next Action</span>
          <span class="${s.badge}">${SIQ.icon(isDone ? 'checkCircle' : 'sparkle', 11, { strokeWidth: 2 })} ${s.label}</span>
        </div>
        <div class="rec__body">
          <div class="rec__title">${rec.title}</div>
          ${rec.sub ? SIQ.dom.html`<div class="rec__sub">${rec.sub}</div>` : ''}
          ${(rec.details && rec.details.length) ? SIQ.dom.html`
            <div class="rec__details">
              ${rec.details.map(function (d) {
                return SIQ.dom.html`<span class="rec__detail">${SIQ.icon('check', 12, { strokeWidth: 2.2 })} ${d}</span>`;
              })}
            </div>` : ''}
          <div class="rec__note">${SIQ.icon('info', 13)} <span>${s.note}</span></div>
        </div>
        <div class="rec__foot">
          ${stateTrack(state)}
          <div class="row gap-2 wrap">
            <button class="btn btn--sm" data-action="rec-primary" ${isDone ? 'disabled' : ''}>
              ${SIQ.icon(s.primaryIcon, 14, { strokeWidth: 2 })}${s.primary}
            </button>
            <button class="btn btn--sm btn--ghost" data-action="rec-secondary">${SIQ.icon(s.secondaryIcon, 13)} ${s.secondary}</button>
            ${ticketId ? SIQ.dom.html`<span class="badge badge--slate">${SIQ.icon('clipboard', 11)} ${ticketId}</span>` : ''}
          </div>
        </div>
      </section>`);
  }

  SIQ.RecommendationCard = { render: render, STATES: STATES };
})(window.SIQ);
