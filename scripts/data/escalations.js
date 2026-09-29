/* ==========================================================================
   escalations.js — escalation queue (demo fixtures)
   ========================================================================== */
(function (SIQ) {
  'use strict';

  SIQ.data = SIQ.data || {};

  var escalations = [
    {
      id: 'E-204', customerId: 'ISP-1003', ticket: 'T-4495', issue: 'Intermittent total loss',
      reason: 'Six repeat tickets over eight months. Two temporary fixes and a confirmed segment pattern point to a physical drop fault.',
      status: 'escalated', severity: 'Critical', owner: 'Field Engineering', mins: 420,
      nextStep: 'Fibre field visit scheduled 09:30 tomorrow',
      ladder: 2
    },
    {
      id: 'E-205', customerId: 'ISP-1009', ticket: 'T-4290', issue: 'Router reboots on its own',
      reason: 'Three temporary fixes across two months; recommendation already points to hardware replacement.',
      status: 'needs-review', severity: 'High', owner: 'Tier-2 Support', mins: 1440,
      nextStep: 'Confirm customer availability, then raise hardware replacement',
      ladder: 1
    },
    {
      id: 'E-206', customerId: 'ISP-1006', ticket: 'T-3855', issue: 'Slow browsing at peak hours',
      reason: 'Evening congestion confirmed on the distribution segment and now reported by neighbouring accounts.',
      status: 'needs-review', severity: 'Medium', owner: 'Network Planning', mins: 5760,
      nextStep: 'Capacity review for the 20:00–22:00 window on segment N-14',
      ladder: 1
    },
    {
      id: 'E-207', customerId: 'ISP-1005', ticket: 'T-4465', issue: 'Evening slowdown',
      reason: 'Fourth repeat ticket in five months. Router and ONT steps are exhausted, so escalation is the likely next move.',
      status: 'needs-review', severity: 'High', owner: 'Tier-2 Support', mins: 120,
      nextStep: 'Complete the recommended diagnostic before escalating',
      ladder: 1
    },
    {
      id: 'E-208', customerId: 'ISP-1002', ticket: 'T-3812', issue: 'Wi-Fi drops in back hallway',
      reason: 'Resolved in May 2026, same room. Second occurrence suggests a coverage design gap rather than a fault.',
      status: 'resolved', severity: 'Low', owner: 'Field Services', mins: 8640,
      nextStep: 'Closed — second access point provisioned',
      ladder: 3
    }
  ];

  escalations.forEach(function (e) {
    e.customer = SIQ.data.customer(e.customerId);
    e.raised = new Date(Date.now() - e.mins * 60000).toISOString();
  });

  SIQ.data.escalations = escalations;
  SIQ.data.escalationStatusLabel = {
    'needs-review': 'Needs Review', escalated: 'Escalated', resolved: 'Resolved'
  };
})(window.SIQ);
