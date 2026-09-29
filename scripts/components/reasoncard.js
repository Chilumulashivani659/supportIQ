/* ==========================================================================
   reasoncard.js — why this recommendation, in plain language
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function render(reason) {
    return SIQ.dom.raw(SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div class="card__title">${SIQ.icon('lightbulb', 16)} Why this recommendation?</div>
        </div>
        <div class="card__body">
          <p class="reason__quote">${reason.text}</p>
          <div class="reason__focus">
            <span class="reason__focus-label">Next focus</span>
            <span class="reason__focus-value">${SIQ.icon('arrowRight', 15)} ${reason.nextFocus}</span>
          </div>
          <div class="reason__foot">${SIQ.icon('shieldCheck', 13)} <span>${reason.foot}</span></div>
        </div>
      </div>`);
  }

  SIQ.ReasonCard = { render: render };
})(window.SIQ);
