/* ==========================================================================
   topheader.js — page heading + global actions
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function meta(state) {
    var r = state.route.name;
    switch (r) {
      case 'overview': return { title: 'Customer Support Intelligence', sub: 'Turn customer history into better support decisions.' };
      case 'customers': return { title: 'Customers', sub: 'Accounts, service context and memory coverage.' };
      case 'tickets': return { title: 'Active Tickets', sub: 'Every ticket with its memory-informed recommended action.' };
      case 'memory': return { title: 'Customer Memory', sub: 'Historical context that helps support agents make better decisions.' };
      case 'escalations': return { title: 'Escalations', sub: 'Cases that need a decision, with the reason and next step.' };
      case 'analytics': return { title: 'Analytics', sub: 'Where support time goes and what memory changes.' };
      case 'settings': return { title: 'Settings', sub: 'Intelligence thresholds, notifications and data retention.' };
      case 'help': return { title: 'Help & Support', sub: 'How SupportIQ reads memory, and how to work with it.' };
      case 'customer': {
        var c = SIQ.data.customer(state.route.param);
        return {
          title: 'Customer Intelligence',
          sub: c ? c.name + ' · ' + c.id : 'Select a customer to begin'
        };
      }
      default: return { title: 'SupportIQ', sub: '' };
    }
  }

  var NOTIFICATIONS = [
    { tone: 'red', title: 'Escalation raised for ISP-1003', meta: 'Fibre field team notified · 34m ago' },
    { tone: 'indigo', title: 'Recommendation ready for ISP-1001', meta: 'Network-side line diagnostic · 12m ago' },
    { tone: 'violet', title: 'Memory updated for ISP-1005', meta: 'Outcome recorded as temporary · 1h ago' },
    { tone: 'green', title: 'Resolution confirmed for ISP-1004', meta: 'Upstream profile corrected · 2h ago' }
  ];

  var DOT_TONE = {
    red: 'var(--red-600)', indigo: 'var(--indigo-600)',
    violet: 'var(--purple-600)', green: 'var(--green-600)'
  };

  function render(state) {
    var m = meta(state);
    var notifOpen = state.ui.notifications;
    var profileOpen = state.ui.profile;

    return SIQ.dom.html`
      <button class="icon-btn only-mobile" data-action="open-sidebar" aria-label="Open navigation">
        ${SIQ.icon('menu', 19)}
      </button>

      <div class="topbar__heading">
        <div class="topbar__title">${m.title}</div>
        ${m.sub ? SIQ.dom.raw('<div class="topbar__sub">' + SIQ.dom.esc(m.sub) + '</div>') : ''}
      </div>

      <div class="topbar__actions">
        <button class="search-trigger" data-action="open-palette" aria-label="Search customers and tickets">
          ${SIQ.icon('search', 16)}
          <span class="search-trigger__label">Search customers, tickets…</span>
          <span class="kbd kbd">⌘K</span>
        </button>

        <div style="position:relative">
          <button class="icon-btn${notifOpen ? ' is-active' : ''}" data-action="toggle-notifications"
                  aria-label="Notifications" aria-expanded="${notifOpen}">
            ${SIQ.icon('bell', 18)}<span class="icon-btn__dot"></span>
          </button>
          ${notifOpen ? notificationsPop() : ''}
        </div>

        <div class="topbar__divider"></div>

        <div style="position:relative">
          <button class="user-btn" data-action="toggle-profile" aria-expanded="${profileOpen}">
            <span class="avatar avatar--lg" style="width:32px;height:32px;font-size:11.5px">AW</span>
            <span class="user-btn__meta" style="text-align:left">
              <span class="user-btn__name" style="display:block">A. Whitfield</span>
              <span class="user-btn__role" style="display:block">Tier-2 Support · North</span>
            </span>
            ${SIQ.icon('chevronDown', 15)}
          </button>
          ${profileOpen ? profilePop() : ''}
        </div>
      </div>`;
  }

  function notificationsPop() {
    return SIQ.dom.html`
      <div class="pop pop--right" style="width:300px" role="dialog" aria-label="Notifications">
        <div class="pop__head">
          <div class="row-b">
            <span class="strong" style="font-size:13px">Notifications</span>
            <span class="badge badge--sm badge--indigo">3 new</span>
          </div>
        </div>
        ${NOTIFICATIONS.map(function (n) {
          return SIQ.dom.html`
            <div class="notif-item">
              <span class="notif-dot" style="background:${DOT_TONE[n.tone]}"></span>
              <div>
                <div class="notif-title">${n.title}</div>
                <div class="notif-meta">${n.meta}</div>
              </div>
            </div>`;
        })}
        <div class="pop__sep"></div>
        <a class="pop__item" href="#/escalations" data-nav="escalations">
          ${SIQ.icon('alert', 15)}
          <span>
            <span class="pop__item-title">Open the escalation queue</span>
            <span class="pop__item-sub">4 cases waiting for a decision</span>
          </span>
        </a>
      </div>`;
  }

  function profilePop() {
    return SIQ.dom.html`
      <div class="pop pop--right" style="width:250px" role="dialog" aria-label="Account menu">
        <div class="pop__head">
          <div class="row">
            <span class="avatar avatar--lg">AW</span>
            <div>
              <div class="strong" style="font-size:13px">A. Whitfield</div>
              <div class="t-xs ink-4">a.whitfield@supportiq.example</div>
            </div>
          </div>
        </div>
        <a class="pop__item" href="#/settings" data-nav="settings">${SIQ.icon('sliders', 15)}<span class="pop__item-title">Preferences</span></a>
        <a class="pop__item" href="#/memory" data-nav="memory">${SIQ.icon('database', 15)}<span class="pop__item-title">My memory scope</span></a>
        <a class="pop__item" href="#/help" data-nav="help">${SIQ.icon('buoy', 15)}<span class="pop__item-title">SupportIQ guide</span></a>
        <div class="pop__sep"></div>
        <button class="pop__item" data-action="sign-out">${SIQ.icon('lock', 15)}<span class="pop__item-title">Sign out</span></button>
      </div>`;
  }

  SIQ.TopHeader = { render: render, meta: meta };
})(window.SIQ);
