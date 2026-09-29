/* ==========================================================================
   store.js — single application state container
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var state = {
    route: { name: 'overview', param: null },
    sidebar: { collapsed: false, open: false },
    ui: {
      palette: false, paletteQuery: '', paletteIndex: 0,
      notifications: false, profile: false,
      faq: {},
      // Workspace preferences (pages/settings.js). Local to this device.
      autoAnalyze: false,
      fixOutcomesFirst: true,
      confirmEscalation: true,
      includeResolved: true,
      flagTemporary: true,
      prefRepeat: 3,
      prefConfidence: 2,
      notifyEscalation: true,
      notifyPattern: true,
      notifyCoverage: true,
      notifyDigest: false,
      retainIndefinitely: true,
      rememberOutcomes: true,
      exposeIntel: false
    },
    filters: {
      customers: { q: '', status: 'all' },
      tickets: { q: '', status: 'all' },
      memory: { q: '', customer: 'all', category: 'all', expanded: {} },
      escalations: { q: '', status: 'all' },
      overview: { q: '' }
    },
    ws: {
      id: null,
      phase: 'idle',        // idle | analyzing | ready | error | no-memory
      attempt: 0,
      step: 0,
      steps: 0,
      log: [],
      progress: 0,
      elapsed: 0,
      result: null,
      tab: 'intelligence',
      recState: 'recommended',   // recommended | in-progress | completed
      escalated: false,
      response: '',
      editing: false,
      sent: false,
      copied: false,
      expanded: {}
    }
  };

  var listeners = [];

  function notify() {
    listeners.forEach(function (fn) { fn(state); });
  }

  function set(patch) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    notify();
  }

  /** Shallow-merges into a top-level slice, e.g. patch('ws', {phase:'ready'}). */
  function patch(key, values) {
    state[key] = Object.assign({}, state[key], values);
    notify();
  }

  function ws(values) { patch('ws', values); }

  /** Shallow-merges into state.ui, the catch-all slice for page-local UI. */
  function ui(values) { patch('ui', values); }

  /**
   * Flips one boolean key inside a nested slice without losing its siblings.
   * `path` is dot separated, e.g. 'ui.faq' or 'ws.expanded'.
   * Mutates in place: `SIQ.store.state` is a live reference.
   */
  function toggleIn(path, id) {
    var parts = path.split('.');
    var target = state;
    for (var i = 0; i < parts.length - 1; i++) target = target[parts[i]];
    var leaf = parts[parts.length - 1];
    var slice = Object.assign({}, target[leaf] || {});
    slice[id] = !slice[id];
    target[leaf] = slice;
    notify();
  }

  /** Patches a filter slice, e.g. filters('customers', {status:'active'}). */
  function filters(slice, values) {
    state.filters = Object.assign({}, state.filters, {
      [slice]: Object.assign({}, state.filters[slice], values)
    });
    notify();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return function () { listeners = listeners.filter(function (l) { return l !== fn; }); };
  }

  function resetWorkspace(id) {
    state.ws = Object.assign({}, state.ws, {
      id: id,
      phase: 'idle',
      attempt: 0,
      step: 0,
      log: [],
      progress: 0,
      elapsed: 0,
      result: null,
      tab: 'intelligence',
      recState: 'recommended',
      escalated: false,
      response: '',
      editing: false,
      sent: false,
      copied: false,
      expanded: {}
    });
  }

  SIQ.store = {
    state: state,
    set: set,
    patch: patch,
    ws: ws,
    ui: ui,
    toggleIn: toggleIn,
    filters: filters,
    subscribe: subscribe,
    notify: notify,
    resetWorkspace: resetWorkspace
  };
})(window.SIQ);
