/* ==========================================================================
   pages/analytics.js — support operations metrics
   Every number here traces back to stored memory or the recommendations it
   produced. Charts are inline SVG; no chart library is used.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var TONE_VAR = {
    indigo: 'var(--indigo-500)', green: 'var(--green-600)', amber: 'var(--amber-600)',
    violet: 'var(--purple-600)', red: 'var(--red-600)', slate: 'var(--border-strong)'
  };

  /* ------------------------------------------------------ line chart ---- */
  function lineChart(trend) {
    var w = 560, h = 210, padL = 34, padR = 12, padT = 12, padB = 26;
    var all = trend.series.reduce(function (acc, s) { return acc.concat(s.points); }, []);
    var max = Math.max.apply(null, all);
    var min = Math.min.apply(null, all);
    var span = (max - min) || 1;
    var lo = Math.max(0, min - 8);
    var hi = max + 6;
    var stepX = (w - padL - padR) / (trend.labels.length - 1);

    function px(i) { return padL + i * stepX; }
    function py(v) { return padT + (h - padT - padB) * (1 - ((v - lo) / (hi - lo))); }

    var gridVals = [lo, lo + (hi - lo) / 2, hi];
    var grid = gridVals.map(function (v) {
      return '<line x1="' + padL + '" y1="' + py(v).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + py(v).toFixed(1) +
        '" stroke="var(--border-soft)" stroke-width="1"/>' +
        '<text x="' + (padL - 7) + '" y="' + (py(v) + 3.5).toFixed(1) + '" text-anchor="end" ' +
        'font-size="9.5" fill="var(--ink-4)">' + Math.round(v) + '%</text>';
    }).join('');

    var lines = trend.series.map(function (s, si) {
      var d = s.points.map(function (v, i) {
        return (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(v).toFixed(1);
      }).join(' ');
      var area = d + ' L' + px(s.points.length - 1).toFixed(1) + ' ' + (h - padB) + ' L' + padL + ' ' + (h - padB) + ' Z';
      var dots = s.points.map(function (v, i) {
        return '<circle cx="' + px(i).toFixed(1) + '" cy="' + py(v).toFixed(1) + '" r="2.8" fill="' + s.color + '"/>';
      }).join('');
      return (si === 0
        ? '<path d="' + area + '" fill="' + s.color + '" opacity="0.08"/>'
        : '') +
        '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"' +
        (si === 0 ? '' : ' stroke-dasharray="5 4"') + '/>' + dots;
    }).join('');

    var labels = trend.labels.map(function (l, i) {
      return '<text x="' + px(i).toFixed(1) + '" y="' + (h - padB + 15) + '" text-anchor="middle" ' +
        'font-size="9.5" fill="var(--ink-4)">' + l + '</text>';
    }).join('');

    return SIQ.dom.raw(
      '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="auto" role="img" ' +
      'aria-label="Resolution rate by week, memory-informed compared with standard support">' +
      grid + lines + labels + '</svg>'
    );
  }

  /* ------------------------------------------------------- bar chart ---- */
  function categoryBars() {
    var max = Math.max.apply(null, SIQ.data.issueCategories.map(function (c) { return c.value; }));
    return SIQ.dom.html`
      <div class="bars">
        ${SIQ.data.issueCategories.map(function (c) {
          return SIQ.dom.html`
            <div>
              <div class="bar-row__top">
                <span class="bar-row__label">${c.label}</span>
                <span class="bar-row__value">${c.value}%</span>
              </div>
              <div class="bar-row__track">
                <div class="bar-row__fill" style="width:${Math.round((c.value / max) * 100)}%;background:${TONE_VAR[c.tone] || TONE_VAR.indigo}"></div>
              </div>
            </div>`;
        })}
      </div>`;
  }

  /* ---------------------------------------------------------- donut ----- */
  function donut() {
    var items = SIQ.data.recommendationTypes.items;
    var total = SIQ.data.recommendationTypes.total;
    var r = 56, size = 148, c = size / 2;
    var circ = 2 * Math.PI * r;
    var offset = 0;

    var segs = items.map(function (it) {
      var frac = it.value / 100;
      var len = circ * frac;
      var seg = '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="' + it.color +
        '" stroke-width="17" stroke-dasharray="' + (len - 2.2).toFixed(2) + ' ' + (circ - len + 2.2).toFixed(2) +
        '" stroke-dashoffset="' + (-offset).toFixed(2) + '" stroke-linecap="butt" ' +
        'transform="rotate(-90 ' + c + ' ' + c + ')"><title>' + it.label + ' · ' + it.value + '%</title></circle>';
      offset += len;
      return seg;
    }).join('');

    return SIQ.dom.raw(
      '<div class="donut-wrap">' +
        '<div class="donut" style="width:' + size + 'px;height:' + size + 'px">' +
          '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" ' +
          'aria-label="Recommendation types by share">' + segs + '</svg>' +
          '<div class="donut__center">' +
            '<div class="donut__center-value">' + SIQ.fmt.num(total) + '</div>' +
            '<div class="donut__center-label">recommendations</div>' +
          '</div>' +
        '</div>' +
        '<div class="grow" style="min-width:180px">' +
          '<div class="legend">' +
            items.map(function (it) {
              return '<div class="legend__item"><span class="legend__swatch" style="background:' + it.color + '"></span>' +
                '<span class="legend__name">' + SIQ.dom.esc(it.label) + '</span>' +
                '<span class="legend__value">' + it.value + '%</span></div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function render(state) {
    var m = SIQ.data.metrics;
    var s = SIQ.data.engineStats;
    var trend = SIQ.data.resolutionTrend;
    var gap = trend.series[0].points[trend.series[0].points.length - 1] -
              trend.series[1].points[trend.series[1].points.length - 1];

    var kpis = SIQ.dom.html`
      <div class="analytics-grid">
        ${SIQ.MetricCard.render({ label: 'Recurring issues', value: m.recurring.value, delta: m.recurring.delta, dir: m.recurring.dir, note: m.recurring.note, icon: 'repeat', tone: 'amber', series: m.recurring.series })}
        ${SIQ.MetricCard.render({ label: 'Recommendations issued', value: SIQ.fmt.num(m.recommendations.value), delta: m.recommendations.delta, dir: m.recommendations.dir, note: m.recommendations.note, icon: 'sparkles', tone: 'indigo', series: m.recommendations.series })}
        ${SIQ.MetricCard.render({ label: 'Resolved on first recommendation', value: m.resolution.value, suffix: '%', delta: m.resolution.delta, dir: m.resolution.dir, note: m.resolution.note, icon: 'checkCircle', tone: 'green', series: m.resolution.series })}
        ${SIQ.MetricCard.render({ label: 'Open escalations', value: m.escalations.value, delta: m.escalations.delta, dir: m.escalations.dir, note: m.escalations.note, icon: 'alert', tone: 'red', series: m.escalations.series })}
      </div>`;

    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Analytics</h1>
          <p class="page-head__sub">What stored memory changed: which fixes stuck, and which patterns keep coming back.</p>
        </div>
        <div class="page-head__actions">
          <span class="count-pill">${SIQ.icon('calendar', 13)} Last 8 weeks</span>
          <button class="btn" data-action="export-analytics">${SIQ.icon('download', 15)} Export report</button>
        </div>
      </div>

      ${kpis}

      <div class="mt-5">
        <div class="card">
          <div class="card__head">
            <div>
              <div class="card__title">${SIQ.icon('trendUp', 16)} Resolution rate: memory-informed vs standard support</div>
              <div class="card__sub">Same ticket volume, different starting point</div>
            </div>
            <span class="badge badge--green badge--dot">${gap > 0 ? '+' + gap + ' points' : gap + ' points'}</span>
          </div>
          <div class="card__body chart-body">
            ${lineChart(trend)}
            <div class="row gap-4 wrap mt-3" style="align-items:center">
              <div class="legend__item" style="flex:none">
                <span class="legend__swatch" style="background:${trend.series[0].color}"></span>
                <span class="legend__name">${trend.series[0].label}</span>
                <span class="legend__value">${trend.series[0].points[7]}%</span>
              </div>
              <div class="legend__item" style="flex:none">
                <span class="legend__swatch" style="background:${trend.series[1].color}"></span>
                <span class="legend__name">${trend.series[1].label}</span>
                <span class="legend__value">${trend.series[1].points[7]}%</span>
              </div>
              <span class="grow"></span>
              <span class="chart-note" style="margin:0">Tickets where the recommended action resolved on the first attempt</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px" data-two-col>
        <div class="card" style="min-width:0">
          <div class="card__head">
            <div>
              <div class="card__title">${SIQ.icon('pie', 16)} Issue categories</div>
              <div class="card__sub">Share of tickets by reported symptom</div>
            </div>
          </div>
          <div class="card__body card__body--tight">${categoryBars()}</div>
        </div>

        <div class="card" style="min-width:0">
          <div class="card__head">
            <div>
              <div class="card__title">${SIQ.icon('repeat', 16)} Recurring problems</div>
              <div class="card__sub">Patterns currently stored in memory</div>
            </div>
            <a class="btn btn--sm btn--ghost" href="#/memory" data-nav="memory">Open memory ${SIQ.icon('arrowRight', 13)}</a>
          </div>
          <div class="card__body card__body--tight">
            <div class="bars">
              ${SIQ.data.recurringProblems.map(function (p) {
                var max = SIQ.data.recurringProblems[0].count;
                return SIQ.dom.html`
                  <div>
                    <div class="bar-row__top">
                      <span class="bar-row__label">${p.label}</span>
                      <span class="bar-row__value">${p.count}</span>
                    </div>
                    <div class="bar-row__track">
                      <div class="bar-row__fill" style="width:${Math.round((p.count / max) * 100)}%;background:${TONE_VAR[p.tone] || TONE_VAR.indigo}"></div>
                    </div>
                  </div>`;
              })}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px" data-two-col>
        <div class="card" style="min-width:0">
          <div class="card__head">
            <div>
              <div class="card__title">${SIQ.icon('target', 16)} Recommendation types</div>
              <div class="card__sub">What SupportIQ advised, this month</div>
            </div>
          </div>
          <div class="card__body">${donut()}</div>
        </div>

        <div class="card card--memory" style="min-width:0">
          <div class="card__head">
            <div class="card__title">${SIQ.icon('database', 16)} Memory engine</div>
            <span class="badge badge--green badge--dot">Online</span>
          </div>
          <div class="card__body card__body--tight">
            <div class="stat-list">
              <div class="stat-list__row">
                <span class="stat-list__label">${SIQ.icon('layers', 14)} Records indexed</span>
                <span class="stat-list__value">${s.records}</span>
              </div>
              <div class="stat-list__row">
                <span class="stat-list__label">${SIQ.icon('users', 14)} Customers covered</span>
                <span class="stat-list__value">${s.customers} / ${SIQ.data.customers.length}</span>
              </div>
              <div class="stat-list__row">
                <span class="stat-list__label">${SIQ.icon('repeat', 14)} Patterns detected</span>
                <span class="stat-list__value">${s.patterns}</span>
              </div>
              <div class="stat-list__row">
                <span class="stat-list__label">${SIQ.icon('sparkles', 14)} Reused in recommendations</span>
                <span class="stat-list__value">${s.usedInRecommendations}</span>
              </div>
              <div class="stat-list__row">
                <span class="stat-list__label">${SIQ.icon('clock', 14)} Oldest record</span>
                <span class="stat-list__value">${s.oldest}</span>
              </div>
              <div class="stat-list__row">
                <span class="stat-list__label">${SIQ.icon('zap', 14)} Analysis latency</span>
                <span class="stat-list__value">${s.latency}</span>
              </div>
            </div>
            <a class="btn btn--sm btn--indigo-soft btn--block mt-4" href="#/memory" data-nav="memory">
              ${SIQ.icon('layers', 14)} Browse customer memory
            </a>
          </div>
        </div>
      </div>`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.analytics = { render: render };
})(window.SIQ);
