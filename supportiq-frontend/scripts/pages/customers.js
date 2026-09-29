/* ==========================================================================
   pages/customers.js — customer directory with memory coverage
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'recurring', label: 'Recurring Issues' },
    { key: 'escalated', label: 'Escalated' },
    { key: 'resolved', label: 'Resolved' }
  ];

  function filtered(state) {
    var f = state.filters.customers;
    return SIQ.data.customers.filter(function (c) {
      var okStatus = f.status === 'all' || c.status === f.status;
      var haystack = [c.id, c.name, c.issue, c.plan, c.router, c.zone].join(' ');
      return okStatus && (!f.q || SIQ.fmt.match(haystack, f.q));
    });
  }

  function render(state) {
    var f = state.filters.customers;
    var rows = filtered(state);

    var counts = {};
    FILTERS.forEach(function (x) {
      counts[x.key] = x.key === 'all'
        ? SIQ.data.customers.length
        : SIQ.data.customers.filter(function (c) { return c.status === x.key; }).length;
    });

    var table = SIQ.DataTable.render({
      columns: [
        { key: 'customer', label: 'Customer' },
        { key: 'plan', label: 'Plan' },
        { key: 'issue', label: 'Current Issue' },
        { key: 'status', label: 'Status' },
        { key: 'last', label: 'Last Interaction' },
        { key: 'memory', label: 'Memory' },
        { key: 'actions', label: '', cls: 'cell-actions' }
      ],
      rows: rows.map(function (c) {
        return {
          cls: 'is-clickable',
          attrs: 'data-action="open-customer" data-value="' + c.id + '"',
          cells: {
            customer: SIQ.dom.html`
              <div class="cell-primary">
                <span class="avatar avatar--sm ${SIQ.dom.avatarTone(c.id)}">${SIQ.dom.initials(c.name)}</span>
                <div style="min-width:0">
                  <div class="cell-primary__name">${c.name}</div>
                  <div class="cell-primary__meta mono">${c.id} · ${c.zone}</div>
                </div>
              </div>`,
            plan: SIQ.dom.html`<span class="t-sm">${c.plan}</span><div class="cell-primary__meta">${c.connection} · ${c.router}</div>`,
            issue: SIQ.dom.html`<span class="t-sm ink-2">${c.issue}</span>`,
            status: SIQ.StatusBadge.customer(c.status),
            last: SIQ.dom.html`<span class="t-sm cell-num">${SIQ.fmt.ago(c.lastInteraction)}</span>`,
            memory: SIQ.dom.html`
              <div class="row gap-2">
                ${SIQ.StatusBadge.coverage(c.coverage)}
                <span class="t-xs ink-4">${c.memories} record${c.memories === 1 ? '' : 's'}</span>
              </div>`,
            actions: SIQ.dom.html`
              <span class="row-actions">
                <button class="btn btn--sm" data-action="open-customer" data-value="${c.id}">Open intelligence</button>
              </span>`
          }
        };
      }),
      empty: SIQ.dom.html`
        <div class="card">
          ${SIQ.States.empty({
            icon: 'users',
            title: 'No customers match these filters',
            desc: 'Try a different status filter, or search by customer ID, name, plan or issue text.',
            action: SIQ.dom.html`
              <button class="btn btn--sm mt-3" data-action="reset-customer-filters">${SIQ.icon('refresh', 14)} Reset filters</button>`
          })}
        </div>`,
      foot: SIQ.dom.html`
        <span>Showing ${rows.length} of ${SIQ.data.customers.length} customers</span>
        <span>${SIQ.data.memoryTotals.records} memory records across ${SIQ.data.memoryTotals.customers} customers</span>`
    });

    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Customers</h1>
          <p class="page-head__sub">Every account with its plan context, current issue and memory coverage.</p>
        </div>
        <div class="page-head__actions">
          <span class="count-pill">${SIQ.icon('layers', 13)} ${SIQ.data.memoryTotals.records} memories</span>
          <button class="btn" data-action="export-customers">${SIQ.icon('download', 15)} Export</button>
        </div>
      </div>

      ${SIQ.FilterBar.bar({
        search: { name: 'customersQ', value: f.q, placeholder: 'Search name, ID, plan or issue' },
        chips: {
          action: 'filter-customers', value: f.status, label: 'Customer status',
          items: FILTERS.map(function (x) { return { key: x.key, label: x.label, count: counts[x.key] }; })
        },
        right: SIQ.dom.html`
          <span class="t-xs ink-4">Sorted by most recent interaction</span>
          <button class="btn btn--sm" data-action="reset-customer-filters">${SIQ.icon('refresh', 14)} Reset</button>`
      })}

      ${table}`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.customers = { render: render };
})(window.SIQ);
