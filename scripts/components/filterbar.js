/* ==========================================================================
   filterbar.js — search + segmented filters, shared by list pages
   ========================================================================== */
(function (SIQ) {
  'use strict';

  /** Segmented filter control: [{key, label, count}] */
  function chips(options) {
    var o = options || {};
    return SIQ.dom.html`
      <div class="segmented" role="tablist" aria-label="${o.label || 'Filter'}">
        ${(o.items || []).map(function (item) {
          var active = item.key === o.value;
          return SIQ.dom.html`
            <button class="seg${active ? ' is-active' : ''}" role="tab" aria-selected="${active}"
                    data-action="${o.action}" data-value="${item.key}">
              ${item.label}
              ${item.count !== undefined ? SIQ.dom.raw('<span class="seg__count">' + item.count + '</span>') : ''}
            </button>`;
        })}
      </div>`;
  }

  /** Search input bound to a store slice. */
  function search(opts) {
    var o = opts || {};
    return SIQ.dom.html`
      <div class="filter-bar__search">
        <div class="input-wrap">
          ${SIQ.icon('search', 15)}
          <input class="input input--sm" type="search" value="${o.value || ''}"
                 placeholder="${o.placeholder || 'Search'}" aria-label="${o.placeholder || 'Search'}"
                 data-input="${o.name}" data-focus-key="${o.name}" autocomplete="off">
        </div>
      </div>`;
  }

  function select(opts) {
    var o = opts || {};
    return SIQ.dom.html`
      <select class="select" data-select="${o.name}" aria-label="${o.label || 'Select'}">
        ${(o.items || []).map(function (item) {
          return SIQ.dom.html`<option value="${item.value}" ${item.value === o.value ? 'selected' : ''}>${item.label}</option>`;
        })}
      </select>`;
  }

  /** Full bar: search, chips, optional select, right-hand slot. */
  function bar(opts) {
    var o = opts || {};
    return SIQ.dom.html`
      <div class="filter-bar">
        ${o.search ? search(o.search) : ''}
        ${o.chips ? chips(o.chips) : ''}
        ${o.select ? select(o.select) : ''}
        <div class="filter-bar__spacer"></div>
        ${o.right || ''}
      </div>`;
  }

  SIQ.FilterBar = { bar: bar, chips: chips, search: search, select: select };
})(window.SIQ);
