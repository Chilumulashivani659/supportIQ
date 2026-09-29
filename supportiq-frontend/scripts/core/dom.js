/* ==========================================================================
   dom.js — tiny rendering helpers (tagged template + event delegation)
   Classic script: attaches to the single SIQ namespace.
   ========================================================================== */
window.SIQ = window.SIQ || {};

(function (SIQ) {
  'use strict';

  var ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function esc(value) {
    if (value === null || value === undefined || value === false) return '';
    return String(value).replace(/[&<>"']/g, function (c) { return ESC_MAP[c]; });
  }

  /**
   * Marks a string as pre-escaped markup. Idempotent: re-marking a value that
   * is already raw unwraps it, so `raw(html`...`)` is always safe.
   */
  function raw(str) {
    if (str && typeof str === 'object' && str.__siqRaw !== undefined) return str;
    return { __siqRaw: str === null || str === undefined ? '' : String(str) };
  }

  function isRaw(v) {
    return !!(v && typeof v === 'object' && v.__siqRaw !== undefined);
  }

  /** Unwraps markup to a string, for sinks such as innerHTML. */
  function toMarkup(value) {
    return isRaw(value) ? value.__siqRaw : (value === null || value === undefined ? '' : String(value));
  }

  function interpolate(v) {
    if (v === null || v === undefined || v === false || v === true) return '';
    if (Array.isArray(v)) return v.map(interpolate).join('');
    if (isRaw(v)) return v.__siqRaw;
    return esc(v);
  }

  /**
   * Tagged template that escapes interpolations by default.
   * Returns a raw-marked value, so results of `html` may be nested into other
   * `html` templates without being escaped a second time.
   *
   *   html`<p>${userInput}</p>`                        // userInput is escaped
   *   html`<div>${html`<b>${trusted}</b>`}</div>`      // nested markup survives
   */
  function html(strings) {
    var out = strings[0];
    for (var i = 1; i < arguments.length; i++) out += interpolate(arguments[i]) + strings[i];
    return { __siqRaw: out };
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /** Replace innerHTML of a container while keeping keyboard focus and caret. */
  function setHTML(el, value) {
    if (!el) return;
    var markup = toMarkup(value);
    var active = document.activeElement;
    var key = active && active.getAttribute && active.getAttribute('data-focus-key');
    var start = null, end = null;
    if (key && el.contains(active)) {
      start = active.selectionStart; end = active.selectionEnd;
    }
    el.innerHTML = markup;
    if (key) {
      var next = el.querySelector('[data-focus-key="' + key + '"]');
      if (next) {
        next.focus();
        if (start !== null && start !== undefined) {
          try { next.setSelectionRange(start, end); } catch (e) { /* non-text input */ }
        }
      }
    }
  }

  /**
   * Delegated listener. The handler receives (event, actionElement, actionName).
   * Elements opt in with data-action="name".
   */
  function delegate(root, type, selectorAttr, handler) {
    root.addEventListener(type, function (event) {
      var el = event.target.closest('[' + selectorAttr + ']');
      if (!el || !root.contains(el)) return;
      handler(event, el, el.getAttribute(selectorAttr));
    });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 160);
    };
  }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function initials(name) {
    return String(name || '')
      .trim().split(/\s+/).slice(0, 2)
      .map(function (p) { return p.charAt(0).toUpperCase(); })
      .join('');
  }

  function avatarTone(seed) {
    var tones = ['', 'avatar--violet', 'avatar--green', 'avatar--amber', 'avatar--slate'];
    var n = 0, s = String(seed || '');
    for (var i = 0; i < s.length; i++) n += s.charCodeAt(i);
    return tones[n % tones.length];
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) { reject(err); }
    });
  }

  SIQ.dom = {
    html: html, esc: esc, raw: raw, markup: toMarkup, isRaw: isRaw, qs: qs, qsa: qsa,
    setHTML: setHTML, delegate: delegate, debounce: debounce,
    clamp: clamp, initials: initials, avatarTone: avatarTone, copyText: copyText
  };
})(window.SIQ);
