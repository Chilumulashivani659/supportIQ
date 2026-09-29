/* ==========================================================================
   toast.js — transient notifications
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var host = null;
  var seq = 0;

  function container() {
    if (!host) host = document.getElementById('toasts');
    return host;
  }

  var ICONS = {
    success: 'checkCircle',
    info: 'info',
    warning: 'alert',
    danger: 'alertCircle'
  };

  function show(opts) {
    var o = opts || {};
    var type = o.type || 'info';
    var id = 'toast-' + (++seq);
    var el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.id = id;
    el.setAttribute('role', 'status');
    el.innerHTML = SIQ.dom.html`
      <span class="toast__ico">${SIQ.icon(ICONS[type] || 'info', 17)}</span>
      <div class="grow">
        <div class="toast__title">${o.title || ''}</div>
        ${o.desc ? SIQ.dom.raw('<div class="toast__desc">' + SIQ.dom.esc(o.desc) + '</div>') : ''}
      </div>
      <button class="toast__close" data-toast-close="${id}" aria-label="Dismiss notification">${SIQ.icon('x', 14)}</button>
    `;
    container().appendChild(el);

    var timer = setTimeout(function () { dismiss(id); }, o.duration || 3600);
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-toast-close]');
      if (!btn) return;
      clearTimeout(timer);
      dismiss(id);
    });
    return id;
  }

  function dismiss(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-leaving');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 180);
  }

  function clear() {
    var c = container();
    while (c.firstChild) c.removeChild(c.firstChild);
  }

  SIQ.toast = { show: show, dismiss: dismiss, clear: clear };
})(window.SIQ);
