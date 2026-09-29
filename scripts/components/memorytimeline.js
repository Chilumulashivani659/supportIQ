/* ==========================================================================
   memorytimeline.js — the customer's memory timeline, newest first
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var TONE = { report: 'slate', troubleshooting: 'indigo', outcome: 'green', pattern: 'amber', recommendation: 'violet' };

  function render(customer, analysis) {
    var entries = SIQ.data.memoryFor(customer.id);
    var highlightIds = {};
    (analysis ? analysis.insights : []).forEach(function (i) {
      (i.evidence || []).forEach(function (e) { highlightIds[e.text] = true; });
    });

    if (!entries.length) {
      return SIQ.dom.raw(SIQ.dom.html`
        <div class="card">
          <div class="card__head"><div class="card__title">${SIQ.icon('history', 16)} Customer Memory Timeline</div></div>
          <div class="card__body">
            ${SIQ.States.memory({
              title: 'No timeline yet',
              desc: 'Every report, troubleshooting step and outcome is stored here as the relationship continues.'
            })}
          </div>
        </div>`);
    }

    return SIQ.dom.raw(SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('history', 16)} Customer Memory Timeline</div>
            <div class="card__sub">${entries.length} stored interactions${analysis && analysis.memory ? ' · ' + analysis.memory.window : ''}</div>
          </div>
          <button class="btn btn--sm btn--ghost" data-action="open-memory-log">Open memory log</button>
        </div>
        <div class="card__body">
          <div class="timeline">
            ${entries.map(function (e, i) {
              var type = SIQ.data.memoryTypes[e.type];
              var tone = TONE[e.type] || 'slate';
              var isCurrent = i === 0 && e.type === 'report';
              return SIQ.dom.html`
                <div class="tl-item tl-item--${tone}${isCurrent ? ' tl-item--active' : ''}">
                  <div class="tl-card">
                    <div class="row-b" style="align-items:flex-start;gap:8px">
                      <div class="grow" style="min-width:0">
                        <div class="row gap-2 wrap" style="margin-bottom:3px">
                          <span class="badge badge--sm badge--${type.tone}">${type.label}</span>
                          ${e.outcome ? SIQ.StatusBadge.outcome(e.outcome) : ''}
                          ${e.usedIn ? SIQ.dom.raw('<span class="badge badge--sm badge--slate">Used in ' + e.usedIn + ' recommendations</span>') : ''}
                        </div>
                        <div class="tl-card__title">${e.title}</div>
                        <div class="tl-card__sum">${e.summary}</div>
                      </div>
                      <div class="col" style="align-items:flex-end;flex:none;gap:2px">
                        <span class="tl-card__date">${SIQ.fmt.shortDate(e.date)}</span>
                        ${e.ticket ? SIQ.dom.raw('<span class="tl-card__date mono">' + e.ticket + '</span>') : ''}
                      </div>
                    </div>
                  </div>
                </div>`;
            })}
          </div>
        </div>
      </div>`);
  }

  SIQ.MemoryTimeline = { render: render, TONE: TONE };
})(window.SIQ);
