/* ==========================================================================
   format.js — presentation formatting helpers
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function num(n) {
    return Number(n || 0).toLocaleString('en-US');
  }

  function pct(n, digits) {
    return Number(n).toFixed(digits === undefined ? 0 : digits) + '%';
  }

  function shortDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return String(iso || '');
    return MONTHS[d.getMonth()] + ' ' + d.getDate();
  }

  function mediumDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return String(iso || '');
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function dateTime(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return String(iso || '');
    var h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12; if (h === 0) h = 12;
    return shortDate(iso) + ' · ' + h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
  }

  /** Coarse relative time, demo-friendly wording. */
  function ago(iso) {
    var d = new Date(iso).getTime();
    if (isNaN(d)) return '';
    var diff = Date.now() - d;
    var min = Math.round(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return min + 'm ago';
    var h = Math.round(min / 60);
    if (h < 24) return h + 'h ago';
    var day = Math.round(h / 24);
    if (day < 7) return day + 'd ago';
    var w = Math.round(day / 7);
    if (w < 6) return w + 'w ago';
    return Math.round(w / 4.4) + 'mo ago';
  }

  function plural(n, one, many) {
    return n + ' ' + (n === 1 ? one : (many || one + 's'));
  }

  function words(str) {
    var s = String(str || '').trim();
    return s ? s.split(/\s+/).length : 0;
  }

  function titleCase(str) {
    return String(str || '').replace(/(^|\s|-)([a-z])/g, function (m, p, c) { return p + c.toUpperCase(); });
  }

  function groupBy(list, keyFn) {
    var out = {};
    list.forEach(function (item) {
      var k = keyFn(item);
      (out[k] = out[k] || []).push(item);
    });
    return out;
  }

  function byDateDesc(list) {
    return list.slice().sort(function (a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  function match(haystack, needle) {
    return String(haystack || '').toLowerCase().indexOf(String(needle || '').toLowerCase()) !== -1;
  }

  SIQ.fmt = {
    num: num, pct: pct, shortDate: shortDate, mediumDate: mediumDate, dateTime: dateTime,
    ago: ago, plural: plural, words: words, titleCase: titleCase,
    groupBy: groupBy, byDateDesc: byDateDesc, match: match, MONTHS: MONTHS
  };
})(window.SIQ);
