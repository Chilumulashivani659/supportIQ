/* ==========================================================================
   router.js — hash based routing (#/overview, #/customer/ISP-1001)
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var ROUTES = ['overview', 'customers', 'tickets', 'memory', 'escalations', 'analytics', 'settings', 'help', 'customer'];

  function parse() {
    var hash = (window.location.hash || '').replace(/^#\/?/, '');
    var parts = hash.split('/').filter(Boolean);
    var name = parts[0] || 'overview';
    if (ROUTES.indexOf(name) === -1) name = 'overview';
    return { name: name, param: parts[1] ? decodeURIComponent(parts[1]) : null };
  }

  function to(path) {
    if (window.location.hash === '#/' + path) {
      parseAndEmit();
      return;
    }
    window.location.hash = '#/' + path;
  }

  var emit = null;

  function parseAndEmit() {
    var next = parse();
    var prev = SIQ.store.state.route;
    if (prev.name === next.name && prev.param === next.param) return;
    SIQ.store.set({ route: next });
    if (emit) emit(next, prev);
  }

  function onChange(fn) {
    emit = fn;
    window.addEventListener('hashchange', parseAndEmit);
  }

  /** Navigates to the customer intelligence workspace. */
  function customer(id) { to('customer/' + encodeURIComponent(id)); }

  SIQ.router = { parse: parse, to: to, onChange: onChange, customer: customer, routes: ROUTES };
})(window.SIQ);
