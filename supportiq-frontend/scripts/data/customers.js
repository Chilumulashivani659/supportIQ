/* ==========================================================================
   customers.js — customer directory (demo fixtures, frontend only)
   `mins` = minutes since last interaction, resolved to a real timestamp at
   load time so relative labels stay accurate whenever the demo is opened.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  SIQ.data = SIQ.data || {};

  var customers = [
    {
      id: 'ISP-1001', name: 'Amara Osei', zone: 'North Region', plan: '200 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Nokia G-140W-C',
      router: 'TP-Link Archer C6', routerFw: '1.4.2 Build 220313', staticIp: false,
      status: 'recurring', issue: 'Evening slowdown',
      currentMessage: 'My internet is slow again every evening.',
      channel: 'Phone', mins: 128, openSinceMins: 128, sla: '4h 20m left',
      priority: 'High', openTickets: 2, memories: 11, coverage: 'full',
      memberSince: 'Mar 2021', accountManager: 'M. Okafor', email: 'a.osei@northmail.example',
      lastOutcome: 'Temporary improvement after firmware update', lastResolved: 'Jul 12, 2026',
      repeatRate: '3 of 5 tickets'
    },
    {
      id: 'ISP-1002', name: 'Daniel Reyes', zone: 'South Region', plan: '500 Mbps Fiber',
      connection: 'Fiber', access: 'XGS-PON', ont: 'Nokia G-140W-C',
      router: 'Zyxel AX7501', routerFw: '2.0.4', staticIp: false,
      status: 'active', issue: 'Wi-Fi drops in back hallway',
      currentMessage: 'The Wi-Fi keeps dropping in the back hallway since last week.',
      channel: 'Chat', mins: 302, openSinceMins: 302, sla: '1d 3h left',
      priority: 'Medium', openTickets: 1, memories: 6, coverage: 'full',
      memberSince: 'Nov 2022', accountManager: 'S. Duarte', email: 'd.reyes@southmail.example',
      lastOutcome: 'Second access point recommended', lastResolved: 'Apr 02, 2026',
      repeatRate: '1 of 4 tickets'
    },
    {
      id: 'ISP-1003', name: 'Priya Nair', zone: 'East Region', plan: '100 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Nokia G-140W-C (managed)',
      router: 'ISP-managed ONT', routerFw: '3.2.0', staticIp: false,
      status: 'escalated', issue: 'Intermittent total loss',
      currentMessage: 'We lose the whole connection two or three times a day.',
      channel: 'Phone', mins: 1580, openSinceMins: 1580, sla: 'Escalated — 32m to field window',
      priority: 'Critical', openTickets: 1, memories: 9, coverage: 'full',
      memberSince: 'Jun 2019', accountManager: 'R. Idris', email: 'p.nair@eastmail.example',
      lastOutcome: 'Escalated to fiber field team', lastResolved: 'Jan 19, 2026',
      repeatRate: '6 of 8 tickets'
    },
    {
      id: 'ISP-1004', name: 'Marcus Feld', zone: 'West Region', plan: '1 Gbps Fiber',
      connection: 'Fiber', access: 'XGS-PON', ont: 'Nokia G-2425G',
      router: 'Google Nest Wifi (6)', routerFw: '19012', staticIp: true,
      status: 'resolved', issue: 'Slow uploads',
      currentMessage: 'Uploads were crawling when I sent files off-site.',
      channel: 'Ticket', mins: 4320, openSinceMins: 4320, sla: 'Closed',
      priority: 'Medium', openTickets: 0, memories: 4, coverage: 'full',
      memberSince: 'Feb 2023', accountManager: 'L. Chen', email: 'm.feld@westmail.example',
      lastOutcome: 'Upstream profile corrected on ONT', lastResolved: 'Sep 21, 2026',
      repeatRate: '1 of 3 tickets'
    },
    {
      id: 'ISP-1005', name: 'Lena Hoffmann', zone: 'North Region', plan: '200 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Nokia G-140W-C',
      router: 'TP-Link Deco X60 (mesh)', routerFw: '3.1.4', staticIp: false,
      status: 'recurring', issue: 'Evening slowdown',
      currentMessage: 'Same as before — it slows down every evening around 8pm.',
      channel: 'Phone', mins: 1490, openSinceMins: 1490, sla: '1d 6h left',
      priority: 'High', openTickets: 2, memories: 8, coverage: 'full',
      memberSince: 'Aug 2020', accountManager: 'M. Okafor', email: 'l.hoffmann@northmail.example',
      lastOutcome: 'Temporary improvement after ONT reboot', lastResolved: 'Aug 30, 2026',
      repeatRate: '4 of 6 tickets'
    },
    {
      id: 'ISP-1006', name: 'Yusuf Karim', zone: 'South Region', plan: '150 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Nokia G-140W-C',
      router: 'Zyxel DX3301', routerFw: '1.0.0', staticIp: false,
      status: 'active', issue: 'Slow browsing at peak hours',
      currentMessage: 'Pages take forever to load in the evening.',
      channel: 'Chat', mins: 420, openSinceMins: 420, sla: '6h 10m left',
      priority: 'Medium', openTickets: 1, memories: 5, coverage: 'full',
      memberSince: 'Jan 2024', accountManager: 'S. Duarte', email: 'y.karim@southmail.example',
      lastOutcome: 'Peak-hour congestion confirmed on segment', lastResolved: 'Jun 14, 2026',
      repeatRate: '2 of 4 tickets'
    },
    {
      id: 'ISP-1007', name: 'Sofia Bianchi', zone: 'East Region', plan: '300 Mbps Fiber',
      connection: 'Fiber', access: 'XGS-PON', ont: 'Nokia G-2425G',
      router: 'Netgear N7800', routerFw: '1.1.0', staticIp: false,
      status: 'resolved', issue: 'Wi-Fi coverage in garden office',
      currentMessage: 'There is no signal in the garden office.',
      channel: 'Ticket', mins: 8640, openSinceMins: 8640, sla: 'Closed',
      priority: 'Low', openTickets: 0, memories: 3, coverage: 'full',
      memberSince: 'May 2021', accountManager: 'R. Idris', email: 's.bianchi@eastmail.example',
      lastOutcome: 'Range extender provisioned', lastResolved: 'Sep 19, 2026',
      repeatRate: '1 of 2 tickets'
    },
    {
      id: 'ISP-1008', name: 'Tom Whitfield', zone: 'West Region', plan: '200 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Nokia G-140W-C',
      router: 'Zyxel VMG8324 (static IP)', routerFw: '5.0.1', staticIp: true,
      status: 'active', issue: 'Latency spikes at peak hours',
      currentMessage: 'Latency spikes every time someone streams in the house.',
      channel: 'Phone', mins: 1440, openSinceMins: 1440, sla: '2d 4h left',
      priority: 'Low', openTickets: 1, memories: 3, coverage: 'full',
      memberSince: 'Sep 2023', accountManager: 'L. Chen', email: 't.whitfield@westmail.example',
      lastOutcome: 'Bufferbloat tuning applied', lastResolved: 'May 08, 2026',
      repeatRate: '1 of 3 tickets'
    },
    {
      id: 'ISP-1009', name: 'Aisha Bello', zone: 'North Region', plan: '100 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Nokia G-140W-C',
      router: 'ISP-managed ONT', routerFw: '2.9.8', staticIp: false,
      status: 'recurring', issue: 'Router reboots on its own',
      currentMessage: 'The router keeps rebooting by itself in the morning.',
      channel: 'Email', mins: 186, openSinceMins: 186, sla: '3h 45m left',
      priority: 'High', openTickets: 1, memories: 6, coverage: 'full',
      memberSince: 'Dec 2020', accountManager: 'M. Okafor', email: 'a.bello@northmail.example',
      lastOutcome: 'Firmware rollback, reboots returned', lastResolved: 'Aug 11, 2026',
      repeatRate: '4 of 5 tickets'
    },
    {
      id: 'ISP-1010', name: 'Chen Wei', zone: 'South Region', plan: '500 Mbps Fiber',
      connection: 'Fiber', access: 'XGS-PON', ont: 'Nokia G-2425G',
      router: 'ASUS RT-AX88U', routerFw: '386.19', staticIp: false,
      status: 'active', issue: 'Wired desktop slower than Wi-Fi',
      currentMessage: 'My wired desktop is slower than the laptop on Wi-Fi.',
      channel: 'Chat', mins: 545, openSinceMins: 545, sla: '9h 30m left',
      priority: 'Medium', openTickets: 1, memories: 4, coverage: 'full',
      memberSince: 'Apr 2022', accountManager: 'S. Duarte', email: 'c.wei@southmail.example',
      lastOutcome: 'NIC driver mismatch identified', lastResolved: 'Jul 29, 2026',
      repeatRate: '1 of 3 tickets'
    },
    {
      id: 'ISP-1011', name: 'Elena Petrova', zone: 'North Region', plan: '200 Mbps Fiber',
      connection: 'Fiber', access: 'GPON', ont: 'Installation pending',
      router: 'Not provisioned', routerFw: '—', staticIp: false,
      status: 'active', issue: 'Service move to new address',
      currentMessage: 'I would like to move my service to my new address.',
      channel: 'Phone', mins: 22, openSinceMins: 22, sla: '1d 22h left',
      priority: 'Low', openTickets: 1, memories: 0, coverage: 'none',
      memberSince: 'Sep 2026 (new)', accountManager: 'M. Okafor', email: 'e.petrova@northmail.example',
      lastOutcome: 'No prior support history', lastResolved: '—',
      repeatRate: '0 of 1 ticket'
    },
    {
      id: 'ISP-1012', name: 'Noah Lindgren', zone: 'East Region', plan: '300 Mbps Fiber',
      connection: 'Fiber', access: 'XGS-PON', ont: 'Nokia G-2425G',
      router: 'ISP-managed ONT', routerFw: '1.9.4', staticIp: false,
      status: 'active', issue: 'TV dropouts during prime time',
      currentMessage: 'The television keeps dropping out during the evening.',
      channel: 'Phone', mins: 41, openSinceMins: 41, sla: '5h 20m left',
      priority: 'Medium', openTickets: 1, memories: 2, coverage: 'partial',
      memorySyncIssue: true,
      memberSince: 'Jul 2022', accountManager: 'R. Idris', email: 'n.lindgren@eastmail.example',
      lastOutcome: 'IPTV multicast profile reset', lastResolved: 'Feb 17, 2026',
      repeatRate: '1 of 2 tickets'
    }
  ];

  // Resolve relative timestamps once, at load time.
  customers.forEach(function (c) {
    var last = new Date(Date.now() - (c.mins || 0) * 60000);
    c.lastInteraction = last.toISOString();
    c.openSince = new Date(Date.now() - (c.openSinceMins || 0) * 60000).toISOString();
  });

  var byId = {};
  customers.forEach(function (c) { byId[c.id] = c; });

  SIQ.data.customers = customers;
  SIQ.data.customer = function (id) { return byId[id] || null; };
  SIQ.data.customerCount = customers.length;
  SIQ.data.statusLabel = {
    active: 'Active', recurring: 'Recurring Issue', escalated: 'Escalated', resolved: 'Resolved'
  };
})(window.SIQ);
