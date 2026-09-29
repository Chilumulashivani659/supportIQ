/* ==========================================================================
   pages/memory.js — the dedicated customer memory page
   Shows that history persists, is categorised and is reused.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var CATEGORIES = [
    { key: 'all', label: 'All types' },
    { key: 'report', label: 'Customer Report' },
    { key: 'troubleshooting', label: 'Troubleshooting' },
    { key: 'outcome', label: 'Outcome' },
    { key: 'pattern', label: 'Recurring Pattern' },
    { key: 'recommendation', label: 'Recommendation' }
  ];

  function filtered(state) {
    var f = state.filters.memory;
    return SIQ.data.memory.filter(function (e) {
      var okCustomer = f.customer === 'all' || e.customerId === f.customer;
      var okCategory = f.category === 'all' || e.type === f.category;
      var haystack = [e.title, e.summary, e.customer.name, e.customerId, e.ticket, (e.tags || []).join(' ')].join(' ');
      return okCustomer && okCategory && (!f.q || SIQ.fmt.match(haystack, f.q));
    });
  }

  function entry(e, expanded) {
    var type = SIQ.data.memoryTypes[e.type];
    var open = !!expanded[e.id];
    return SIQ.dom.html`
      <div class="mem-entry">
        <button class="mem-entry__head" data-action="toggle-memory" data-value="${e.id}" aria-expanded="${open}">
          <span class="mem-entry__type tone-${SIQ.MemoryTimeline.TONE[e.type]}">${SIQ.icon(type.icon, 12)} ${type.label}</span>
          <span class="mem-entry__body">
            <span class="mem-entry__title">${e.title}</span>
            <span class="mem-entry__meta">
              <span class="mono">${e.id}</span> · ${e.customer.name} · ${SIQ.fmt.mediumDate(e.date)}
              ${e.ticket ? '· ' + e.ticket : ''}
            </span>
          </span>
          ${e.outcome ? SIQ.StatusBadge.outcome(e.outcome) : ''}
          ${e.usedIn ? SIQ.dom.raw('<span class="badge badge--sm badge--violet">Reused ' + e.usedIn + '×</span>') : ''}
          <span class="mem-entry__chev${open ? ' is-open' : ''}">${SIQ.icon('chevronDown', 15)}</span>
        </button>
        ${open ? SIQ.dom.html`
          <div class="mem-entry__detail">
            <div class="mem-entry__detail-grid">
              <div class="mem-kv"><span class="mem-kv__k">Summary</span><span class="mem-kv__v">${e.summary}</span></div>
              <div class="mem-kv"><span class="mem-kv__k">Recorded</span><span class="mem-kv__v">${SIQ.fmt.dateTime(e.date)}</span></div>
              <div class="mem-kv"><span class="mem-kv__k">Outcome</span><span class="mem-kv__v">${e.outcome ? SIQ.data.outcomeMeta[e.outcome].label : 'Not recorded'}</span></div>
              <div class="mem-kv"><span class="mem-kv__k">Reused in</span><span class="mem-kv__v">${e.usedIn ? e.usedIn + ' later recommendation' + (e.usedIn > 1 ? 's' : '') : 'Not yet reused'}</span></div>
              <div class="mem-kv"><span class="mem-kv__k">Customer</span><span class="mem-kv__v">${e.customer.name} · ${e.customerId}</span></div>
            </div>
            <div class="mem-tags">${(e.tags || []).map(function (t) { return SIQ.dom.html`<span class="tag">${SIQ.icon('hash', 11)} ${t}</span>`; })}</div>
          </div>` : ''}
      </div>`;
  }

  function coverageCard() {
    var s = SIQ.data.engineStats;
    var avg = (s.records / s.customers).toFixed(1);
    var byCategory = CATEGORIES.slice(1).map(function (cat) {
      var count = SIQ.data.memory.filter(function (e) { return e.type === cat.key; }).length;
      return { key: cat.key, label: cat.label, count: count, type: SIQ.data.memoryTypes[cat.key] };
    });
    var max = Math.max.apply(null, byCategory.map(function (x) { return x.count; }));

    return SIQ.dom.html`
      <div class="card card--memory">
        <div class="card__head">
          <div class="card__title">${SIQ.icon('database', 16)} Memory coverage</div>
          <span class="badge badge--green badge--dot">Indexed</span>
        </div>
        <div class="card__body card__body--tight">
          <div class="stat-list">
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('layers', 14)} Records</span>
              <span class="stat-list__value">${s.records}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('users', 14)} Customers</span>
              <span class="stat-list__value">${s.customers} / ${SIQ.data.customers.length}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('percent', 14)} Average per customer</span>
              <span class="stat-list__value">${avg}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('sparkles', 14)} Reused in recommendations</span>
              <span class="stat-list__value">${s.usedInRecommendations}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('clock', 14)} Oldest record</span>
              <span class="stat-list__value">${s.oldest}</span>
            </div>
          </div>

          <div class="divider"></div>
          <div class="eyebrow mb-3">Records by type</div>
          <div class="bars">
            ${byCategory.map(function (c) {
              return SIQ.dom.html`
                <div>
                  <div class="bar-row__top">
                    <span class="bar-row__label">${c.label}</span>
                    <span class="bar-row__value">${c.count}</span>
                  </div>
                  <div class="bar-row__track">
                    <div class="bar-row__fill" style="width:${Math.round((c.count / max) * 100)}%;background:var(--${c.type.tone === 'slate' ? 'ink-4' : c.type.tone === 'green' ? 'green-600' : c.type.tone === 'violet' ? 'purple-600' : c.type.tone === 'amber' ? 'amber-600' : 'indigo-500'})"></div>
                  </div>
                </div>`;
            })}
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card__head"><div class="card__title">${SIQ.icon('shieldCheck', 16)} Retention &amp; privacy</div></div>
        <div class="card__body card__body--tight">
          <div class="reason__foot" style="margin-top:0">
            ${SIQ.icon('lock', 13)}
            <span>Support memory is limited to support interactions on this platform. Customers are never shown internal memory records — only the concise response.</span>
          </div>
        </div>
      </div>`;
  }

  function render(state) {
    var f = state.filters.memory;
    var rows = filtered(state);

    var grouped = SIQ.fmt.groupBy(rows, function (e) { return e.customerId; });
    var groups = Object.keys(grouped).map(function (id) {
      return { customer: grouped[id][0].customer, id: id, entries: SIQ.fmt.byDateDesc(grouped[id]) };
    }).sort(function (a, b) {
      return new Date(b.entries[0].date).getTime() - new Date(a.entries[0].date).getTime();
    });

    var list = groups.length
      ? groups.map(function (g) {
          return SIQ.dom.html`
            <section class="mem-group">
              <div class="mem-group__head">
                <span class="avatar avatar--sm ${SIQ.dom.avatarTone(g.id)}">${SIQ.dom.initials(g.customer.name)}</span>
                <span class="mem-group__name">${g.customer.name}</span>
                <span class="mono t-xs ink-4">${g.id}</span>
                ${SIQ.StatusBadge.customer(g.customer.status)}
                <span class="grow"></span>
                <button class="btn btn--sm btn--indigo-soft" data-action="open-customer" data-value="${g.id}">
                  Open intelligence ${SIQ.icon('arrowRight', 13)}
                </button>
              </div>
              ${g.entries.map(function (e) { return entry(e, f.expanded); })}
            </section>`;
        })
      : SIQ.dom.html`
        <div class="card">
          ${SIQ.States.memory({
            title: 'No memory records match these filters',
            desc: 'Adjust the customer, record type or search text. Memory records are written automatically as support interactions happen.',
            action: SIQ.dom.html`<button class="btn btn--sm mt-3" data-action="reset-memory-filters">${SIQ.icon('refresh', 14)} Reset filters</button>`
          })}
        </div>`;

    var s = SIQ.data.engineStats;

    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Customer Memory</h1>
          <p class="page-head__sub">Historical context that helps support agents make better decisions.</p>
        </div>
        <div class="page-head__actions">
          <span class="count-pill">${SIQ.icon('layers', 13)} ${s.records} records</span>
          <button class="btn" data-action="export-memory">${SIQ.icon('download', 15)} Export records</button>
        </div>
      </div>

      <div class="mb-4" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px">
        ${SIQ.MetricCard.render({ label: 'Memory records', value: s.records, icon: 'database', tone: 'violet', hint: 'across all customers' })}
        ${SIQ.MetricCard.render({ label: 'Customers covered', value: s.customers + ' / ' + SIQ.data.customers.length, icon: 'users', tone: 'indigo', hint: 'memory coverage' })}
        ${SIQ.MetricCard.render({ label: 'Reused in recommendations', value: s.usedInRecommendations, icon: 'sparkles', tone: 'green', hint: 'memory that changed a decision' })}
        ${SIQ.MetricCard.render({ label: 'Patterns detected', value: s.patterns, icon: 'repeat', tone: 'amber', hint: 'recurring signals stored' })}
      </div>

      ${SIQ.FilterBar.bar({
        search: { name: 'memoryQ', value: f.q, placeholder: 'Search memory text, tags or ticket' },
        chips: {
          action: 'filter-memory-category', value: f.category, label: 'Record type',
          items: CATEGORIES.map(function (c) {
            return {
              key: c.key, label: c.key === 'all' ? c.label : c.label,
              count: c.key === 'all' ? SIQ.data.memory.length : SIQ.data.memory.filter(function (e) { return e.type === c.key; }).length
            };
          })
        },
        select: {
          name: 'memoryCustomer', label: 'Customer', value: f.customer,
          items: [{ value: 'all', label: 'All customers' }].concat(
            SIQ.data.customers.map(function (c) { return { value: c.id, label: c.name + ' · ' + c.id }; })
          )
        },
        right: SIQ.dom.html`
          <button class="btn btn--sm" data-action="reset-memory-filters">${SIQ.icon('refresh', 14)} Reset</button>`
      })}

      <div class="mem-layout">
        <div style="min-width:0">${list}</div>
        <div style="min-width:0">${coverageCard()}</div>
      </div>`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.memory = { render: render, CATEGORIES: CATEGORIES };
})(window.SIQ);
