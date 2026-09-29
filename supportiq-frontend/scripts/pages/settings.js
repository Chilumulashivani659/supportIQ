/* ==========================================================================
   pages/settings.js — workspace preferences
   Controls are local to the browser session. Nothing is sent anywhere: the
   settings describe how SupportIQ behaves for this workspace only.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function toggle(key, on, label) {
    return SIQ.dom.html`
      <button class="switch${on ? ' is-on' : ''}" data-action="toggle-pref" data-value="${key}"
              role="switch" aria-checked="${on}" aria-label="${label}"></button>`;
  }

  function row(title, desc, control) {
    return SIQ.dom.html`
      <div class="set-row">
        <div>
          <div class="set-row__title">${title}</div>
          <div class="set-row__desc">${desc}</div>
        </div>
        <div style="flex:none">${control}</div>
      </div>`;
  }

  function section(title, sub, icon, body) {
    return SIQ.dom.html`
      <div class="card set-section">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon(icon, 16)} ${title}</div>
            <div class="card__sub">${sub}</div>
          </div>
        </div>
        <div class="card__body">${body}</div>
      </div>`;
  }

  function render(state) {
    var ui = state.ui;
    var s = SIQ.data.engineStats;

    var analysis = SIQ.dom.html`
      ${row('Auto-analyze on ticket open',
        'Start the memory read as soon as a customer workspace is opened, instead of waiting for the agent to press Analyze Issue.',
        toggle('autoAnalyze', ui.autoAnalyze, 'Auto-analyze on ticket open'))}
      ${row('Show previous fix outcomes first',
        'Lead the insight list with how earlier fixes performed, so an agent sees what did not work before what might.',
        toggle('fixOutcomesFirst', ui.fixOutcomesFirst, 'Show previous fix outcomes first'))}
      ${row('Require confirmation before escalation',
        'Always show the memory-derived reason and next step before an escalation can be raised.',
        toggle('confirmEscalation', ui.confirmEscalation, 'Require confirmation before escalation'))}
      ${row('Include resolved tickets in pattern detection',
        'Let resolved outcomes influence a later recommendation. Turning this off reads only unresolved history.',
        toggle('includeResolved', ui.includeResolved, 'Include resolved tickets in pattern detection'))}`;

    var notifications = SIQ.dom.html`
      ${row('Escalation raised',
        'Notify me when memory indicates an escalation is required.',
        toggle('notifyEscalation', ui.notifyEscalation, 'Notify on escalation'))}
      ${row('Recurring pattern detected',
        'Notify me when a new ticket matches a stored pattern.',
        toggle('notifyPattern', ui.notifyPattern, 'Notify on recurring pattern'))}
      ${row('Memory coverage is partial',
        'Notify me when a customer has too little stored history for a confident recommendation.',
        toggle('notifyCoverage', ui.notifyCoverage, 'Notify on partial memory coverage'))}
      ${row('Daily summary',
        'A single digest of recommendations issued, escalations and repeat issues.',
        toggle('notifyDigest', ui.notifyDigest, 'Daily summary'))}`;

    var retention = SIQ.dom.html`
      ${row('Keep memory records indefinitely',
        'Stored records stay available for future pattern detection. Turning this off limits recall to recent history.',
        toggle('retainIndefinitely', ui.retainIndefinitely, 'Keep memory records indefinitely'))}
      ${row('Remember interaction outcomes',
        'Write the outcome of each support interaction back to customer memory so the next ticket starts from it.',
        toggle('rememberOutcomes', ui.rememberOutcomes, 'Remember interaction outcomes'))}
      ${row('Show internal intelligence to customers',
        'Disabled by default. Internal intelligence is for agents; customers only ever receive the concise response.',
        toggle('exposeIntel', ui.exposeIntel, 'Show internal intelligence to customers'))}`;

    var thresholds = SIQ.dom.html`
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;padding-bottom:16px">
        <label class="field">
          <span class="field__label">Repeat tickets before a pattern is flagged</span>
          <select class="select" data-select="prefRepeat" aria-label="Repeat tickets before a pattern is flagged">
            ${[2, 3, 4, 5].map(function (n) {
              return SIQ.dom.html`<option value="${n}" ${ui.prefRepeat === n ? 'selected' : ''}>${n} tickets</option>`;
            })}
          </select>
        </label>
        <label class="field">
          <span class="field__label">Minimum memory records for a confident read</span>
          <select class="select" data-select="prefConfidence" aria-label="Minimum memory records for a confident read">
            ${[1, 2, 3, 5].map(function (n) {
              return SIQ.dom.html`<option value="${n}" ${ui.prefConfidence === n ? 'selected' : ''}>${n} records</option>`;
            })}
          </select>
        </label>
      </div>
      ${row('Flag temporary fixes as ineffective',
        'When an earlier fix faded within a week, mark it so it is not recommended again.',
        toggle('flagTemporary', ui.flagTemporary, 'Flag temporary fixes as ineffective'))}`;

    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Settings</h1>
          <p class="page-head__sub">How SupportIQ reads memory in this workspace. Changes apply immediately and stay on this device.</p>
        </div>
        <div class="page-head__actions">
          <button class="btn" data-action="reset-prefs">${SIQ.icon('refresh', 15)} Reset to defaults</button>
          <button class="btn btn--primary" data-action="save-prefs">${SIQ.icon('check', 15, { strokeWidth: 2 })} Save settings</button>
        </div>
      </div>

      ${section('Intelligence', 'How stored memory shapes each analysis.', 'cpu', analysis)}
      ${section('Thresholds', 'When a pattern is considered confirmed.', 'sliders', thresholds)}
      ${section('Notifications', 'What deserves your attention between tickets.', 'bell', notifications)}
      ${section('Memory & retention', 'What SupportIQ stores, and what stays internal.', 'database', retention)}

      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('shieldCheck', 16)} Privacy position</div>
            <div class="card__sub">Support memory is limited to support interactions on this platform</div>
          </div>
          <span class="badge badge--green badge--dot">Enforced</span>
        </div>
        <div class="card__body">
          <div class="row-t gap-3" style="padding:12px 13px;border-radius:var(--r-md);background:var(--green-50);border:1px solid var(--green-100)">
            <span style="color:var(--green-600)">${SIQ.icon('lock', 17)}</span>
            <div>
              <div class="strong" style="font-size:13px">Customers never see internal memory records</div>
              <div class="t-xs ink-3 mt-2">
                The analysis, evidence and recommendation stay internal to support staff. The customer receives only the
                concise written response, and an agent reviews it before anything is sent.
              </div>
            </div>
          </div>
          <div class="row gap-2 wrap mt-4">
            <span class="tag">${SIQ.icon('database', 12)} ${s.records} records on this workspace</span>
            <span class="tag">${SIQ.icon('users', 12)} ${s.customers} customers with history</span>
            <span class="tag">${SIQ.icon('clock', 12)} Oldest ${s.oldest}</span>
            <span class="tag">${SIQ.icon('zap', 12)} ${s.latency} analysis</span>
          </div>
        </div>
      </div>`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.settings = { render: render };
})(window.SIQ);
