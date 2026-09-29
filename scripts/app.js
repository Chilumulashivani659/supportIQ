/* ==========================================================================
   app.js — bootstrap, render loop and event wiring
   Classic script. Subscribes to the store and re-renders the shell on change.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var els = {};
  var scrollMemory = {};

  /* ----------------------------------------------------------- rendering */

  function currentPage(state) {
    var r = state.route;
    if (r.name === 'customer') return SIQ.Pages.workspace;
    return SIQ.Pages[r.name] || SIQ.Pages.overview;
  }

  function render() {
    var state = SIQ.store.state;
    var page = currentPage(state);

    els.app.classList.toggle('sidebar-collapsed', state.sidebar.collapsed);
    els.app.classList.toggle('sidebar-open', state.sidebar.open);

    SIQ.dom.setHTML(els.sidebar, SIQ.Sidebar.render(state));
    SIQ.dom.setHTML(els.topbar, SIQ.TopHeader.render(state));
    SIQ.dom.setHTML(els.content, page.render(state));
    SIQ.dom.setHTML(els.overlays, state.ui.palette ? SIQ.Palette.render(state) : '');

    document.title = page.title ? page.title + ' · SupportIQ' : 'SupportIQ';
  }

  function renderRoute(state) {
    var r = state.route;
    if (r.name === 'customer') {
      if (state.ws.id !== r.param) {
        SIQ.engine.cancel();
        SIQ.store.resetWorkspace(r.param);
      }
    }
    scrollMemory[r.name] = els.content.scrollTop;
    render();
    if (r.name === 'customer') els.content.scrollTop = 0;
    else els.content.scrollTop = scrollMemory[r.name] || 0;
  }

  /* ------------------------------------------------------------- actions */

  function notifyDemo(title, desc, type) {
    SIQ.toast.show({ title: title, desc: desc, type: type || 'info' });
  }

  var ACTIONS = {
    /* shell */
    'toggle-sidebar': function () {
      SIQ.store.patch('sidebar', { collapsed: !SIQ.store.state.sidebar.collapsed });
    },
    'open-sidebar': function () {
      SIQ.store.patch('sidebar', { open: true });
    },
    'close-sidebar': function () {
      SIQ.store.patch('sidebar', { open: false });
    },
    'toggle-notifications': function () {
      var ui = SIQ.store.state.ui;
      SIQ.store.ui({ notifications: !ui.notifications, profile: false });
    },
    'toggle-profile': function () {
      var ui = SIQ.store.state.ui;
      SIQ.store.ui({ profile: !ui.profile, notifications: false });
    },
    'close-popovers': function () {
      SIQ.store.ui({ notifications: false, profile: false });
    },
    'sign-out': function () {
      SIQ.store.ui({ profile: false });
      notifyDemo('Signed out', 'This is a demonstration workspace — no account was changed.', 'info');
    },

    /* palette */
    'open-palette': function () {
      SIQ.store.ui({ palette: true, paletteQuery: '', paletteIndex: 0, notifications: false, profile: false });
      focusLater('[data-focus-key="paletteQuery"]');
    },
    'close-palette': function (event, el, name, target) {
      if (target && target.closest && target.closest('[data-palette]')) return;
      SIQ.store.ui({ palette: false });
    },
    'palette-pick': function (event, el) {
      var type = el.getAttribute('data-type');
      var value = el.getAttribute('data-value');
      SIQ.store.ui({ palette: false });
      if (type === 'page') SIQ.router.to(value);
      else if (type === 'customer') SIQ.router.customer(value);
      else if (type === 'ticket') openTicket(value);
    },

    /* navigation */
    'open-customer': function (event, el) {
      SIQ.store.ui({ palette: false });
      SIQ.router.customer(el.getAttribute('data-value'));
    },
    'open-customer-list': function () {
      SIQ.store.ui({ palette: false });
      SIQ.router.to('customers');
    },
    'open-ticket': function (event, el) {
      openTicket(el.getAttribute('data-value'));
    },
    'open-memory-log': function () {
      var id = SIQ.store.state.ws.id;
      if (!id) return;
      var ws = SIQ.store.state.ws;
      if (ws.phase !== 'ready') {
        notifyDemo('Run the analysis first', 'The memory log opens once SupportIQ has read this customer’s history.', 'warning');
        return;
      }
      SIQ.store.ws({ tab: 'memory-log' });
    },
    'quick-search': function (event, el) {
      var input = els.content.querySelector('[data-focus-key="customerSearch"]');
      if (input) { input.value = el.getAttribute('data-value'); }
      SIQ.store.filters('overview', { q: el.getAttribute('data-value') });
    },
    'ws-tab': function (event, el) {
      SIQ.store.ws({ tab: el.getAttribute('data-value') });
    },

    /* workspace */
    'analyze': function () {
      var id = SIQ.store.state.ws.id;
      if (!id) return;
      SIQ.engine.analyze(id);
    },
    'toggle-insight': function (event, el) {
      SIQ.store.toggleIn('ws.expanded', el.getAttribute('data-value'));
    },
    'toggle-all-insights': function () {
      var ws = SIQ.store.state.ws;
      var insights = SIQ.MemoryInsight.derive(ws.id);
      if (!insights.length) return;
      // Keep memory-log expansion keys, which share the same map.
      var next = {};
      Object.keys(ws.expanded).forEach(function (k) {
        if (k.indexOf('ins-') !== 0) next[k] = ws.expanded[k];
      });
      var allOpen = insights.every(function (i) { return ws.expanded[i.key]; });
      if (!allOpen) {
        insights.forEach(function (i) {
          if (i.evidence && i.evidence.total) next[i.key] = true;
        });
      }
      SIQ.store.ws({ expanded: next });
    },
    'toggle-memory': function (event, el) {
      SIQ.store.toggleIn(
        SIQ.store.state.route.name === 'memory' ? 'filters.memory.expanded' : 'ws.expanded',
        el.getAttribute('data-value')
      );
    },
    'rec-primary': function () {
      var ws = SIQ.store.state.ws;
      if (ws.recState === 'completed') return;
      var next = ws.recState === 'in-progress' ? 'completed' : 'in-progress';
      SIQ.store.ws({ recState: next });
      if (next === 'completed') {
        notifyDemo('Action completed', 'The outcome will be written to this customer’s memory.', 'success');
      }
    },
    'rec-secondary': function () {
      var ws = SIQ.store.state.ws;
      SIQ.store.ws({ recState: ws.recState === 'recommended' ? 'in-progress' : 'recommended' });
    },
    'escalate': function () {
      var ws = SIQ.store.state.ws;
      if (ws.escalated) {
        notifyDemo('Already escalated', 'The field team has been notified for this ticket.', 'warning');
        return;
      }
      SIQ.store.ws({ escalated: true });
      notifyDemo('Field team notified', ws.id + ' · escalation raised from stored outcomes.', 'success');
    },

    /* customer response */
    'edit-response': function () { SIQ.store.ws({ editing: true, copied: false }); },
    'cancel-edit': function () { SIQ.store.ws({ editing: false }); },
    'save-edit': function () {
      var input = els.content.querySelector('[data-focus-key="responseText"]');
      var text = input ? input.value.trim() : SIQ.store.state.ws.response;
      if (!text) {
        notifyDemo('Nothing to save', 'Write a response before saving it.', 'warning');
        return;
      }
      SIQ.store.ws({ editing: false, response: text });
      notifyDemo('Response saved', text.split(/\s+/).length + ' words kept for review.', 'success');
    },
    'copy-response': function () {
      var text = SIQ.store.state.ws.response;
      if (!text) return;
      SIQ.dom.copyText(text).then(function () {
        SIQ.store.ws({ copied: true });
        notifyDemo('Copied to clipboard', 'The customer response is ready to paste.', 'success');
      }, function () {
        notifyDemo('Could not copy', 'Select the text and copy it manually.', 'danger');
      });
    },
    'send-response': function () {
      var ws = SIQ.store.state.ws;
      if (ws.editing) {
        notifyDemo('Save the response first', 'Finish editing before sending it to the customer.', 'warning');
        return;
      }
      SIQ.store.ws({ sent: true });
      notifyDemo('Response sent', ws.id + ' · the customer received the concise reply.', 'success');
    },

    /* list page filters */
    'filter-customers': function (event, el) {
      SIQ.store.filters('customers', { status: el.getAttribute('data-value') });
    },
    'filter-tickets': function (event, el) {
      SIQ.store.filters('tickets', { status: el.getAttribute('data-value') });
    },
    'filter-memory-category': function (event, el) {
      SIQ.store.filters('memory', { category: el.getAttribute('data-value') });
    },
    'filter-escalations': function (event, el) {
      SIQ.store.filters('escalations', { status: el.getAttribute('data-value') });
    },
    'reset-customer-filters': function () {
      SIQ.store.filters('customers', { q: '', status: 'all' });
    },
    'reset-ticket-filters': function () {
      SIQ.store.filters('tickets', { q: '', status: 'all' });
    },
    'reset-escalation-filters': function () {
      SIQ.store.filters('escalations', { q: '', status: 'all' });
    },
    'reset-memory-filters': function () {
      SIQ.store.filters('memory', { q: '', customer: 'all', category: 'all' });
    },

    /* help + settings */
    'toggle-faq': function (event, el) {
      SIQ.store.toggleIn('ui.faq', el.getAttribute('data-value'));
    },
    'toggle-pref': function (event, el) {
      var key = el.getAttribute('data-value');
      var patch = {};
      patch[key] = !SIQ.store.state.ui[key];
      SIQ.store.ui(patch);
    },
    'reset-prefs': function () {
      SIQ.store.ui({
        autoAnalyze: false, fixOutcomesFirst: true, confirmEscalation: true, includeResolved: true,
        flagTemporary: true, prefRepeat: 3, prefConfidence: 2,
        notifyEscalation: true, notifyPattern: true, notifyCoverage: true, notifyDigest: false,
        retainIndefinitely: true, rememberOutcomes: true, exposeIntel: false
      });
      notifyDemo('Settings reset', 'Workspace preferences are back to their defaults.', 'info');
    },
    'save-prefs': function () {
      var repeat = els.content.querySelector('[data-select="prefRepeat"]');
      var confidence = els.content.querySelector('[data-select="prefConfidence"]');
      var patch = {};
      if (repeat) patch.prefRepeat = Number(repeat.value);
      if (confidence) patch.prefConfidence = Number(confidence.value);
      if (Object.keys(patch).length) SIQ.store.ui(patch);
      notifyDemo('Settings saved', 'These preferences apply to this workspace on this device.', 'success');
    },

    /* exports — the demo has no backend, so this is an explicit no-op */
    'export-customers': exportStub('customer directory'),
    'export-tickets': exportStub('ticket queue'),
    'export-memory': exportStub('memory records'),
    'export-escalations': exportStub('escalation queue'),
    'export-analytics': exportStub('analytics report')
  };

  function exportStub(what) {
    return function () {
      notifyDemo('Export unavailable in this demo', 'The ' + what + ' is fixture data in the browser, so there is no file to download.', 'info');
    };
  }

  function openTicket(ticketId) {
    var ticket = SIQ.data.ticket(ticketId);
    if (!ticket) return;
    SIQ.store.ui({ palette: false });
    SIQ.router.customer(ticket.customerId);
  }

  /* ------------------------------------------------------------- inputs */

  var INPUTS = {
    customerSearch: function (value) { SIQ.store.filters('overview', { q: value }); },
    customersQ: function (value) { SIQ.store.filters('customers', { q: value }); },
    ticketsQ: function (value) { SIQ.store.filters('tickets', { q: value }); },
    memoryQ: function (value) { SIQ.store.filters('memory', { q: value }); },
    escalationsQ: function (value) { SIQ.store.filters('escalations', { q: value }); },
    paletteQuery: function (value) { SIQ.store.ui({ paletteQuery: value, paletteIndex: 0 }); }
  };

  var SELECTS = {
    memoryCustomer: function (value) { SIQ.store.filters('memory', { customer: value }); },
    prefRepeat: function (value) { SIQ.store.ui({ prefRepeat: Number(value) }); },
    prefConfidence: function (value) { SIQ.store.ui({ prefConfidence: Number(value) }); }
  };

  function focusLater(selector) {
    requestAnimationFrame(function () {
      var el = document.querySelector(selector);
      if (el) el.focus();
    });
  }

  /* ---------------------------------------------------------- shortcuts */

  var chord = null;

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  function onKeyDown(event) {
    var state = SIQ.store.state;
    var mod = event.metaKey || event.ctrlKey;

    if (event.key === 'Escape') {
      if (state.ui.palette) { SIQ.store.ui({ palette: false }); return; }
      if (state.ui.notifications || state.ui.profile) { ACTIONS['close-popovers'](); return; }
      if (state.sidebar.open) { ACTIONS['close-sidebar'](); return; }
      return;
    }

    if (mod && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      state.ui.palette ? SIQ.store.ui({ palette: false }) : ACTIONS['open-palette']();
      return;
    }

    if (state.ui.palette) {
      var items = SIQ.Palette.flat(state);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        var dir = event.key === 'ArrowDown' ? 1 : -1;
        var next = state.ui.paletteIndex + dir;
        if (next < 0) next = items.length - 1;
        if (next >= items.length) next = 0;
        SIQ.store.ui({ paletteIndex: next });
        requestAnimationFrame(function () {
          var active = document.querySelector('.palette__item.is-active');
          if (active) active.scrollIntoView({ block: 'nearest' });
        });
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        var picked = items[state.ui.paletteIndex];
        if (!picked) return;
        SIQ.store.ui({ palette: false });
        if (picked.type === 'page') SIQ.router.to(picked.id);
        else if (picked.type === 'customer') SIQ.router.customer(picked.id);
        else openTicket(picked.id);
        return;
      }
    }

    if (isTypingTarget(event.target)) return;

    if (chord === 'g') {
      chord = null;
      var map = { c: 'customers', m: 'memory', t: 'tickets', e: 'escalations', a: 'analytics', o: 'overview' };
      var dest = map[event.key.toLowerCase()];
      if (dest) { event.preventDefault(); SIQ.router.to(dest); }
      return;
    }
    if (event.key.toLowerCase() === 'g') { chord = 'g'; return; }

    if (event.key === '/') {
      event.preventDefault();
      var search = els.content.querySelector('[data-focus-key="customerSearch"]');
      if (search) search.focus();
    }
  }

  /* ------------------------------------------------------------- wiring */

  function boot() {
    els.app = document.getElementById('app');
    els.sidebar = document.getElementById('sidebar');
    els.topbar = document.getElementById('topbar');
    els.content = document.getElementById('content');
    els.overlays = document.getElementById('overlays');
    els.scrim = document.getElementById('scrim');

    SIQ.dom.delegate(document, 'click', 'data-action', function (event, el, name) {
      var handler = ACTIONS[name];
      if (!handler) return;
      event.preventDefault();
      handler(event, el, name, event.target);
    });

    // A click anywhere else closes the header popovers.
    document.addEventListener('click', function (event) {
      var state = SIQ.store.state;
      if (!state.ui.notifications && !state.ui.profile) return;
      if (event.target.closest('.pop') || event.target.closest('[data-action="toggle-notifications"]') ||
          event.target.closest('[data-action="toggle-profile"]')) return;
      ACTIONS['close-popovers']();
    });

    Object.keys(INPUTS).forEach(function (name) {
      var handler = INPUTS[name];
      SIQ.dom.delegate(document, 'input', 'data-input', function (event, el) {
        if (el.getAttribute('data-input') !== name) return;
        handler(el.value);
      });
    });

    Object.keys(SELECTS).forEach(function (name) {
      var handler = SELECTS[name];
      SIQ.dom.delegate(document, 'change', 'data-select', function (event, el) {
        if (el.getAttribute('data-select') !== name) return;
        handler(el.value);
      });
    });

    document.addEventListener('keydown', onKeyDown);

    SIQ.router.onChange(function (next) {
      SIQ.store.ui({ notifications: false, profile: false, palette: false });
      renderRoute(SIQ.store.state);
    });

    SIQ.store.subscribe(function (state) {
      if (state.sidebar.collapsed) SIQ.dom.setHTML(els.sidebar, SIQ.Sidebar.render(state));
      render();
    });

    var initial = SIQ.router.parse();
    SIQ.store.set({ route: initial });
    renderRoute(SIQ.store.state);

    var bootEl = document.getElementById('boot');
    if (bootEl) {
      bootEl.classList.add('boot-done');
      setTimeout(function () { if (bootEl.parentNode) bootEl.parentNode.removeChild(bootEl); }, 320);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.SIQ);
