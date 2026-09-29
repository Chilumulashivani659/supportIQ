/* ==========================================================================
   customersummary.js — plan, connection, equipment and support status
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function stat(label, value, meta, extra) {
    return SIQ.dom.html`
      <div class="cust-stat">
        <div class="cust-stat__label">${label}</div>
        <div class="cust-stat__value">${value}${extra || ''}</div>
        ${meta ? SIQ.dom.raw('<div class="cust-stat__meta">' + SIQ.dom.esc(meta) + '</div>') : ''}
      </div>`;
  }

  function render(c) {
    var ticket = SIQ.data.tickets.filter(function (t) { return t.customerId === c.id; })[0];
    var planSub = c.plan.split(' ')[0] + ' provisioned';
    var connSub = c.access + (c.staticIp ? ' · static IP' : ' · dynamic IP');
    var routerSub = c.routerFw === '—' ? 'Not provisioned' : 'Firmware ' + c.routerFw;
    var statusSub = 'Open ' + SIQ.fmt.plural(c.openTickets, 'ticket');

    return SIQ.dom.raw(SIQ.dom.html`
      <div class="card">
        <div class="cust-sum__top">
          <span class="avatar avatar--lg ${SIQ.dom.avatarTone(c.id)}">${SIQ.dom.initials(c.name)}</span>
          <div class="grow">
            <div class="row gap-2 wrap">
              <span style="font-size:16px;font-weight:650;letter-spacing:-.02em;color:var(--ink)">${c.name}</span>
              <span class="mono" style="font-size:12px;color:var(--ink-4)">${c.id}</span>
              ${SIQ.StatusBadge.customer(c.status)}
            </div>
            <div class="t-xs ink-3 mt-2">
              ${c.zone} · Customer since ${c.memberSince} · Account manager ${c.accountManager}
            </div>
          </div>
          <div class="row gap-2 wrap" style="justify-content:flex-end">
            ${ticket ? SIQ.dom.html`<span class="badge badge--slate">${SIQ.icon('clipboard', 12)} ${ticket.id}</span>` : ''}
            <span class="badge badge--slate">${SIQ.icon('clock', 12)} ${SIQ.fmt.ago(c.lastInteraction)}</span>
          </div>
        </div>
        <div class="cust-sum__stats">
          ${stat('Internet Plan', c.plan, planSub)}
          ${stat('Connection', c.connection, connSub)}
          ${stat('Router', c.router, routerSub)}
          ${stat('Support Status', SIQ.StatusBadge.customer(c.status), statusSub)}
        </div>
      </div>`);
  }

  SIQ.CustomerSummary = { render: render };
})(window.SIQ);
