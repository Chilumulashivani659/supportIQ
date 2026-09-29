/* ==========================================================================
   metriccard.js — KPI tile with optional sparkline
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function sparkline(series, color) {
    if (!series || series.length < 2) return '';
    var w = 132, h = 40, pad = 3;
    var min = Math.min.apply(null, series);
    var max = Math.max.apply(null, series);
    var span = (max - min) || 1;
    var step = (w - pad * 2) / (series.length - 1);
    var pts = series.map(function (v, i) {
      var x = pad + i * step;
      var y = h - pad - ((v - min) / span) * (h - pad * 2);
      return [x, y];
    });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = line + ' L' + (w - pad) + ' ' + h + ' L' + pad + ' ' + h + ' Z';
    var id = 'sg' + Math.abs(series[0] * 7 + series.length * 13 + color.length);
    return SIQ.dom.html`
      <svg class="kpi__spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${color}" stop-opacity="0.20"/>
            <stop offset="1" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${area}" fill="url(#${id})"/>
        <path d="${line}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${pts[pts.length - 1][0].toFixed(1)}" cy="${pts[pts.length - 1][1].toFixed(1)}" r="2.4" fill="${color}"/>
      </svg>`;
  }

  var COLORS = {
    indigo: '#2c4ce0', violet: '#6f4fd8', green: '#0e9f6e', amber: '#c2740b', red: '#d33a3a', slate: '#66748f'
  };

  function deltaChip(delta, dir, note) {
    if (delta === undefined || delta === null) return '';
    var tone = dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'flat';
    var icon = dir === 'up' ? 'trendUp' : dir === 'down' ? 'trendDown' : 'minus';
    var prefix = dir === 'down' ? '−' : '+';
    return SIQ.dom.html`
      <span class="delta delta--${tone}">${SIQ.icon(icon, 13, { strokeWidth: 2 })}${prefix}${delta}${note ? ' ' + note : ''}</span>`;
  }

  /**
   * render({label, value, suffix, delta, dir, note, icon, tone, series})
   */
  function render(m) {
    var color = COLORS[m.tone] || COLORS.indigo;
    return SIQ.dom.html`
      <div class="kpi">
        <div class="kpi__top">
          <div class="kpi__label">${m.label}</div>
          ${m.icon ? SIQ.dom.raw('<div class="kpi-ico kpi-ico--' + (m.tone || 'slate') + '">' + SIQ.icon(m.icon, 17).__siqRaw + '</div>') : ''}
        </div>
        <div class="kpi__value">${m.value}${m.suffix ? SIQ.dom.raw('<small>' + m.suffix + '</small>') : ''}</div>
        <div class="kpi__foot">
          ${deltaChip(m.delta, m.dir, m.note)}
          ${m.hint ? SIQ.dom.raw('<span class="t-xs ink-4">' + SIQ.dom.esc(m.hint) + '</span>') : ''}
        </div>
        ${m.series ? sparkline(m.series, color) : ''}
      </div>`;
  }

  SIQ.MetricCard = { render: render, sparkline: sparkline, COLORS: COLORS };
})(window.SIQ);
