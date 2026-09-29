/* ==========================================================================
   pages/overview.js — the dashboard homepage
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function metrics() {
    var m = SIQ.data.metrics;
    return [
      { label: 'Recurring Issues', value: m.recurring.value, delta: m.recurring.delta, dir: m.recurring.dir, note: m.recurring.note, icon: 'repeat', tone: 'amber', series: m.recurring.series },
      { label: 'Support Recommendations', value: m.recommendations.value, delta: m.recommendations.delta, dir: m.recommendations.dir, note: m.recommendations.note, icon: 'sparkles', tone: 'indigo', series: m.recommendations.series },
      { label: 'Successful Resolutions', value: m.resolution.value, suffix: m.resolution.suffix, delta: m.resolution.delta, dir: m.resolution.dir, note: m.resolution.note, icon: 'checkCircle', tone: 'green', series: m.resolution.series },
      { label: 'Open Escalations', value: m.escalations.value, delta: m.escalations.delta, dir: m.escalations.dir, note: m.escalations.note, icon: 'alert', tone: 'red', series: m.escalations.series }
    ];
  }

  function attention() {
    var list = SIQ.data.customers.filter(function (c) {
      return c.status === 'recurring' || c.status === 'escalated';
    });
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('alert', 16)} Needs attention</div>
            <div class="card__sub">Accounts with a stored pattern or an open escalation</div>
          </div>
          <a class="btn btn--sm btn--ghost" href="#/customers" data-nav="customers">All customers ${SIQ.icon('arrowRight', 13)}</a>
        </div>
        <div>
          ${list.map(function (c) {
            return SIQ.dom.html`
              <a class="attention-row" href="#/customer/${c.id}" data-action="open-customer" data-value="${c.id}">
                <span class="avatar avatar--sm ${SIQ.dom.avatarTone(c.id)}">${SIQ.dom.initials(c.name)}</span>
                <span class="attention-row__body">
                  <span class="attention-row__name">${c.name} <span class="mono ink-4" style="font-size:11px">${c.id}</span></span>
                  <span class="attention-row__issue">${c.issue} · ${c.memories} memories · ${c.repeatRate} repeated</span>
                </span>
                <span class="attention-row__meta">
                  ${SIQ.StatusBadge.customer(c.status)}
                  <span class="t-xs ink-4 nowrap">${SIQ.fmt.ago(c.lastInteraction)}</span>
                  ${SIQ.icon('chevronRight', 15, { class: 'ink-4' })}
                </span>
              </a>`;
          })}
        </div>
      </div>`;
  }

  function engineCard() {
    var s = SIQ.data.engineStats;
    return SIQ.dom.html`
      <div class="card card--memory">
        <div class="card__head">
          <div class="card__title">${SIQ.icon('database', 16)} Memory engine</div>
          <span class="badge badge--green badge--dot">Online</span>
        </div>
        <div class="card__body card__body--tight">
          <div class="stat-list">
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('layers', 14)} Memory records</span>
              <span class="stat-list__value">${s.records}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('users', 14)} Customers covered</span>
              <span class="stat-list__value">${s.customers} / ${SIQ.data.customers.length}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('repeat', 14)} Patterns detected</span>
              <span class="stat-list__value">${s.patterns}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('sparkles', 14)} Memory reads in recommendations</span>
              <span class="stat-list__value">${s.usedInRecommendations}</span>
            </div>
            <div class="stat-list__row">
              <span class="stat-list__label">${SIQ.icon('clock', 14)} Oldest record</span>
              <span class="stat-list__value">${s.oldest}</span>
            </div>
          </div>
          <a class="btn btn--sm btn--indigo-soft btn--block mt-4" href="#/memory" data-nav="memory">
            ${SIQ.icon('layers', 14)} Open customer memory
          </a>
        </div>
      </div>`;
  }

  function feed() {
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div class="card__title">${SIQ.icon('activity', 16)} Recent memory activity</div>
          <span class="t-xs ink-4">Last 24 hours</span>
        </div>
        <div>
          ${SIQ.data.activity.map(function (a) {
            return SIQ.dom.html`
              <div class="feed-item">
                <span class="feed-ico feed-ico--${a.tone}">${SIQ.icon(a.icon, 14)}</span>
                <div class="grow">
                  <div class="feed-title">${SIQ.dom.raw(a.text)}</div>
                  <div class="feed-meta">${SIQ.fmt.plural(a.mins, 'minute')} ago</div>
                </div>
              </div>`;
          })}
        </div>
      </div>`;
  }

  function escalationsPeek() {
    var list = SIQ.data.escalations.filter(function (e) { return e.status !== 'resolved'; }).slice(0, 3);
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div class="card__title">${SIQ.icon('arrowUpRight', 16)} Escalation queue</div>
          <a class="btn btn--sm btn--ghost" href="#/escalations" data-nav="escalations">View all ${SIQ.icon('arrowRight', 13)}</a>
        </div>
        <div>
          ${list.map(function (e) {
            return SIQ.dom.html`
              <a class="attention-row" href="#/customer/${e.customerId}" data-action="open-customer" data-value="${e.customerId}">
                <span class="avatar avatar--sm ${SIQ.dom.avatarTone(e.customerId)}">${SIQ.dom.initials(e.customer.name)}</span>
                <span class="attention-row__body">
                  <span class="attention-row__name">${e.customer.name} <span class="mono ink-4" style="font-size:11px">${e.id}</span></span>
                  <span class="attention-row__issue">${e.nextStep}</span>
                </span>
                <span class="attention-row__meta">${SIQ.StatusBadge.escalation(e.status)}</span>
              </a>`;
          })}
        </div>
      </div>`;
  }

  function render(state) {
    var m = SIQ.data.metrics;
    return SIQ.dom.html`
      <div class="page-head">
        <h1 class="page-head__title">Customer Support Intelligence</h1>
        <p class="page-head__sub">Turn customer history into better support decisions.</p>
      </div>

      <div class="hero anim-up">
        <div class="row-b wrap gap-4" style="align-items:flex-start">
          <div style="max-width:62ch">
            <div class="hero__badges mb-3">
              <span class="badge badge--indigo badge--dot">${SIQ.icon('sparkles', 12, { strokeWidth: 2 })} Memory-powered</span>
              <span class="badge badge--slate">${SIQ.icon('layers', 12)} ${SIQ.data.memoryTotals.records} stored memories</span>
              <span class="badge badge--slate">${SIQ.icon('users', 12)} ${SIQ.data.customers.length} customers</span>
            </div>
            <h2 class="hero__title">Every support decision starts from what already happened.</h2>
            <p class="hero__sub">
              SupportIQ reads a customer's stored interactions, detects the pattern behind the current ticket,
              and recommends the next step — with a concise reply for the customer.
            </p>
          </div>
          <div class="col gap-2" style="align-items:flex-end">
            <span class="eyebrow">This month</span>
            <div class="row gap-2">
              <span class="t-num" style="font-size:22px;font-weight:660;letter-spacing:-.03em">${SIQ.fmt.num(m.recommendations.value)}</span>
              <span class="t-sm ink-3">recommendations</span>
            </div>
            <span class="t-xs ink-4">${m.resolution.value}% resolved on the first recommendation</span>
          </div>
        </div>
        ${SIQ.FlowStrip.render()}
      </div>

      <div class="mt-5">${SIQ.CustomerSearch.render(state, { variant: 'hero' })}</div>

      <div class="mt-6" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px">
        ${metrics().map(function (m2) { return SIQ.MetricCard.render(m2); })}
      </div>

      <div class="mt-6" style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:16px" data-two-col>
        <div class="col gap-4" style="min-width:0">${attention()}</div>
        <div class="col gap-4" style="min-width:0">${engineCard()}${escalationsPeek()}</div>
      </div>

      <div class="mt-6" style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:16px" data-two-col>
        <div style="min-width:0">${feed()}</div>
        <div style="min-width:0">${SIQ.dom.html`
          <div class="card card--intel">
            <div class="card__head"><div class="card__title">${SIQ.icon('target', 16)} How SupportIQ decides</div></div>
            <div class="card__body">
              <ol class="col gap-3" style="counter-reset:step">
                ${[
                  ['Stores the interaction', 'Every report, fix and outcome is written to customer memory.'],
                  ['Matches the pattern', 'New tickets are compared with everything stored for that line.'],
                  ['Recommends the next step', 'Fixes that only worked temporarily are not repeated.'],
                  ['Drafts the customer reply', 'One or two sentences, grounded in what memory found.']
                ].map(function (row, i) {
                  return SIQ.dom.html`
                    <li class="row-t gap-3">
                      <span class="badge badge--indigo badge--sm" style="min-width:22px;justify-content:center">${i + 1}</span>
                      <span>
                        <span class="strong" style="font-size:13px;display:block">${row[0]}</span>
                        <span class="t-xs ink-3">${row[1]}</span>
                      </span>
                    </li>`;
                })}
              </ol>
              <a class="btn btn--sm btn--block mt-4" href="#/help" data-nav="help">${SIQ.icon('buoy', 14)} Read the guide</a>
            </div>
          </div>`}
        </div>
      </div>`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.overview = { render: render, title: 'Customer Support Intelligence' };
})(window.SIQ);
