/* ==========================================================================
   analytics.js — dashboard metrics, chart series and activity (demo fixtures)
   ========================================================================== */
(function (SIQ) {
  'use strict';

  SIQ.data = SIQ.data || {};

  SIQ.data.metrics = {
    recurring: { value: 18, delta: 3, dir: 'up', note: 'vs last week', series: [11, 12, 12, 14, 13, 16, 15, 18] },
    recommendations: { value: 412, delta: 62, dir: 'up', note: 'this month', series: [318, 340, 352, 371, 380, 396, 402, 412] },
    resolution: { value: 78, suffix: '%', delta: 4, dir: 'up', note: 'resolved on first recommendation', series: [70, 71, 73, 72, 75, 74, 77, 78] },
    escalations: { value: 6, delta: 2, dir: 'down', note: 'open right now', series: [9, 8, 10, 8, 7, 8, 7, 6] }
  };

  SIQ.data.issueCategories = [
    { label: 'Fiber degradation', value: 32, tone: 'indigo' },
    { label: 'Wi-Fi coverage', value: 24, tone: 'indigo' },
    { label: 'Router / ONT', value: 19, tone: 'violet' },
    { label: 'Latency', value: 11, tone: 'violet' },
    { label: 'IP / DHCP', value: 8, tone: 'slate' },
    { label: 'Billing & account', value: 6, tone: 'slate' }
  ];

  SIQ.data.resolutionTrend = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    series: [
      { key: 'memory', label: 'Memory-informed', color: '#2c4ce0', points: [58, 62, 64, 69, 71, 74, 77, 78] },
      { key: 'baseline', label: 'Standard support', color: '#c3d0fb', points: [61, 62, 61, 63, 62, 64, 63, 64] }
    ]
  };

  SIQ.data.recurringProblems = [
    { label: 'Evening throughput drop', count: 9, tone: 'amber' },
    { label: 'Intermittent total loss', count: 6, tone: 'red' },
    { label: 'Device rebooting overnight', count: 5, tone: 'amber' },
    { label: 'Peak-hour latency spikes', count: 4, tone: 'indigo' },
    { label: 'Wi-Fi dead zone (same room)', count: 3, tone: 'indigo' }
  ];

  SIQ.data.recommendationTypes = {
    total: 412,
    items: [
      { label: 'Network diagnostics', value: 38, color: '#2c4ce0' },
      { label: 'Router / ONT replacement', value: 22, color: '#6f4fd8' },
      { label: 'Firmware correction', value: 15, color: '#3d5cf0' },
      { label: 'Field visit', value: 14, color: '#0e9f6e' },
      { label: 'Account or plan review', value: 11, color: '#98a3b8' }
    ]
  };

  SIQ.data.engineStats = {
    records: SIQ.data.memoryTotals ? SIQ.data.memoryTotals.records : 61,
    customers: SIQ.data.customers.length,
    patterns: 27,
    usedInRecommendations: SIQ.data.memoryTotals ? SIQ.data.memoryTotals.usedInRecommendations : 14,
    oldest: 'Jan 12, 2026',
    latency: '1.4s avg'
  };

  SIQ.data.activity = [
    { tone: 'indigo', icon: 'sparkles', text: '<b>Recommendation generated</b> for ISP-1001 · network-side line diagnostic', mins: 12 },
    { tone: 'red', icon: 'alert', text: '<b>Escalation raised</b> for ISP-1003 · fibre field team notified', mins: 34 },
    { tone: 'violet', icon: 'database', text: '<b>Memory updated</b> for ISP-1005 · outcome recorded as temporary', mins: 96 },
    { tone: 'green', icon: 'checkCircle', text: '<b>Resolution confirmed</b> for ISP-1004 · upstream profile corrected', mins: 150 },
    { tone: 'amber', icon: 'repeat', text: '<b>Recurring pattern detected</b> for ISP-1009 · reboots cluster before 07:00', mins: 240 },
    { tone: 'indigo', icon: 'target', text: '<b>Diagnostic recommended</b> for ISP-1006 · segment capacity review', mins: 320 }
  ];
})(window.SIQ);
