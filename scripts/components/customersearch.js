/* ==========================================================================
   customersearch.js — prominent customer search with live suggestions
   Searches customer ID, name, plan, issue text and ticket ID.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function matchCustomer(c, q) {
    return [c.id, c.name, c.issue, c.plan, c.zone].some(function (v) {
      return SIQ.fmt.match(v, q);
    });
  }

  function matchTicket(t, q) {
    return [t.id, t.issue, t.category].some(function (v) { return SIQ.fmt.match(v, q); });
  }

  function search(q) {
    var customers = SIQ.data.customers.filter(function (c) { return matchCustomer(c, q); }).slice(0, 6);
    var tickets = SIQ.data.tickets.filter(function (t) { return matchTicket(t, q); }).slice(0, 3);
    return { customers: customers, tickets: tickets };
  }

  function suggestions(state) {
    var q = (state.filters.overview.q || '').trim();
    if (q.length < 1) return '';

    var res = search(q);
    if (!res.customers.length && !res.tickets.length) {
      return SIQ.dom.html`
        <div class="suggest-list" role="listbox">
          <div class="palette__group">No match</div>
          <div style="padding:10px 12px 12px">
            <div class="t-sm ink-2 strong">No customer or ticket matches “${q}”.</div>
            <div class="t-xs ink-4 mt-2">Try a customer ID such as <button class="mono strong indigo" data-action="quick-search" data-value="ISP-1001" style="font:inherit">ISP-1001</button>, or clear the search.</div>
          </div>
        </div>`;
    }

    return SIQ.dom.html`
      <div class="suggest-list" role="listbox">
        ${res.customers.length ? SIQ.dom.raw('<div class="palette__group">Customers</div>') : ''}
        ${res.customers.map(function (c) {
          return SIQ.dom.html`
            <button class="suggest-item" data-action="open-customer" data-value="${c.id}" role="option">
              <span class="avatar avatar--sm ${SIQ.dom.avatarTone(c.id)}">${SIQ.dom.initials(c.name)}</span>
              <span class="grow" style="text-align:left">
                <span style="display:flex;align-items:center;gap:7px">
                  <span class="suggest-item__name">${c.name}</span>
                  <span class="suggest-item__id mono">${c.id}</span>
                </span>
                <span class="suggest-item__meta" style="display:block">${c.issue} · ${c.plan}</span>
              </span>
              ${SIQ.StatusBadge.customer(c.status)}
            </button>`;
        })}
        ${res.tickets.length ? SIQ.dom.raw('<div class="palette__group">Tickets</div>') : ''}
        ${res.tickets.map(function (t) {
          return SIQ.dom.html`
            <button class="suggest-item" data-action="open-ticket" data-value="${t.id}" role="option">
              <span class="ai-chip">${SIQ.icon('clipboard', 10, { strokeWidth: 2.2 })} TICKET</span>
              <span class="grow" style="text-align:left">
                <span style="display:flex;align-items:center;gap:7px">
                  <span class="suggest-item__name mono">${t.id}</span>
                  <span class="suggest-item__id">${t.customer.name}</span>
                </span>
                <span class="suggest-item__meta" style="display:block">${t.issue}</span>
              </span>
              ${SIQ.StatusBadge.ticket(t.status)}
            </button>`;
        })}
        <div class="pop__sep"></div>
        <button class="pop__item" data-action="open-customer-list">
          ${SIQ.icon('users', 15)}
          <span>
            <span class="pop__item-title">Browse all customers</span>
            <span class="pop__item-sub">${SIQ.data.customers.length} accounts with memory coverage</span>
          </span>
        </button>
      </div>`;
  }

  /**
   * render(state, {variant}) — hero variant is the large prominent block
   */
  function render(state, opts) {
    var o = opts || {};
    var q = state.filters.overview.q || '';

    var input = SIQ.dom.html`
      <div class="input-wrap" style="position:relative">
        ${SIQ.icon('search', 18)}
        <input class="input input--lg" type="search" value="${q}"
               placeholder="Search customer ID, name or ticket..."
               aria-label="Search customer ID, name or ticket"
               data-input="customerSearch" data-focus-key="customerSearch"
               autocomplete="off" spellcheck="false">
      </div>`;

    if (o.variant === 'hero') {
      return SIQ.dom.html`
        <div class="search-hero" data-search-root>
          <div class="search-hero__label">
            <div class="eyebrow">Start with a customer</div>
            <div class="t-xs ink-3 mt-2">Open a support intelligence workspace</div>
          </div>
          <div class="search-hero__field" style="position:relative">${input}${suggestions(state)}</div>
          <div class="search-hero__aside">
            <span class="tag">${SIQ.icon('database', 13)} ${SIQ.data.memoryTotals.records} memories indexed</span>
            <button class="btn btn--indigo-soft" data-action="open-customer-list">Browse all</button>
          </div>
        </div>`;
    }

    return SIQ.dom.html`<div data-search-root>${input}${suggestions(state)}</div>`;
  }

  function recentCustomers() {
    return SIQ.data.customers
      .filter(function (c) { return c.coverage !== 'none'; })
      .slice(0, 5);
  }

  SIQ.CustomerSearch = { render: render, search: search, recentCustomers: recentCustomers };
})(window.SIQ);
