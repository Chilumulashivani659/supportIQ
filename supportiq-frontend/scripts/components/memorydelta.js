/* ==========================================================================
   memorydelta.js — ordinary support vs memory-powered support
   The most visually distinctive comparison in the product.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function marked(text, highlights) {
    var out = SIQ.dom.esc(text);
    (highlights || []).forEach(function (h) {
      var needle = SIQ.dom.esc(h);
      out = out.split(needle).join('<mark>' + needle + '</mark>');
    });
    return out;
  }

  function render(delta, memory) {
    return SIQ.dom.raw(SIQ.dom.html`
      <section class="delta anim-up">
        <div class="delta__head">
          <div class="row gap-2">
            <span class="delta__head-title">${SIQ.icon('arrowUpDown', 16)} Memory Delta</span>
            <span class="badge badge--sm badge--indigo">Same ticket · different decision</span>
          </div>
          <span class="t-xs ink-4">${memory ? memory.records + ' stored memories · ' + memory.tickets + ' previous tickets' : ''}</span>
        </div>
        <div class="delta__body">
          <div class="delta-panel delta-panel--without">
            <div>
              <span class="delta-label">${SIQ.icon('minus', 12)} Without memory</span>
              <p class="delta-text">${delta.without}</p>
            </div>
            <div class="delta-foot">${SIQ.icon('info', 12)} A single report, treated as a single report.</div>
          </div>

          <div class="delta-connector" aria-hidden="true">
            <div class="delta-connector__line"></div>
            <div class="delta-connector__badge">${SIQ.icon('arrowRight', 17)}</div>
            <div class="delta-connector__label">Memory changes the support decision</div>
            <div class="delta-connector__line"></div>
          </div>

          <div class="delta-panel delta-panel--with">
            <span class="delta-label">${SIQ.icon('sparkle', 12)} With memory</span>
            <p class="delta-text">${SIQ.dom.raw(marked(delta.with, delta.highlights))}</p>
            <div class="delta-chips">
              ${(delta.chips || []).map(function (c) { return SIQ.dom.html`<span class="tag">${c}</span>`; })}
            </div>
          </div>
        </div>
      </section>`);
  }

  SIQ.MemoryDelta = { render: render };
})(window.SIQ);
