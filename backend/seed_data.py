from backend.memory import remember_interaction


customer_id = "ISP-1001"


interactions = [
    """
Customer profile:
Name: Rahul Kumar
Plan: Fiber 200 Mbps
Router: TP-Link Archer
Connection type: Fiber
Environment: Home Wi-Fi

The customer reported slow internet during evening hours.
A speed test showed approximately 45 Mbps instead of the
expected 200 Mbps.
The customer restarted the router.
Result: speed temporarily improved but became slow again.
""",

    """
Support ticket:
Issue: Internet disconnecting every evening.

Troubleshooting:
Router was restarted.
Result: Problem returned after approximately 2 hours.

Conclusion:
Router restart did not permanently solve the issue.
""",

    """
Support ticket:
Issue: Slow speed and intermittent disconnections.

Action:
Router firmware was updated.

Result:
Internet performance improved for approximately 3 days,
but the same problem returned.

Important:
Firmware update provided only a temporary improvement.
""",

    """
Support ticket:
Issue: Customer reports that the same evening connectivity
problem has happened multiple times.

Previous solutions attempted:
1. Router restart - failed to permanently resolve issue.
2. Router firmware update - temporary improvement only.

Recommendation:
Do not repeatedly ask the customer to restart the router.
Consider checking line stability, connection quality,
and network-side issues.

Escalation:
If the issue continues after network diagnostics,
escalate to the network support team.
"""
]


for interaction in interactions:
    remember_interaction(customer_id, interaction)

print("ISP demo customer history stored successfully.")
