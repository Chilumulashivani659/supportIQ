/* ==========================================================================
   statusbadge.js — consistent status vocabulary across the product
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var CUSTOMER = {
    active: { tone: 'indigo', label: 'Active', icon: 'userCheck' },
    recurring: { tone: 'amber', label: 'Recurring Issue', icon: 'repeat' },
    escalated: { tone: 'red', label: 'Escalated', icon: 'alert' },
    resolved: { tone: 'green', label: 'Resolved', icon: 'checkCircle' }
  };

  var TICKET = {
    open: { tone: 'indigo', label: 'Open' },
    'in-progress': { tone: 'amber', label: 'In Progress' },
    waiting: { tone: 'slate', label: 'Waiting' },
    resolved: { tone: 'green', label: 'Resolved' }
  };

  var COVERAGE = {
    full: { tone: 'green', label: 'Available' },
    partial: { tone: 'amber', label: 'Partial' },
    none: { tone: 'slate', label: 'None' }
  };

  var PRIORITY = {
    Critical: 'red', High: 'amber', Medium: 'indigo', Low: 'slate'
  };

  var ESCALATION = {
    'needs-review': { tone: 'amber', label: 'Needs Review' },
    escalated: { tone: 'red', label: 'Escalated' },
    resolved: { tone: 'green', label: 'Resolved' }
  };

  var OUTCOME = {
    improved: { tone: 'green', label: 'Improved' },
    temporary: { tone: 'amber', label: 'Temporary' },
    'no-change': { tone: 'slate', label: 'No change' },
    escalated: { tone: 'red', label: 'Escalated' }
  };

  function badge(label, tone, opts) {
    var o = opts || {};
    return SIQ.dom.html`<span class="badge badge--dot badge--${tone}${o.sm ? ' badge--sm' : ''}">${label}</span>`;
  }

  function customer(status) {
    var c = CUSTOMER[status] || CUSTOMER.active;
    return badge(c.label, c.tone);
  }

  function ticket(status) {
    var t = TICKET[status] || TICKET.open;
    return badge(t.label, t.tone);
  }

  function coverage(level) {
    var c = COVERAGE[level] || COVERAGE.none;
    return badge(c.label, c.tone, { sm: true });
  }

  function priority(level) {
    var tone = PRIORITY[level] || 'slate';
    return SIQ.dom.html`<span class="prio prio--${tone.toLowerCase()}"><span class="prio__dot"></span>${level}</span>`;
  }

  function escalation(status) {
    var e = ESCALATION[status] || ESCALATION['needs-review'];
    return badge(e.label, e.tone);
  }

  function outcome(key) {
    if (!key) return '';
    var o = OUTCOME[key];
    if (!o) return '';
    return badge(o.label, o.tone, { sm: true });
  }

  /** The recommendation flag — deliberately outlined, never solid "done". */
  function recommendationFlag() {
    return SIQ.dom.html`<span class="badge badge--flag badge--flag-indigo">${SIQ.icon('sparkle', 11, { strokeWidth: 2 })} Recommended</span>`;
  }

  SIQ.StatusBadge = {
    badge: badge, customer: customer, ticket: ticket, coverage: coverage,
    priority: priority, escalation: escalation, outcome: outcome,
    recommendationFlag: recommendationFlag,
    maps: { CUSTOMER: CUSTOMER, TICKET: TICKET, COVERAGE: COVERAGE, ESCALATION: ESCALATION, OUTCOME: OUTCOME }
  };
})(window.SIQ);
