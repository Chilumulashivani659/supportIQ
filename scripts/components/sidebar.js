/* ==========================================================================
   sidebar.js — persistent primary navigation
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function navItems(state) {
    var openTickets = SIQ.data.tickets.filter(function (t) { return t.status !== 'resolved'; }).length;
    var openEscalations = SIQ.data.escalations.filter(function (e) { return e.status !== 'resolved'; }).length;
    var recurring = SIQ.data.customers.filter(function (c) { return c.status === 'recurring'; }).length;

    return [
      { group: 'Workspace' },
      { key: 'overview', label: 'Overview', icon: 'grid', href: '#/overview', route: 'overview' },
      { key: 'customers', label: 'Customers', icon: 'users', href: '#/customers', route: 'customers', count: SIQ.data.customers.length },
      { key: 'tickets', label: 'Tickets', icon: 'inbox', href: '#/tickets', route: 'tickets', count: openTickets },
      { key: 'memory', label: 'Memory', icon: 'layers', href: '#/memory', route: 'memory', count: SIQ.data.memoryTotals.records },
      { key: 'escalations', label: 'Escalations', icon: 'alert', href: '#/escalations', route: 'escalations', count: openEscalations, alert: true },
      { key: 'analytics', label: 'Analytics', icon: 'chart', href: '#/analytics', route: 'analytics' },
      { group: 'Workspace admin' },
      { key: 'settings', label: 'Settings', icon: 'sliders', href: '#/settings', route: 'settings' },
      { key: 'help', label: 'Help & Support', icon: 'buoy', href: '#/help', route: 'help' }
    ];
  }

  function activeRoute(state) {
    var r = state.route.name;
    return r === 'customer' ? 'customers' : r;
  }

  function render(state) {
    var items = navItems(state);
    var active = activeRoute(state);
    var collapsed = state.sidebar.collapsed;

    var nav = items.map(function (item) {
      if (item.group) {
        return SIQ.dom.html`<div class="nav-group-label eyebrow">${item.group}</div>`;
      }
      var isActive = item.route === active;
      return SIQ.dom.html`
        <a class="nav-item${isActive ? ' is-active' : ''}" href="${item.href}" data-nav="${item.key}"
           title="${collapsed ? item.label : ''}" aria-current="${isActive ? 'page' : 'false'}">
          ${SIQ.icon(item.icon, 18)}
          <span>${item.label}</span>
          ${item.count !== undefined
            ? SIQ.dom.raw('<span class="nav-item__count' + (item.alert ? ' is-alert' : '') + '">' + item.count + '</span>')
            : ''}
        </a>`;
    });

    return SIQ.dom.html`
      <div class="sidebar__brand">
        <div class="brand-mark" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z"/><path d="m3 12.5 9 4.5 9-4.5"/><path d="m3 17 9 4.5 9-4.5"/>
          </svg>
        </div>
        <div class="brand-text">
          <div class="brand-name">SupportIQ</div>
          <div class="brand-tag">Memory-powered support</div>
        </div>
      </div>

      <nav class="sidebar__nav">${nav}</nav>

      <div class="sidebar__foot">
        <div class="engine-status" title="Pattern detection and recommendation service">
          <span class="engine-status__dot"></span>
          <div class="engine-status__text">
            <div class="engine-status__title">Intelligence Engine Online</div>
            <div class="engine-status__meta">v2.4 · ${SIQ.data.engineStats.latency} · ${SIQ.data.engineStats.records} records</div>
          </div>
        </div>
        <a class="nav-item" href="#/settings" data-nav="settings" title="${collapsed ? 'Settings' : ''}">
          ${SIQ.icon('sliders', 18)}<span>Settings</span>
        </a>
        <a class="nav-item" href="#/help" data-nav="help" title="${collapsed ? 'Help & Support' : ''}">
          ${SIQ.icon('buoy', 18)}<span>Help &amp; Support</span>
        </a>
      </div>`;
  }

  function toggleAction() {
    return {
      label: 'Collapse sidebar',
      icon: 'panel',
      attrs: 'data-action="toggle-sidebar" title="Collapse sidebar"'
    };
  }

  SIQ.Sidebar = { render: render, navItems: navItems, toggleAction: toggleAction };
})(window.SIQ);
