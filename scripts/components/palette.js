/* ==========================================================================
   palette.js — ⌘K command palette: customers, tickets and navigation
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var PAGES = [
    { key: 'overview', label: 'Overview', sub: 'Customer Support Intelligence', icon: 'grid', href: '#/overview' },
    { key: 'customers', label: 'Customers', sub: 'Accounts and memory coverage', icon: 'users', href: '#/customers' },
    { key: 'tickets', label: 'Tickets', sub: 'Active support queue', icon: 'inbox', href: '#/tickets' },
    { key: 'memory', label: 'Memory', sub: 'Historical customer context', icon: 'layers', href: '#/memory' },
    { key: 'escalations', label: 'Escalations', sub: 'Cases needing a decision', icon: 'alert', href: '#/escalations' },
    { key: 'analytics', label: 'Analytics', sub: 'Support operations metrics', icon: 'chart', href: '#/analytics' }
  ];

  function results(state) {
    var q = (state.ui.paletteQuery || '').trim();
    var pages = PAGES.filter(function (p) {
      return !q || SIQ.fmt.match(p.label, q) || SIQ.fmt.match(p.sub, q);
    }).slice(0, q ? 4 : 3);
    var customers = SIQ.data.customers.filter(function (c) {
      return !q || [c.id, c.name, c.issue, c.plan].some(function (v) { return SIQ.fmt.match(v, q); });
    }).slice(0, q ? 6 : 4);
    var tickets = q
      ? SIQ.data.tickets.filter(function (t) { return [t.id, t.issue].some(function (v) { return SIQ.fmt.match(v, q); }); }).slice(0, 3)
      : [];
    return { pages: pages, customers: customers, tickets: tickets };
  }

  function flat(state) {
    var r = results(state);
    return []
      .concat(r.pages.map(function (p) { return { type: 'page', id: p.key, item: p }; }))
      .concat(r.customers.map(function (c) { return { type: 'customer', id: c.id, item: c }; }))
      .concat(r.tickets.map(function (t) { return { type: 'ticket', id: t.id, item: t }; }));
  }

  function render(state) {
    var r = results(state);
    var items = flat(state);
    var index = SIQ.dom.clamp(state.ui.paletteIndex || 0, 0, Math.max(items.length - 1, 0));
    var q = state.ui.paletteQuery || '';
    var total = items.length;

    function itemAttrs(i, type, id) {
      return 'class="palette__item' + (i === index ? ' is-active' : '') + '" data-action="palette-pick"' +
        ' data-type="' + type + '" data-value="' + id + '" data-index="' + i + '"';
    }

    var rows = [];
    var i = 0;
    if (r.pages.length) rows.push('<div class="palette__group">Navigate</div>');
    r.pages.forEach(function (p) {
      rows.push('<a href="' + p.href + '" ' + itemAttrs(i, 'page', p.key) + ' data-nav="' + p.key + '">' +
        '<span class="palette__item-ico">' + SIQ.icon(p.icon, 16).__siqRaw + '</span>' +
        '<span class="grow"><span class="palette__item-title">' + p.label + '</span>' +
        '<span class="palette__item-sub">' + p.sub + '</span></span></a>');
      i++;
    });
    if (r.customers.length) rows.push('<div class="palette__group">Customers</div>');
    r.customers.forEach(function (c) {
      rows.push('<button ' + itemAttrs(i, 'customer', c.id) + '>' +
        '<span class="avatar avatar--sm ' + SIQ.dom.avatarTone(c.id) + '">' + SIQ.dom.initials(c.name) + '</span>' +
        '<span class="grow" style="text-align:left"><span class="palette__item-title">' + c.name + '</span>' +
        '<span class="palette__item-sub">' + c.id + ' · ' + c.issue + ' · ' + c.plan + '</span></span>' +
        SIQ.StatusBadge.customer(c.status) + '</button>');
      i++;
    });
    if (r.tickets.length) rows.push('<div class="palette__group">Tickets</div>');
    r.tickets.forEach(function (t) {
      rows.push('<button ' + itemAttrs(i, 'ticket', t.id) + '>' +
        '<span class="ai-chip">' + SIQ.icon('clipboard', 10, { strokeWidth: 2.2 }).__siqRaw + ' TICKET</span>' +
        '<span class="grow" style="text-align:left"><span class="palette__item-title mono">' + t.id + '</span>' +
        '<span class="palette__item-sub">' + t.customer.name + ' · ' + t.issue + '</span></span>' +
        SIQ.StatusBadge.ticket(t.status) + '</button>');
      i++;
    });

    return SIQ.dom.raw(
      '<div class="palette-backdrop" data-action="close-palette">' +
        '<div class="palette" role="dialog" aria-modal="true" aria-label="Search SupportIQ" data-palette>' +
          '<div class="palette__input-wrap">' + SIQ.icon('search', 18).__siqRaw +
            '<input class="palette__input" data-input="paletteQuery" data-focus-key="paletteQuery" ' +
              'placeholder="Search customers, tickets or jump to a page…" aria-label="Search" ' +
              'value="' + SIQ.dom.esc(q) + '" autocomplete="off" spellcheck="false">' +
            '<span class="kbd kbd">ESC</span>' +
          '</div>' +
          '<div class="palette__results">' +
            (total ? rows.join('') :
              '<div class="state" style="padding:28px 20px"><div class="state__icon">' + SIQ.icon('search', 20).__siqRaw + '</div>' +
              '<div class="state__title">No results for “' + SIQ.dom.esc(q) + '”</div>' +
              '<div class="state__desc">Try a customer ID such as ISP-1001.</div></div>') +
          '</div>' +
          '<div class="palette__foot">' +
            '<span class="row gap-2"><span class="kbd kbd">↑</span><span class="kbd kbd">↓</span> to move</span>' +
            '<span class="row gap-2"><span class="kbd kbd">↵</span> to open</span>' +
            '<span class="row gap-2"><span class="kbd kbd">esc</span> to close</span>' +
            '<span class="grow"></span>' +
            '<span>' + total + ' result' + (total === 1 ? '' : 's') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  SIQ.Palette = { render: render, flat: flat, PAGES: PAGES };
})(window.SIQ);
