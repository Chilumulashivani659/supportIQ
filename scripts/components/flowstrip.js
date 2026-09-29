/* ==========================================================================
   flowstrip.js — the product story in one line
   Past Interactions → Memory → Pattern → Intelligence → Recommendation → Response
   ========================================================================== */
(function (SIQ) {
  'use strict';

  var STEPS = [
    { title: 'Past Interactions', meta: 'Tickets and outcomes', icon: 'inbox' },
    { title: 'Memory', meta: 'Stored once, reused', icon: 'database', mod: 'memory' },
    { title: 'Pattern', meta: 'Recurring detected', icon: 'repeat' },
    { title: 'Intelligence', meta: 'Reads the history', icon: 'cpu', mod: 'output' },
    { title: 'Recommendation', meta: 'Next best action', icon: 'target' },
    { title: 'Response', meta: 'Concise reply', icon: 'send', mod: 'response' }
  ];

  function render() {
    var nodes = [];
    STEPS.forEach(function (s, i) {
      if (i > 0) {
        nodes.push('<div class="flow-arrow" aria-hidden="true">' + SIQ.icon('chevronRight', 16).__siqRaw + '</div>');
      }
      nodes.push(
        '<div class="flow-node' + (s.mod ? ' flow-node--' + s.mod : '') + '">' +
        '<span class="flow-node__ico">' + SIQ.icon(s.icon, 15).__siqRaw + '</span>' +
        '<div><div class="flow-node__title">' + s.title + '</div>' +
        '<div class="flow-node__meta">' + s.meta + '</div></div></div>'
      );
    });
    return SIQ.dom.raw('<div class="flow" role="list">' + nodes.join('') + '</div>');
  }

  SIQ.FlowStrip = { render: render, STEPS: STEPS };
})(window.SIQ);
