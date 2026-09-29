/* ==========================================================================
   pages/escalations.js — cases that need a human decision
   Each row explains why escalation was reached from stored outcomes.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'needs-review', label: 'Needs Review' },
    { key: 'escalated', label: 'Escalated' },
    { key: 'resolved', label: 'Resolved' }
  ];

  function filtered(state) {
    var f = state.filters.escalations;
    return SIQ.data.escalations.filter(function (e) {
      var okStatus = f.status === 'all' || e.status === f.status;
      var haystack = [e.id, e.ticket, e.issue, e.reason, e.owner, e.nextStep, e.customer.name, e.customerId].join(' ');
      return okStatus && (!f.q || SIQ.fmt.match(haystack, f.q));
    }).sort(function (a, b) { return a.mins - b.mins; });
  }

  function summary(state) {
    var list = SIQ.data.escalations;
    var open = list.filter(function (e) { return e.status !== 'resolved'; });
    var critical = open.filter(function (e) { return e.severity === 'Critical'; });
    var review = open.filter(function (e) { return e.status === 'needs-review'; });
    var escalated = list.filter(function (e) { return e.status === 'escalated'; });
    var oldest = open.length ? Math.max.apply(null, open.map(function (e) { return e.mins; })) : 0;

    return SIQ.dom.html`
      <div class="esc-summary">
        <div class="esc-summary__cell tone-red">
          <span class="esc-summary__ico">${SIQ.icon('alert', 16)}</span>
          <span>
            <span class="esc-summary__value">${open.length}</span>
            <span class="esc-summary__label">Open cases</span>
          </span>
        </div>
        <div class="esc-summary__cell tone-indigo">
          <span class="esc-summary__ico">${SIQ.icon('target', 16)}</span>
          <span>
            <span class="esc-summary__value">${review.length}</span>
            <span class="esc-summary__label">Awaiting review</span>
          </span>
        </div>
        <div class="esc-summary__cell tone-amber">
          <span class="esc-summary__ico">${SIQ.icon('arrowUpRight', 16)}</span>
          <span>
            <span class="esc-summary__value">${escalated.length}</span>
            <span class="esc-summary__label">Sent onward</span>
          </span>
        </div>
        <div class="esc-summary__cell tone-slate">
          <span class="esc-summary__ico">${SIQ.icon('clock', 16)}</span>
          <span>
            <span class="esc-summary__value">${SIQ.fmt.ago(new Date(Date.now() - oldest * 60000).toISOString())}</span>
            <span class="esc-summary__label">Oldest open case${critical.length ? ' · ' + critical.length + ' critical' : ''}</span>
          </span>
        </div>
      </div>`;
  }

  function render(state) {
    var f = state.filters.escalations;
    var rows = filtered(state);

    var counts = {};
    FILTERS.forEach(function (x) {
      counts[x.key] = x.key === 'all'
        ? SIQ.data.escalations.length
        : SIQ.data.escalations.filter(function (e) { return e.status === x.key; }).length;
    });

    var table = SIQ.DataTable.render({
      columns: [
        { key: 'case', label: 'Case' },
        { key: 'customer', label: 'Customer' },
        { key: 'issue', label: 'Issue' },
        { key: 'severity', label: 'Severity' },
        { key: 'reason', label: 'Why escalated', cls: 'esc-table__reason' },
        { key: 'next', label: 'Next step' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: '', cls: 'cell-actions' }
      ],
      rows: rows.map(function (e) {
        return {
          cls: 'is-clickable',
          attrs: 'data-action="open-customer" data-value="' + e.customerId + '"',
          cells: {
            case: SIQ.dom.html`
              <div class="ticket-id">${e.id}</div>
              <div class="cell-primary__meta">${e.ticket} · ${SIQ.fmt.ago(e.raised)}</div>`,
            customer: SIQ.dom.html`
              <div class="cell-primary">
                <span class="avatar avatar--sm ${SIQ.dom.avatarTone(e.customerId)}">${SIQ.dom.initials(e.customer.name)}</span>
                <div style="min-width:0">
                  <div class="cell-primary__name">${e.customer.name}</div>
                  <div class="cell-primary__meta mono">${e.customerId}</div>
                </div>
              </div>`,
            issue: SIQ.dom.html`
              <span class="t-sm ink-2">${e.issue}</span>
              <div class="cell-primary__meta">${e.customer.memories} memories · ${e.customer.repeatRate} repeated</div>`,
            severity: SIQ.dom.html`
              ${SIQ.StatusBadge.priority(e.severity)}
              <div class="cell-primary__meta">Ladder ${e.ladder} of 3</div>`,
            reason: SIQ.dom.html`<span class="t-sm ink-3">${e.reason}</span>`,
            next: SIQ.dom.html`
              <span class="t-sm ink-2">${e.nextStep}</span>
              <div class="cell-primary__meta">${SIQ.icon('users', 11)} ${e.owner}</div>`,
            status: SIQ.StatusBadge.escalation(e.status),
            actions: SIQ.dom.html`
              <span class="row-actions">
                <button class="btn btn--sm" data-action="open-customer" data-value="${e.customerId}">Review</button>
              </span>`
          }
        };
      }),
      empty: SIQ.dom.html`
        <div class="card">
          ${SIQ.States.empty({
            icon: 'checkCircle',
            title: 'No escalations match these filters',
            desc: 'Nothing is waiting for a decision in this view. Switch status or clear the search.',
            action: SIQ.dom.html`<button class="btn btn--sm mt-3" data-action="reset-escalation-filters">${SIQ.icon('refresh', 14)} Reset filters</button>`
          })}
        </div>`,
      foot: SIQ.dom.html`
        <span>Showing ${rows.length} of ${SIQ.data.escalations.length} cases</span>
        <span>Escalation is raised from stored outcomes, never automatically</span>`
    });

    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Escalations</h1>
          <p class="page-head__sub">Cases where the stored history says the usual fixes are not working.</p>
        </div>
        <div class="page-head__actions">
          <span class="count-pill">${SIQ.icon('alert', 13)} ${SIQ.data.escalations.filter(function (e) { return e.status !== 'resolved'; }).length} open</span>
          <button class="btn" data-action="export-escalations">${SIQ.icon('download', 15)} Export queue</button>
        </div>
      </div>

      ${summary(state)}

      ${SIQ.FilterBar.bar({
        search: { name: 'escalationsQ', value: f.q, placeholder: 'Search case, ticket, reason or owner' },
        chips: {
          action: 'filter-escalations', value: f.status, label: 'Escalation status',
          items: FILTERS.map(function (x) { return { key: x.key, label: x.label, count: counts[x.key] }; })
        },
        right: SIQ.dom.html`
          <span class="t-xs ink-4">Oldest case first</span>
          <button class="btn btn--sm" data-action="reset-escalation-filters">${SIQ.icon('refresh', 14)} Reset</button>`
      })}

      ${table}`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.escalations = { render: render };
})(window.SIQ);
