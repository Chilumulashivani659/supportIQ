/* ==========================================================================
   pages/tickets.js — active support queue with recommended actions
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'resolved', label: 'Resolved' }
  ];

  function filtered(state) {
    var f = state.filters.tickets;
    return SIQ.data.tickets.filter(function (t) {
      var okStatus = f.status === 'all' || t.status === f.status;
      var haystack = [t.id, t.issue, t.category, t.customer.name, t.customer.id, t.agent].join(' ');
      return okStatus && (!f.q || SIQ.fmt.match(haystack, f.q));
    }).sort(function (a, b) {
      var order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
      return a.mins - b.mins;
    });
  }

  function slaBar(ticket) {
    if (ticket.status === 'resolved') return SIQ.dom.html`<span class="badge badge--slate badge--sm">${ticket.sla}</span>`;
    var tone = ticket.slaRatio > 0.8 ? 'red' : ticket.slaRatio > 0.5 ? 'amber' : 'green';
    return SIQ.dom.html`
      <div style="min-width:96px">
        <div class="t-xs ink-3" style="margin-bottom:4px">${ticket.sla}</div>
        <div class="meter"><div class="meter__fill meter__fill--${tone}" style="width:${Math.round(ticket.slaRatio * 100)}%"></div></div>
      </div>`;
  }

  function render(state) {
    var f = state.filters.tickets;
    var rows = filtered(state);

    var counts = {};
    FILTERS.forEach(function (x) {
      counts[x.key] = x.key === 'all'
        ? SIQ.data.tickets.length
        : SIQ.data.tickets.filter(function (t) { return t.status === x.key; }).length;
    });

    var openCount = SIQ.data.tickets.filter(function (t) { return t.status !== 'resolved'; }).length;
    var critical = SIQ.data.tickets.filter(function (t) { return t.priority === 'Critical' && t.status !== 'resolved'; }).length;

    var table = SIQ.DataTable.render({
      columns: [
        { key: 'id', label: 'Ticket' },
        { key: 'customer', label: 'Customer' },
        { key: 'issue', label: 'Issue' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'action', label: 'Recommended Action' },
        { key: 'sla', label: 'SLA' },
        { key: 'actions', label: '', cls: 'cell-actions' }
      ],
      rows: rows.map(function (t) {
        return {
          cls: 'is-clickable',
          attrs: 'data-action="open-ticket" data-value="' + t.id + '"',
          cells: {
            id: SIQ.dom.html`
              <div class="ticket-id">${t.id}</div>
              <div class="cell-primary__meta">${t.channel} · ${SIQ.fmt.ago(t.opened)}</div>`,
            customer: SIQ.dom.html`
              <div class="cell-primary">
                <span class="avatar avatar--sm ${SIQ.dom.avatarTone(t.customerId)}">${SIQ.dom.initials(t.customer.name)}</span>
                <div style="min-width:0">
                  <div class="cell-primary__name">${t.customer.name}</div>
                  <div class="cell-primary__meta mono">${t.customerId}</div>
                </div>
              </div>`,
            issue: SIQ.dom.html`
              <span class="t-sm ink-2">${t.issue}</span>
              <div class="cell-primary__meta">${t.category}</div>`,
            priority: SIQ.StatusBadge.priority(t.priority),
            status: SIQ.StatusBadge.ticket(t.status),
            action: SIQ.dom.html`
              <div class="ai-cell">
                <span class="ai-chip">${SIQ.icon('sparkle', 10, { strokeWidth: 2.2 })} MEMORY</span>
                <span class="t-sm ink-2">${t.action}</span>
              </div>
              <div class="cell-primary__meta">Read from ${t.memoryRefs} memor${t.memoryRefs === 1 ? 'y' : 'ies'}</div>`,
            sla: slaBar(t),
            actions: SIQ.dom.html`
              <span class="row-actions">
                <button class="btn btn--sm" data-action="open-ticket" data-value="${t.id}">Open</button>
              </span>`
          }
        };
      }),
      empty: SIQ.dom.html`
        <div class="card">
          ${SIQ.States.empty({
            icon: 'inbox',
            title: 'No tickets match these filters',
            desc: 'Adjust the status filter or search by ticket ID, customer, issue or agent.',
            action: SIQ.dom.html`<button class="btn btn--sm mt-3" data-action="reset-ticket-filters">${SIQ.icon('refresh', 14)} Reset filters</button>`
          })}
        </div>`,
      foot: SIQ.dom.html`
        <span>Showing ${rows.length} of ${SIQ.data.tickets.length} tickets · ${openCount} active</span>
        <span>${critical} critical priority</span>`
    });

    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Active Tickets</h1>
          <p class="page-head__sub">Each ticket carries the action SupportIQ recommends from that customer's memory.</p>
        </div>
        <div class="page-head__actions">
          <span class="count-pill">${SIQ.icon('inbox', 13)} ${openCount} active</span>
          <button class="btn" data-action="export-tickets">${SIQ.icon('download', 15)} Export queue</button>
        </div>
      </div>

      ${SIQ.FilterBar.bar({
        search: { name: 'ticketsQ', value: f.q, placeholder: 'Search ticket, customer or issue' },
        chips: {
          action: 'filter-tickets', value: f.status, label: 'Ticket status',
          items: FILTERS.map(function (x) { return { key: x.key, label: x.label, count: counts[x.key] }; })
        },
        right: SIQ.dom.html`
          <span class="t-xs ink-4">Sorted by priority</span>
          <button class="btn btn--sm" data-action="reset-ticket-filters">${SIQ.icon('refresh', 14)} Reset</button>`
      })}

      ${table}`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.tickets = { render: render };
})(window.SIQ);
