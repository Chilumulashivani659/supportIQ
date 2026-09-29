/* ==========================================================================
   memoryinsight.js — insight cards derived from the customer's stored memory

   Every card is computed from the same records the Memory Timeline reads
   (SIQ.data.memoryFor). Nothing here is authored, cached or fetched: if the
   stored records do not support a statement, the card is not produced and the
   section falls back to a neutral "Not enough memory data" state.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var DAY = 86400000;
  var MAX_EVIDENCE = 6;

  /* -------------------------------------------------------------- helpers */

  function byType(entries, type) {
    return entries.filter(function (e) { return e.type === type; });
  }

  function ticketCount(entries) {
    var seen = {};
    entries.forEach(function (e) { if (e.ticket) seen[e.ticket] = true; });
    return Object.keys(seen).length;
  }

  function spanInDays(entries) {
    if (entries.length < 2) return 0;
    var newest = new Date(entries[0].date).getTime();
    var oldest = new Date(entries[entries.length - 1].date).getTime();
    return Math.max(0, Math.round((newest - oldest) / DAY));
  }

  function n(count, one, many) {
    return count + ' ' + (count === 1 ? one : (many || one + 's'));
  }

  /** Agrees a verb with a count, e.g. `verb(1, 'carries', 'carry')`. */
  function verb(count, one, many) {
    return count === 1 ? one : many;
  }

  /** Turns a stored record into a citation the agent can look up. */
  function cite(entry) {
    return {
      id: entry.id,
      date: SIQ.fmt.shortDate(entry.date),
      text: entry.ticket ? entry.title + ' · ' + entry.ticket : entry.title
    };
  }

  /** Cites records newest first, capped so one card cannot flood the grid. */
  function citeAll(entries) {
    var sorted = SIQ.fmt.byDateDesc(entries);
    return {
      total: sorted.length,
      shown: sorted.slice(0, MAX_EVIDENCE).map(cite)
    };
  }

  /* ------------------------------------------------------------- insights */

  /** Hours of the day, grouped into the windows the records can evidence. */
  var WINDOWS = [
    { key: 'morning', label: 'morning', from: 5, to: 11, range: '05:00–11:59' },
    { key: 'midday', label: 'midday', from: 12, to: 16, range: '12:00–16:59' },
    { key: 'evening', label: 'evening', from: 17, to: 22, range: '17:00–22:59' },
    { key: 'night', label: 'night', from: 23, to: 4, range: '23:00–04:59' }
  ];

  function windowOf(date) {
    var hour = new Date(date).getHours();
    for (var i = 0; i < WINDOWS.length; i++) {
      var w = WINDOWS[i];
      if (w.from <= w.to ? (hour >= w.from && hour <= w.to) : (hour >= w.from || hour <= w.to)) return w;
    }
    return null;
  }

  /** Recurrence: an explicit pattern record, or the same account on 2+ tickets. */
  function recurrenceInsight(entries) {
    var patterns = byType(entries, 'pattern');
    var tickets = ticketCount(entries);
    var days = spanInDays(entries);
    var span = SIQ.fmt.shortDate(entries[entries.length - 1].date) + ' to ' + SIQ.fmt.shortDate(entries[0].date) +
      (days ? ' (' + n(days, 'day') + ')' : '');

    if (patterns.length) {
      return {
        key: 'ins-pattern',
        icon: 'repeat',
        tone: 'amber',
        label: 'Recurring pattern',
        title: n(patterns.length, 'pattern', 'patterns') + ' recorded for this account',
        body: 'The stored history covers ' + n(tickets, 'ticket') + ' from ' + span +
          '. The most recent pattern record is dated ' + SIQ.fmt.shortDate(patterns[0].date) + '.',
        evidence: citeAll(patterns)
      };
    }

    if (tickets >= 2) {
      return {
        key: 'ins-tickets',
        icon: 'repeat',
        tone: 'slate',
        label: 'Ticket history',
        title: n(tickets, 'ticket') + ' on record for this account',
        body: 'No pattern record has been written yet, but the stored memory spans ' +
          n(tickets, 'separate ticket') + ' over ' + n(days, 'day') + '.',
        evidence: citeAll(byType(entries, 'report'))
      };
    }

    return null;
  }

  /** What the recorded outcomes of earlier work actually produced. */
  function outcomeInsight(entries) {
    var recorded = entries.filter(function (e) { return e.outcome; });
    if (!recorded.length) return null;

    var byOutcome = {};
    recorded.forEach(function (e) { byOutcome[e.outcome] = (byOutcome[e.outcome] || 0) + 1; });
    var improved = byOutcome.improved || 0;
    var temporary = byOutcome.temporary || 0;
    var noChange = byOutcome['no-change'] || 0;
    var escalated = byOutcome.escalated || 0;

    var parts = [];
    if (improved) parts.push(improved + ' improved');
    if (temporary) parts.push(temporary + ' temporary');
    if (noChange) parts.push(noChange + ' no change');
    if (escalated) parts.push(escalated + ' escalated');

    var title;
    if (escalated) title = 'Work on this account has already been escalated';
    else if (improved > temporary && improved > 0 && !noChange) title = 'Earlier fixes held for this customer';
    else if (temporary > improved) title = 'Earlier fixes only held temporarily';
    else title = 'Earlier fixes returned a mixed result';

    return {
      key: 'ins-outcomes',
      icon: 'checkCircle',
      tone: escalated ? 'red' : improved > temporary && !noChange ? 'green' : temporary > improved ? 'amber' : 'slate',
      label: 'Recorded outcomes',
      title: title,
      body: n(recorded.length, 'stored record') + ' ' + verb(recorded.length, 'carries', 'carry') +
        ' an outcome — ' + parts.join(', ') + ' — across ' + n(ticketCount(recorded), 'ticket') +
        '. The latest was recorded on ' + SIQ.fmt.shortDate(recorded[0].date) + '.',
      evidence: citeAll(recorded)
    };
  }

  /** Time-of-day clustering, only when one window clearly dominates the reports. */
  function windowInsight(entries) {
    var reports = byType(entries, 'report');
    if (reports.length < 3) return null;

    var buckets = {};
    var counts = {};
    reports.forEach(function (e) {
      var w = windowOf(e.date);
      if (!w) return;
      (buckets[w.key] = buckets[w.key] || []).push(e);
      counts[w.key] = (counts[w.key] || 0) + 1;
    });

    var keys = Object.keys(counts);
    if (!keys.length) return null;

    var dominantKey = keys.sort(function (a, b) { return counts[b] - counts[a]; })[0];
    var dominant = counts[dominantKey];
    if (dominant < 3 || dominant / reports.length < 0.6) return null;

    var w = WINDOWS.filter(function (x) { return x.key === dominantKey; })[0];
    var others = reports.length - dominant;
    return {
      key: 'ins-window',
      icon: 'clock',
      tone: 'indigo',
      label: 'Time of day',
      title: (others
        ? dominant + ' of ' + reports.length + ' stored reports fall in the ' + w.label + ' window'
        : 'All ' + n(dominant, 'stored report') + ' fall in the ' + w.label + ' window'),
      body: 'They were logged between ' + w.range + ' local time, across ' +
        n(ticketCount(buckets[dominantKey]), 'ticket') + '.' +
        (others ? ' The remaining ' + n(others, 'report') + ' on file sit outside it.' : ''),
      evidence: citeAll(buckets[dominantKey])
    };
  }

  /** How much of this history has already been reused. */
  function reuseInsight(entries) {
    var reused = entries.filter(function (e) { return e.usedIn; });
    if (!reused.length) return null;

    var total = reused.reduce(function (sum, e) { return sum + e.usedIn; }, 0);
    var top = reused.slice().sort(function (a, b) { return b.usedIn - a.usedIn; })[0];

    return {
      key: 'ins-reuse',
      icon: 'sparkles',
      tone: 'violet',
      label: 'Memory reuse',
      title: n(total, 'later recommendation') + ' already drew on this history',
      body: reused.length + ' of the ' + entries.length + ' stored records ' +
        verb(reused.length, 'has', 'have') + ' been reused. The most reused is "' + top.title + '" (' +
        SIQ.fmt.shortDate(top.date) + '), reused ' + n(top.usedIn, 'time') + '.',
      evidence: citeAll(reused)
    };
  }

  /** Recommendations already standing on the account, and what followed them. */
  function recommendationInsight(entries) {
    var recs = byType(entries, 'recommendation');
    if (!recs.length) return null;

    var newest = recs[0];
    var after = entries.filter(function (e) {
      return e.type !== 'recommendation' && new Date(e.date).getTime() > new Date(newest.date).getTime();
    });

    return {
      key: 'ins-recommendations',
      icon: 'lightbulb',
      tone: 'slate',
      label: 'Earlier recommendations',
      title: n(recs.length, 'recommendation') + ' already standing on this account',
      body: 'The most recent was "' + newest.title + '" on ' + SIQ.fmt.shortDate(newest.date) + '. ' +
        (after.length
          ? n(after.length, 'record') + ' ' + verb(after.length, 'was', 'were') + ' stored after it, the latest on ' + SIQ.fmt.shortDate(after[0].date) + '.'
          : 'No record has been stored since, so its result is unknown.'),
      evidence: citeAll(recs)
    };
  }

  var BUILDERS = [recurrenceInsight, outcomeInsight, windowInsight, reuseInsight, recommendationInsight];

  /** Runs every derivation over one customer's stored records. */
  function build(entries) {
    if (entries.length < 2) return [];
    return BUILDERS.map(function (deriveOne) { return deriveOne(entries); }).filter(Boolean);
  }

  /**
   * Derives the insight cards for one customer from their stored memory.
   * Fewer than two records cannot reveal anything, so it returns nothing.
   */
  function derive(customerId) {
    return build(SIQ.data.memoryFor(customerId));
  }

  /* -------------------------------------------------------------- markup */

  function card(insight, expanded) {
    var open = !!expanded[insight.key];
    var evidence = insight.evidence || { total: 0, shown: [] };
    var count = evidence.total;
    return SIQ.dom.html`
      <div class="insight tone-${insight.tone || 'indigo'}">
        <div class="insight__top">
          <span class="insight__ico">${SIQ.icon(insight.icon || 'sparkle', 15)}</span>
          <span class="insight__label">${insight.label}</span>
        </div>
        <div class="insight__title">${insight.title}</div>
        <div class="insight__body">${insight.body}</div>
        ${count ? SIQ.dom.html`
          <button class="insight__toggle${open ? ' is-open' : ''}" data-action="toggle-insight" data-value="${insight.key}"
                  aria-expanded="${open}">
            ${open ? 'Hide' : 'View'} supporting memories (${count})
            ${SIQ.icon('chevronDown', 13)}
          </button>
          ${open ? SIQ.dom.html`
            <div class="insight__evidence">
              <div class="insight__evidence-label">From customer memory</div>
              ${evidence.shown.map(function (e) {
                return SIQ.dom.html`<div class="insight__ev"><time>${e.date}</time><span>${e.text}</span></div>`;
              })}
              ${evidence.total > evidence.shown.length ? SIQ.dom.html`
                <div class="insight__ev"><time></time><span>${n(evidence.total - evidence.shown.length, 'further record')} not shown</span></div>` : ''}
            </div>` : ''}` : ''}
      </div>`;
  }

  /** Neutral state: shown whenever the stored records do not support a card. */
  function notEnough(entries) {
    var count = entries.length;
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('layers', 16)} Memory Insight</div>
            <div class="card__sub">Relevant patterns identified from previous interactions</div>
          </div>
          <span class="badge badge--slate">No insight available</span>
        </div>
        <div class="card__body">
          ${SIQ.States.memory({
            title: 'Not enough memory data',
            desc: count
              ? 'Only ' + n(count, 'memory record') + ' ' + verb(count, 'is', 'are') + ' stored for this customer. ' +
                'An insight needs recorded reports, outcomes or patterns behind it, so SupportIQ states none rather than guessing.'
              : 'No memory records are stored for this customer yet, so there is no stored history to draw an insight from.'
          })}
        </div>
      </div>`;
  }

  /**
   * @param customer  directory record (same input the Memory Timeline takes)
   * @param expanded  ws.expanded map, keyed by insight id
   */
  function render(customer, expanded) {
    var entries = SIQ.data.memoryFor(customer.id);
    var insights = build(entries);
    if (!insights.length) return SIQ.dom.raw(notEnough(entries));

    var open = expanded || {};
    var anyOpen = insights.some(function (i) { return open[i.key] && i.evidence.total; });

    return SIQ.dom.raw(SIQ.dom.html`
      <section>
        <div class="section-head">
          <div>
            <div class="section-head__title">${SIQ.icon('layers', 16)} Memory Insight</div>
            <div class="section-head__sub">Relevant patterns identified from previous interactions</div>
          </div>
          <div class="row gap-2">
            <span class="badge badge--violet badge--dot">${insights.length} ${insights.length === 1 ? 'insight' : 'insights'} · ${entries.length} ${entries.length === 1 ? 'memory' : 'memories'}</span>
            <button class="btn btn--sm btn--ghost" data-action="toggle-all-insights">
              ${anyOpen ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
        </div>
        <div class="insight-grid stagger">
          ${insights.map(function (insight) { return card(insight, open); })}
        </div>
      </section>`);
  }

  SIQ.MemoryInsight = { render: render, derive: derive };
})(window.SIQ);
