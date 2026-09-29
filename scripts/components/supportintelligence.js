/* ==========================================================================
   supportintelligence.js — three short memory-derived readings
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function render(intel) {
    return SIQ.dom.raw(SIQ.dom.html`
      <div class="card card--intel">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('cpu', 16)} Support Intelligence</div>
            <div class="card__sub">What the stored history says about this ticket</div>
          </div>
        </div>
        <div class="card__body card__body--tight">
          <div class="intel-trio">
            ${intel.map(function (cell) {
              return SIQ.dom.html`
                <div class="intel-cell tone-${cell.tone}">
                  <span class="intel-cell__ico">${SIQ.icon(cell.icon, 16)}</span>
                  <div class="grow" style="min-width:0">
                    <div class="intel-cell__label">${cell.label}</div>
                    <div class="intel-cell__value">${cell.value}</div>
                    <div class="intel-cell__meta">${cell.meta}</div>
                  </div>
                </div>`;
            })}
          </div>
        </div>
      </div>`);
  }

  SIQ.SupportIntelligence = { render: render };
})(window.SIQ);
