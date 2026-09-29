/* ==========================================================================
   states.js — empty, error and loading states
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function empty(opts) {
    var o = opts || {};
    return SIQ.dom.html`
      <div class="state">
        <div class="state__icon">${SIQ.icon(o.icon || 'search', 22)}</div>
        <div class="state__title">${o.title || 'No results'}</div>
        <div class="state__desc">${o.desc || 'Try a different search or filter.'}</div>
        ${o.action || ''}
        ${o.meta ? SIQ.dom.raw('<div class="state__meta">' + SIQ.dom.esc(o.meta) + '</div>') : ''}
      </div>`;
  }

  function error(opts) {
    var o = opts || {};
    return SIQ.dom.html`
      <div class="state state--error">
        <div class="state__icon">${SIQ.icon(o.icon || 'alertCircle', 22)}</div>
        <div class="state__title">${o.title || 'Something went wrong'}</div>
        <div class="state__desc">${o.desc || 'The request could not be completed.'}</div>
        ${o.action || ''}
        ${o.meta ? SIQ.dom.raw('<div class="state__meta">' + SIQ.dom.esc(o.meta) + '</div>') : ''}
      </div>`;
  }

  function memory(opts) {
    var o = opts || {};
    return SIQ.dom.html`
      <div class="state state--memory">
        <div class="state__icon">${SIQ.icon('layers', 22)}</div>
        <div class="state__title">${o.title || 'No memory for this customer yet'}</div>
        <div class="state__desc">${o.desc || 'SupportIQ builds a memory as support interactions happen. This customer has no stored history yet.'}</div>
        ${o.action || ''}
      </div>`;
  }

  /** Skeleton grid used while a page or workspace loads. */
  function skeletons(spec) {
    var s = spec || {};
    var cards = s.cards || 4;
    return SIQ.dom.html`
      <div>
        <div class="skel" style="height:22px;width:38%;margin-bottom:14px"></div>
        <div class="skel" style="height:13px;width:56%;margin-bottom:22px"></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px">
          ${Array.from({ length: cards }, function () {
            return SIQ.dom.html`<div class="skel skel-card"></div>`;
          })}
        </div>
      </div>`;
  }

  SIQ.States = { empty: empty, error: error, memory: memory, skeletons: skeletons };
})(window.SIQ);
