/* ==========================================================================
   pages/help.js — how SupportIQ works, and how to work with it
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var FAQS = [
    {
      q: 'Where does SupportIQ get its information?',
      a: 'From support interactions on this platform. Every report, troubleshooting step and outcome is written to customer memory once, and later tickets are compared against that stored history. SupportIQ does not read the live network, so a recommendation is always a next step to try, never a diagnosis it performed itself.'
    },
    {
      q: 'What does a recommendation actually mean?',
      a: 'It is the next action memory points to — not an action that has been taken. It stays in an outlined "Recommended" state until an agent marks it in progress or completed. That distinction is deliberate: a suggestion that already looked finished would be easy to trust too early.'
    },
    {
      q: 'Why is a previous fix shown as temporary?',
      a: 'Because the stored outcome says so. If a restart restored full speed and the symptom returned within two days, that fix is recorded as temporary. SupportIQ will not recommend the same step again as though it were new, which is the main reason memory changes the outcome.'
    },
    {
      q: 'What happens when a customer has no memory yet?',
      a: 'Analysis still runs, but the recommendation can only reflect the current report. The screen says so explicitly instead of implying a pattern exists. That interaction becomes the first record, and the next ticket for the same customer starts with more context.'
    },
    {
      q: 'The analysis failed. Did the memory get lost?',
      a: 'No. A failed read means the memory index did not respond for that line — the records are still stored. Retrying almost always succeeds. The error screen links straight to the memory records so you can confirm they are there.'
    },
    {
      q: 'Does an agent have to send the customer response?',
      a: 'No. The response is a draft. An agent can edit it, copy it, or send it. Nothing reaches the customer automatically, and internal intelligence is never included in it.'
    },
    {
      q: 'How is escalation decided?',
      a: 'Escalation is a decision, not an automatic step. SupportIQ shows the reason drawn from stored outcomes, the next step and the current rung of the ladder. Even when a case strongly indicates escalation, an agent confirms it.'
    },
    {
      q: 'Can customers see their own memory records?',
      a: 'No. Memory records are internal to support staff. Customers only ever receive the concise written response. That separation is enforced in the product and reflected in settings.'
    }
  ];

  function faq(item, index, open) {
    return SIQ.dom.html`
      <div class="faq-item">
        <button class="faq-q${open ? ' is-open' : ''}" data-action="toggle-faq" data-value="${index}" aria-expanded="${open}">
          <span>${item.q}</span>
          ${SIQ.icon('chevronDown', 17)}
        </button>
        ${open ? SIQ.dom.html`<div class="faq-a">${item.a}</div>` : ''}
      </div>`;
  }

  function faqCard(state) {
    var open = state.ui.faq || {};
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('buoy', 16)} Common questions</div>
            <div class="card__sub">${FAQS.length} answers about memory, recommendations and escalation</div>
          </div>
        </div>
        <div class="card__body">
          ${FAQS.map(function (item, i) { return faq(item, i, !!open[i]); })}
        </div>
      </div>`;
  }

  function principles() {
    return [
      {
        icon: 'database', tone: 'violet', title: 'Memory is stored once',
        body: 'Every interaction outcome is written once and reused. The next agent does not start from zero, and the customer does not have to repeat themselves.'
      },
      {
        icon: 'repeat', tone: 'amber', title: 'Patterns come from repeat data',
        body: 'A pattern is only flagged when several stored interactions agree — same symptom, same time window, same location. One report is treated as one report.'
      },
      {
        icon: 'wrench', tone: 'indigo', title: 'Exhausted fixes are not repeated',
        body: 'If a step worked temporarily, memory records that. The recommendation moves past it rather than sending the customer through the same fix again.'
      },
      {
        icon: 'target', tone: 'green', title: 'One clear next action',
        body: 'Recommendations are specific, time-boxed and reversible where possible. Each one says what happens, whether service is interrupted, and what it matches.'
      },
      {
        icon: 'alert', tone: 'red', title: 'Escalation is a human decision',
        body: 'SupportIQ shows the reason and the next step, then waits. A field visit is never raised without an agent confirming it.'
      },
      {
        icon: 'lock', tone: 'slate', title: 'Internal stays internal',
        body: 'Analysis, evidence and recommendations are visible to support staff only. The customer receives a short, human reply that an agent reviews first.'
      }
    ];
  }

  function principlesCard() {
    return SIQ.dom.html`
      <div class="card card--intel">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('cpu', 16)} Six principles behind every recommendation</div>
            <div class="card__sub">The rules SupportIQ holds itself to</div>
          </div>
        </div>
        <div class="card__body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
            ${principles().map(function (p) {
              return SIQ.dom.html`
                <div class="row-t gap-3">
                  <span class="intel-cell__ico tone-${p.tone}">${SIQ.icon(p.icon, 15)}</span>
                  <div>
                    <div class="strong" style="font-size:13px">${p.title}</div>
                    <div class="t-xs ink-3 mt-2" style="line-height:1.55">${p.body}</div>
                  </div>
                </div>`;
            })}
          </div>
        </div>
      </div>`;
  }

  function walkthrough() {
    var steps = [
      { n: '1', title: 'Find the customer', body: 'Search by customer ID, name, ticket or symptom from the overview, the command palette, or the customer list.' },
      { n: '2', title: 'Read the current issue', body: 'The workspace opens with the reported problem, plan context, equipment and how many memories already exist.' },
      { n: '3', title: 'Analyze the issue', body: 'SupportIQ reads the stored history, looks for a matching pattern, and grades how earlier fixes performed.' },
      { n: '4', title: 'Compare the two reads', body: 'The Memory Delta shows the same ticket without and with history, so the difference is visible at a glance.' },
      { n: '5', title: 'Act on the recommendation', body: 'One next action with the reason, effort and risk. Mark it in progress or completed as you work.' },
      { n: '6', title: 'Reply to the customer', body: 'A short draft grounded in what memory found. Edit it, then send — the customer never sees the internal analysis.' }
    ];
    return SIQ.dom.html`
      <div class="card">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('list', 16)} A support interaction, end to end</div>
            <div class="card__sub">Six steps, whichever ticket you are on</div>
          </div>
        </div>
        <div class="card__body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px">
            ${steps.map(function (s) {
              return SIQ.dom.html`
                <div class="row-t gap-3">
                  <span class="badge badge--indigo badge--sm" style="min-width:22px;justify-content:center">${s.n}</span>
                  <div>
                    <div class="strong" style="font-size:13px">${s.title}</div>
                    <div class="t-xs ink-3 mt-2" style="line-height:1.55">${s.body}</div>
                  </div>
                </div>`;
            })}
          </div>
        </div>
      </div>`;
  }

  function shortcuts() {
    return [
      { keys: ['⌘', 'K'], desc: 'Open the command palette' },
      { keys: ['/'], desc: 'Focus the customer search' },
      { keys: ['↑', '↓'], desc: 'Move through palette results' },
      { keys: ['↵'], desc: 'Open the highlighted result' },
      { keys: ['esc'], desc: 'Close the palette, or dismiss a popover' },
      { keys: ['G', 'then', 'C'], desc: 'Go to the customer workspace' },
      { keys: ['G', 'then', 'M'], desc: 'Go to customer memory' }
    ];
  }

  function shortcutsCard() {
    return SIQ.dom.html`
      <div class="card" style="min-width:0">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('monitor', 16)} Keyboard shortcuts</div>
            <div class="card__sub">Built for working a queue quickly</div>
          </div>
        </div>
        <div class="card__body">
          ${shortcuts().map(function (s) {
            return SIQ.dom.html`
              <div class="shortcut-row">
                <span class="ink-2">${s.desc}</span>
                <span class="row gap-1">${s.keys.map(function (k) { return SIQ.dom.html`<span class="kbd">${k}</span>`; })}</span>
              </div>`;
          })}
        </div>
      </div>`;
  }

  function contactCard() {
    return SIQ.dom.html`
      <div class="card card--pad" style="min-width:0">
        <div class="eyebrow">Still stuck?</div>
        <h2 class="t-title" style="margin:8px 0 6px">Ask the intelligence team</h2>
        <p class="t-sm ink-3" style="line-height:1.6;max-width:44ch">
          If a recommendation looks wrong, tell us which customer and which stored record it ignored. That feedback is
          the fastest way to improve the pattern rules.
        </p>
        <div class="row gap-2 wrap mt-4">
          <a class="btn btn--primary" href="mailto:support@supportiq.example">${SIQ.icon('mail', 15)} Email support</a>
          <a class="btn" href="#/settings" data-nav="settings">${SIQ.icon('sliders', 15)} Review settings</a>
        </div>
        <div class="divider" style="margin:18px 0"></div>
        <div class="row gap-2 wrap">
          <span class="tag">${SIQ.icon('shieldCheck', 12)} Engine v2.4</span>
          <span class="tag">${SIQ.icon('zap', 12)} ${SIQ.data.engineStats.latency} analysis</span>
          <span class="tag">${SIQ.icon('database', 12)} ${SIQ.data.memoryTotals.records} records indexed</span>
        </div>
      </div>`;
  }

  function render(state) {
    return SIQ.dom.html`
      <div class="page-head row-b wrap gap-4">
        <div>
          <h1 class="page-head__title">Help &amp; Support</h1>
          <p class="page-head__sub">How SupportIQ reads memory, and how to work with it on a live ticket.</p>
        </div>
        <div class="page-head__actions">
          <span class="count-pill">${SIQ.icon('sparkles', 13)} Memory-powered</span>
        </div>
      </div>

      <div class="card anim-up">
        <div class="card__head">
          <div>
            <div class="card__title">${SIQ.icon('git', 16)} From a support ticket to a decision</div>
            <div class="card__sub">The same pipeline runs for every customer</div>
          </div>
        </div>
        <div class="card__body">${SIQ.FlowStrip.render()}</div>
      </div>

      <div class="mt-5">${principlesCard()}</div>
      <div class="mt-5">${walkthrough()}</div>

      <div class="mt-5" style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px" data-two-col>
        <div style="min-width:0">${faqCard(state)}</div>
        <div class="col gap-4" style="min-width:0">${shortcutsCard()}${contactCard()}</div>
      </div>`;
  }

  SIQ.Pages = SIQ.Pages || {};
  SIQ.Pages.help = { render: render, FAQS: FAQS };
})(window.SIQ);
