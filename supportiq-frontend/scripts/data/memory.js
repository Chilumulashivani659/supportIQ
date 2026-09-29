/* ==========================================================================
   memory.js — persisted customer memory records (demo fixtures)
   Every record is an interaction outcome stored once and reused by later
   recommendations. This is the substrate the intelligence screens read from.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  SIQ.data = SIQ.data || {};

  SIQ.data.memoryTypes = {
    report: { label: 'Customer Report', short: 'Report', icon: 'message', tone: 'indigo' },
    troubleshooting: { label: 'Troubleshooting', short: 'Troubleshoot', icon: 'wrench', tone: 'slate' },
    outcome: { label: 'Outcome', short: 'Outcome', icon: 'checkCircle', tone: 'green' },
    pattern: { label: 'Recurring Pattern', short: 'Pattern', icon: 'repeat', tone: 'amber' },
    recommendation: { label: 'Recommendation', short: 'Recommend', icon: 'lightbulb', tone: 'violet' }
  };

  SIQ.data.outcomeMeta = {
    improved: { label: 'Improved', tone: 'green' },
    temporary: { label: 'Temporary', tone: 'amber' },
    'no-change': { label: 'No change', tone: 'slate' },
    escalated: { label: 'Escalated', tone: 'red' }
  };

  var entries = [
    /* ---------------------------------------------------- ISP-1001 Amara */
    { id: 'M-3101', customerId: 'ISP-1001', type: 'pattern', date: '2026-06-14T19:40:00', title: 'Evening slowdown pattern confirmed', summary: 'Throughput drop recorded between 20:00 and 22:30 on 4 of 5 days.', tags: ['evening', 'throughput', 'pattern'], ticket: 'T-3982', usedIn: 3 },
    { id: 'M-3102', customerId: 'ISP-1001', type: 'report', date: '2026-06-15T08:05:00', title: 'Customer reports slower speeds in the evening', summary: 'Streaming stalls and page loads time out after 8pm.', tags: ['evening', 'streaming'], ticket: 'T-3982' },
    { id: 'M-3103', customerId: 'ISP-1001', type: 'troubleshooting', date: '2026-06-15T09:12:00', title: 'Router restart performed', summary: 'Archer C6 power-cycled; throughput recovered to 190 Mbps for two days.', tags: ['router', 'restart'], ticket: 'T-3982', outcome: 'temporary' },
    { id: 'M-3104', customerId: 'ISP-1001', type: 'outcome', date: '2026-06-17T21:30:00', title: 'Speed restored temporarily after restart', summary: 'Improvement lasted 48 hours before the evening drop returned.', tags: ['temporary', 'recurrence'], ticket: 'T-3982', outcome: 'temporary' },
    { id: 'M-3105', customerId: 'ISP-1001', type: 'report', date: '2026-07-09T18:20:00', title: 'Issue returned during evening peak', summary: 'Same symptom window as the previous ticket.', tags: ['evening', 'recurrence'], ticket: 'T-4117' },
    { id: 'M-3106', customerId: 'ISP-1001', type: 'troubleshooting', date: '2026-07-09T19:05:00', title: 'Firmware update to 1.4.2', summary: 'ONT and router firmware updated; customer confirmed immediate improvement.', tags: ['firmware', 'ont'], ticket: 'T-4117', outcome: 'improved' },
    { id: 'M-3107', customerId: 'ISP-1001', type: 'outcome', date: '2026-07-12T22:10:00', title: 'Improvement held for several days', summary: 'Stable for five days, then the evening slowdown returned.', tags: ['temporary', 'recurrence'], ticket: 'T-4117', outcome: 'improved' },
    { id: 'M-3108', customerId: 'ISP-1001', type: 'pattern', date: '2026-08-08T20:15:00', title: 'Recurring evening slowdown detected', summary: 'Same symptom window across three separate tickets over seven weeks.', tags: ['recurrence', 'evening', 'pattern'], ticket: 'T-4290', usedIn: 4 },
    { id: 'M-3109', customerId: 'ISP-1001', type: 'troubleshooting', date: '2026-08-08T20:40:00', title: 'Second router restart, no lasting effect', summary: 'Restart cleared the session; the issue returned the same evening.', tags: ['router', 'restart'], ticket: 'T-4290', outcome: 'temporary' },
    { id: 'M-3110', customerId: 'ISP-1001', type: 'recommendation', date: '2026-08-09T09:00:00', title: 'Recommended network diagnostics', summary: 'Router-level fixes exhausted; a network-side line diagnostic was suggested.', tags: ['diagnostic', 'recommendation'], ticket: 'T-4290', usedIn: 2 },
    { id: 'M-3111', customerId: 'ISP-1001', type: 'report', date: '2026-09-28T06:12:00', title: 'Current report: slow internet again every evening', summary: 'Speed drops from 190 Mbps to roughly 40 Mbps between 20:00 and 22:00.', tags: ['evening', 'throughput'], ticket: 'T-4471' },

    /* ---------------------------------------------------- ISP-1002 Daniel */
    { id: 'M-3120', customerId: 'ISP-1002', type: 'report', date: '2026-05-02T10:20:00', title: 'Wi-Fi drops reported in hallway', summary: 'Devices disconnect when moving to the far end of the hallway.', tags: ['wifi', 'coverage'], ticket: 'T-3812' },
    { id: 'M-3121', customerId: 'ISP-1002', type: 'troubleshooting', date: '2026-05-02T11:00:00', title: 'Channel congestion test', summary: '2.4 GHz channel overlap with neighbouring access points confirmed.', tags: ['wifi', 'rf'], ticket: 'T-3812', outcome: 'improved' },
    { id: 'M-3122', customerId: 'ISP-1002', type: 'outcome', date: '2026-05-04T08:45:00', title: 'Manual channel change improved coverage', summary: 'Drops stopped for three weeks.', tags: ['improved'], ticket: 'T-3812', outcome: 'improved' },
    { id: 'M-3123', customerId: 'ISP-1002', type: 'report', date: '2026-09-26T16:30:00', title: 'Drops returned in back hallway', summary: 'Same room as the earlier report, four months later.', tags: ['wifi', 'recurrence'], ticket: 'T-4488' },
    { id: 'M-3124', customerId: 'ISP-1002', type: 'pattern', date: '2026-09-26T17:10:00', title: 'Same access point, different room', summary: 'Drops cluster at the far end of the hallway on both reports.', tags: ['pattern', 'wifi'], ticket: 'T-4488', usedIn: 1 },
    { id: 'M-3125', customerId: 'ISP-1002', type: 'recommendation', date: '2026-09-27T08:20:00', title: 'Second access point recommended', summary: 'Extender placement reviewed with the customer before ordering.', tags: ['recommendation', 'hardware'], ticket: 'T-4488' },

    /* ----------------------------------------------------- ISP-1003 Priya */
    { id: 'M-3140', customerId: 'ISP-1003', type: 'report', date: '2026-01-12T13:10:00', title: 'Total loss of service reported', summary: 'Connection dropped for roughly four minutes during the afternoon.', tags: ['outage', 'ont'], ticket: 'T-3390' },
    { id: 'M-3141', customerId: 'ISP-1003', type: 'troubleshooting', date: '2026-01-12T14:00:00', title: 'ONT reboot and reseat', summary: 'ONT rebooted and fibre connector reseated at the wall plate.', tags: ['ont'], ticket: 'T-3390', outcome: 'temporary' },
    { id: 'M-3142', customerId: 'ISP-1003', type: 'outcome', date: '2026-01-15T09:30:00', title: 'Service restored for three days', summary: 'No further loss until 18 January.', tags: ['temporary', 'recurrence'], ticket: 'T-3390', outcome: 'temporary' },
    { id: 'M-3143', customerId: 'ISP-1003', type: 'report', date: '2026-02-02T15:20:00', title: 'Loss returned twice in one day', summary: 'Both losses occurred between 13:00 and 16:00.', tags: ['outage', 'recurrence'], ticket: 'T-3502' },
    { id: 'M-3144', customerId: 'ISP-1003', type: 'pattern', date: '2026-02-05T10:05:00', title: 'Loss correlates with daytime load', summary: 'Losses cluster between 13:00 and 16:00 on the same distribution segment.', tags: ['pattern', 'segment'], ticket: 'T-3502', usedIn: 3 },
    { id: 'M-3145', customerId: 'ISP-1003', type: 'troubleshooting', date: '2026-06-11T11:40:00', title: 'Loop and error counters reviewed', summary: 'High received-power variance recorded on the drop segment.', tags: ['fiber', 'counters'], ticket: 'T-4021' },
    { id: 'M-3146', customerId: 'ISP-1003', type: 'recommendation', date: '2026-06-12T08:50:00', title: 'Field visit recommended', summary: 'Engineering recommended a fibre field visit to inspect the drop.', tags: ['field', 'recommendation'], ticket: 'T-4021', usedIn: 3 },
    { id: 'M-3147', customerId: 'ISP-1003', type: 'report', date: '2026-09-26T12:15:00', title: 'Loss reported three times in one day', summary: 'One loss lasted eleven minutes and affected all devices.', tags: ['outage', 'recurrence'], ticket: 'T-4495' },
    { id: 'M-3148', customerId: 'ISP-1003', type: 'outcome', date: '2026-09-27T16:30:00', title: 'Escalated to fibre field team', summary: 'Field team notified; visit window offered for the following morning.', tags: ['escalation', 'field'], ticket: 'T-4495', outcome: 'escalated', usedIn: 1 },

    /* ---------------------------------------------------- ISP-1004 Marcus */
    { id: 'M-3160', customerId: 'ISP-1004', type: 'report', date: '2026-09-18T14:25:00', title: 'Uploads much slower than download', summary: 'Off-site uploads of about 1 Mbps on a 1 Gbps plan.', tags: ['upstream'], ticket: 'T-4502' },
    { id: 'M-3161', customerId: 'ISP-1004', type: 'troubleshooting', date: '2026-09-19T09:15:00', title: 'ONT upstream profile checked', summary: 'Upstream profile found set to 20 Mbps instead of the provisioned value.', tags: ['profile', 'ont'], ticket: 'T-4502' },
    { id: 'M-3162', customerId: 'ISP-1004', type: 'outcome', date: '2026-09-21T10:05:00', title: 'Upstream profile corrected', summary: 'Uploads restored to plan speed and verified with the customer.', tags: ['improved'], ticket: 'T-4502', outcome: 'improved' },
    { id: 'M-3163', customerId: 'ISP-1004', type: 'recommendation', date: '2026-09-21T10:20:00', title: 'Profile check added to runbook memory', summary: 'Upstream profile verification kept as the standard first step for slow uploads.', tags: ['recommendation', 'runbook'], ticket: 'T-4502', usedIn: 1 },

    /* ----------------------------------------------------- ISP-1005 Lena */
    { id: 'M-3180', customerId: 'ISP-1005', type: 'report', date: '2026-05-19T19:55:00', title: 'Evening slowdown reported', summary: 'Video calls degrade after 8pm across all mesh nodes.', tags: ['evening'], ticket: 'T-3702' },
    { id: 'M-3181', customerId: 'ISP-1005', type: 'troubleshooting', date: '2026-05-19T20:30:00', title: 'ONT reboot performed', summary: 'Session cleared; speeds normal for the rest of the evening.', tags: ['ont', 'restart'], ticket: 'T-3702', outcome: 'temporary' },
    { id: 'M-3182', customerId: 'ISP-1005', type: 'outcome', date: '2026-05-28T21:10:00', title: 'Improvement lasted nine days', summary: 'Longest stable stretch recorded for this account.', tags: ['temporary'], ticket: 'T-3702', outcome: 'temporary' },
    { id: 'M-3183', customerId: 'ISP-1005', type: 'report', date: '2026-06-02T20:05:00', title: 'Slowdown returned in the evening', summary: 'Same pattern as the previous ticket.', tags: ['recurrence', 'evening'], ticket: 'T-3766' },
    { id: 'M-3184', customerId: 'ISP-1005', type: 'troubleshooting', date: '2026-07-15T18:40:00', title: 'Mesh nodes resynced', summary: 'Nodes resynced and rebalanced; gains faded after four days.', tags: ['mesh'], ticket: 'T-3905', outcome: 'temporary' },
    { id: 'M-3185', customerId: 'ISP-1005', type: 'pattern', date: '2026-08-30T21:15:00', title: 'Recurring evening pattern across four tickets', summary: 'Every report falls in the 20:00 to 22:00 window with no daytime reports.', tags: ['pattern', 'recurrence'], ticket: 'T-4255', usedIn: 3 },
    { id: 'M-3186', customerId: 'ISP-1005', type: 'report', date: '2026-09-26T20:20:00', title: 'Slowdown again around 8pm', summary: 'Reports the pattern is now familiar to the household.', tags: ['evening', 'recurrence'], ticket: 'T-4465' },
    { id: 'M-3187', customerId: 'ISP-1005', type: 'troubleshooting', date: '2026-09-27T09:00:00', title: 'Second ONT reboot, temporary gain', summary: 'Reboot produced a one-day gain only.', tags: ['ont', 'restart'], ticket: 'T-4465', outcome: 'temporary' },

    /* ---------------------------------------------------- ISP-1006 Yusuf */
    { id: 'M-3200', customerId: 'ISP-1006', type: 'report', date: '2026-06-10T21:25:00', title: 'Slow browsing in the evening', summary: 'Pages take several seconds to load between 20:00 and 23:00.', tags: ['evening', 'latency'], ticket: 'T-3855' },
    { id: 'M-3201', customerId: 'ISP-1006', type: 'troubleshooting', date: '2026-06-11T10:00:00', title: 'Speed test scheduled off-peak', summary: 'Off-peak test recorded 141 Mbps on the same device.', tags: ['speedtest'], ticket: 'T-3855', outcome: 'improved' },
    { id: 'M-3202', customerId: 'ISP-1006', type: 'outcome', date: '2026-06-12T21:30:00', title: 'Speed normal off-peak, degraded at peak', summary: '188 Mbps at 10am and 24 Mbps at 21:00 on identical hardware.', tags: ['peak', 'evidence'], ticket: 'T-3855', outcome: 'no-change' },
    { id: 'M-3203', customerId: 'ISP-1006', type: 'pattern', date: '2026-06-14T08:40:00', title: 'Peak-hour congestion on segment', summary: 'Two neighbouring accounts report the same evening window.', tags: ['pattern', 'segment'], ticket: 'T-3855', usedIn: 1 },
    { id: 'M-3204', customerId: 'ISP-1006', type: 'recommendation', date: '2026-06-14T09:05:00', title: 'Segment capacity review recommended', summary: 'Engineering to review evening capacity on the distribution segment.', tags: ['recommendation', 'capacity'], ticket: 'T-3855' },

    /* --------------------------------------------------- ISP-1007 Sofia */
    { id: 'M-3220', customerId: 'ISP-1007', type: 'report', date: '2026-09-16T12:40:00', title: 'No signal in garden office', summary: 'Workroom at the far end of the garden has no usable coverage.', tags: ['wifi', 'coverage'], ticket: 'T-4510' },
    { id: 'M-3221', customerId: 'ISP-1007', type: 'troubleshooting', date: '2026-09-17T10:15:00', title: 'Coverage test in garden', summary: 'Signal measured at -78 dBm against an indoor target of -67 dBm.', tags: ['rf', 'measurement'], ticket: 'T-4510' },
    { id: 'M-3222', customerId: 'ISP-1007', type: 'outcome', date: '2026-09-19T15:30:00', title: 'Range extender provisioned', summary: 'Extender installed and verified at -64 dBm in the office.', tags: ['improved', 'hardware'], ticket: 'T-4510', outcome: 'improved' },

    /* ---------------------------------------------------- ISP-1008 Tom */
    { id: 'M-3240', customerId: 'ISP-1008', type: 'report', date: '2026-05-02T19:15:00', title: 'Latency spikes in the evening', summary: 'Gaming latency rises above 90 ms when streaming runs on other devices.', tags: ['latency', 'evening'], ticket: 'T-3640' },
    { id: 'M-3241', customerId: 'ISP-1008', type: 'troubleshooting', date: '2026-05-08T11:00:00', title: 'Bufferbloat tuning applied', summary: 'SQM settings applied on the static IP router.', tags: ['tuning'], ticket: 'T-3640', outcome: 'temporary' },
    { id: 'M-3242', customerId: 'ISP-1008', type: 'outcome', date: '2026-05-20T20:00:00', title: 'Latency stabilised for two weeks', summary: 'Improvement faded as household streaming grew.', tags: ['temporary'], ticket: 'T-3640', outcome: 'temporary' },

    /* ---------------------------------------------------- ISP-1009 Aisha */
    { id: 'M-3260', customerId: 'ISP-1009', type: 'report', date: '2026-07-28T06:40:00', title: 'Router reboots overnight', summary: 'Connection drops every night shortly after midnight.', tags: ['ont', 'reboot'], ticket: 'T-4088' },
    { id: 'M-3261', customerId: 'ISP-1009', type: 'troubleshooting', date: '2026-07-28T09:30:00', title: 'Power adapter swapped', summary: 'New adapter supplied; reboots paused for five days.', tags: ['power'], ticket: 'T-4088', outcome: 'temporary' },
    { id: 'M-3262', customerId: 'ISP-1009', type: 'outcome', date: '2026-08-02T06:20:00', title: 'Reboots returned', summary: 'Same early-morning pattern resumed.', tags: ['temporary', 'recurrence'], ticket: 'T-4088', outcome: 'temporary' },
    { id: 'M-3263', customerId: 'ISP-1009', type: 'troubleshooting', date: '2026-08-09T10:10:00', title: 'Firmware rollback to 2.9.6', summary: 'Rollback reduced reboot frequency for two days only.', tags: ['firmware'], ticket: 'T-4290', outcome: 'temporary' },
    { id: 'M-3264', customerId: 'ISP-1009', type: 'pattern', date: '2026-08-11T08:05:00', title: 'Reboots cluster before 07:00', summary: 'Device logs show upstream sync retries immediately before each reboot.', tags: ['pattern', 'logs'], ticket: 'T-4290', usedIn: 2 },
    { id: 'M-3265', customerId: 'ISP-1009', type: 'recommendation', date: '2026-08-11T08:30:00', title: 'ONT replacement recommended', summary: 'Hardware replacement suggested after two temporary fixes.', tags: ['recommendation', 'hardware'], ticket: 'T-4290' },

    /* ---------------------------------------------------- ISP-1010 Chen */
    { id: 'M-3280', customerId: 'ISP-1010', type: 'report', date: '2026-07-24T13:25:00', title: 'Wired desktop slower than Wi-Fi', summary: 'Desktop on Ethernet reports lower throughput than a Wi-Fi laptop.', tags: ['wired', 'nic'], ticket: 'T-3955' },
    { id: 'M-3281', customerId: 'ISP-1010', type: 'troubleshooting', date: '2026-07-25T09:45:00', title: 'NIC driver version checked', summary: 'Client driver 3.9 is out of date for this board model.', tags: ['nic', 'hardware'], ticket: 'T-3955' },
    { id: 'M-3282', customerId: 'ISP-1010', type: 'outcome', date: '2026-07-29T11:20:00', title: 'Driver updated', summary: 'Throughput on the wired client returned to plan speed.', tags: ['improved'], ticket: 'T-3955', outcome: 'improved' },
    { id: 'M-3283', customerId: 'ISP-1010', type: 'recommendation', date: '2026-07-29T11:35:00', title: 'Client hardware profile saved', summary: 'Board model and correct driver recorded for future tickets.', tags: ['recommendation', 'profile'], ticket: 'T-3955', usedIn: 1 },

    /* --------------------------------------------------- ISP-1012 Noah */
    { id: 'M-3300', customerId: 'ISP-1012', type: 'report', date: '2026-02-14T20:10:00', title: 'TV dropouts in the evening', summary: 'IPTV session drops during the 20:00 to 22:00 window.', tags: ['iptv', 'evening'], ticket: 'T-3490' },
    { id: 'M-3301', customerId: 'ISP-1012', type: 'outcome', date: '2026-02-17T09:25:00', title: 'Multicast profile reset', summary: 'Multicast group profile reset; dropouts stopped.', tags: ['improved', 'iptv'], ticket: 'T-3490', outcome: 'improved' }
  ];

  entries.forEach(function (e) {
    e.customer = SIQ.data.customer(e.customerId);
  });

  SIQ.data.memory = entries;
  SIQ.data.memoryFor = function (customerId) {
    return SIQ.fmt.byDateDesc(entries.filter(function (e) { return e.customerId === customerId; }));
  };
  SIQ.data.memoryById = function (id) {
    return entries.filter(function (e) { return e.id === id; })[0] || null;
  };
  SIQ.data.memoryTotals = {
    records: entries.length,
    customers: customersWithMemory(),
    oldest: 'Jan 2026',
    usedInRecommendations: entries.reduce(function (n, e) { return n + (e.usedIn || 0); }, 0)
  };

  function customersWithMemory() {
    var seen = {};
    entries.forEach(function (e) { seen[e.customerId] = true; });
    return Object.keys(seen).length;
  }
})(window.SIQ);
