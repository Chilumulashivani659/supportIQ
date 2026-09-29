/* ==========================================================================
   tickets.js — active support queue (demo fixtures)
   ========================================================================== */
(function (SIQ) {
  'use strict';

  SIQ.data = SIQ.data || {};

  var tickets = [
    {
      id: 'T-4471', customerId: 'ISP-1001', issue: 'Evening slowdown', category: 'Fiber degradation',
      priority: 'High', status: 'open', channel: 'Phone', agent: 'A. Whitfield', mins: 128,
      sla: '4h 20m left', slaRatio: 0.62,
      action: 'Network-side line stability diagnostic',
      memoryRefs: 11
    },
    {
      id: 'T-4465', customerId: 'ISP-1005', issue: 'Evening slowdown', category: 'Fiber degradation',
      priority: 'High', status: 'in-progress', channel: 'Phone', agent: 'A. Whitfield', mins: 1490,
      sla: '1d 6h left', slaRatio: 0.4,
      action: 'Network-side line stability diagnostic',
      memoryRefs: 8
    },
    {
      id: 'T-4495', customerId: 'ISP-1003', issue: 'Intermittent total loss', category: 'Outage',
      priority: 'Critical', status: 'in-progress', channel: 'Phone', agent: 'R. Idris', mins: 1580,
      sla: 'Field window 32m', slaRatio: 0.92,
      action: 'Fibre field visit to inspect the drop segment',
      memoryRefs: 9
    },
    {
      id: 'T-4488', customerId: 'ISP-1002', issue: 'Wi-Fi drops in back hallway', category: 'Wi-Fi coverage',
      priority: 'Medium', status: 'open', channel: 'Chat', agent: 'S. Duarte', mins: 302,
      sla: '1d 3h left', slaRatio: 0.28,
      action: 'Provision second access point',
      memoryRefs: 6
    },
    {
      id: 'T-4515', customerId: 'ISP-1012', issue: 'TV dropouts during prime time', category: 'IPTV',
      priority: 'Medium', status: 'open', channel: 'Phone', agent: 'R. Idris', mins: 41,
      sla: '5h 20m left', slaRatio: 0.12,
      action: 'Review multicast group profile',
      memoryRefs: 2
    },
    {
      id: 'T-4290', customerId: 'ISP-1009', issue: 'Router reboots on its own', category: 'Router / ONT',
      priority: 'High', status: 'waiting', channel: 'Email', agent: 'M. Okafor', mins: 4320,
      sla: 'Awaiting customer window', slaRatio: 0.55,
      action: 'Schedule ONT replacement visit',
      memoryRefs: 6
    },
    {
      id: 'T-4516', customerId: 'ISP-1011', issue: 'Service move to new address', category: 'Account',
      priority: 'Low', status: 'open', channel: 'Phone', agent: 'M. Okafor', mins: 22,
      sla: '1d 22h left', slaRatio: 0.05,
      action: 'Schedule installation survey',
      memoryRefs: 0
    },
    {
      id: 'T-4510', customerId: 'ISP-1007', issue: 'Wi-Fi coverage in garden office', category: 'Wi-Fi coverage',
      priority: 'Low', status: 'resolved', channel: 'Ticket', agent: 'R. Idris', mins: 8640,
      sla: 'Closed', slaRatio: 1,
      action: 'Range extender provisioned',
      memoryRefs: 3
    },
    {
      id: 'T-4502', customerId: 'ISP-1004', issue: 'Slow uploads', category: 'Profile',
      priority: 'Medium', status: 'resolved', channel: 'Ticket', agent: 'L. Chen', mins: 4320,
      sla: 'Closed', slaRatio: 1,
      action: 'Correct ONT upstream profile',
      memoryRefs: 4
    },
    {
      id: 'T-4102', customerId: 'ISP-1008', issue: 'Latency spikes at peak hours', category: 'Latency',
      priority: 'Low', status: 'waiting', channel: 'Phone', agent: 'L. Chen', mins: 1440,
      sla: '2d 4h left', slaRatio: 0.3,
      action: 'Re-tune bufferbloat settings',
      memoryRefs: 3
    }
  ];

  tickets.forEach(function (t) {
    t.customer = SIQ.data.customer(t.customerId);
    t.opened = new Date(Date.now() - t.mins * 60000).toISOString();
  });

  SIQ.data.tickets = tickets;
  SIQ.data.ticket = function (id) {
    return tickets.filter(function (t) { return t.id === id; })[0] || null;
  };
  SIQ.data.ticketStatusLabel = {
    open: 'Open', 'in-progress': 'In Progress', waiting: 'Waiting', resolved: 'Resolved'
  };
})(window.SIQ);
