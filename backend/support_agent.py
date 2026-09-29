from groq import Groq

from backend.config import GROQ_API_KEY, GROQ_MODEL
from backend.memory import recall_customer_history


groq = Groq(api_key=GROQ_API_KEY)


async def analyze_customer_issue(customer_id, current_issue):

    history = await recall_customer_history(customer_id, current_issue)

    history_text = "\n\n".join(history)

    prompt = f"""
You are an ISP Customer Support Intelligence Agent.

Your job is to analyze the customer's CURRENT issue using
relevant information remembered from their PREVIOUS history.

CUSTOMER ID:
{customer_id}

CURRENT ISSUE:
{current_issue}

PREVIOUS CUSTOMER HISTORY:
{history_text}

IMPORTANT MEMORY-BASED DECISION RULES:

1. The customer's previous history is important evidence.
   Use it to make the CURRENT recommendation more specific.

2. Look for:
   - recurring problems
   - repeated tickets
   - previous troubleshooting attempts
   - temporary fixes
   - recorded outcomes
   - previous recommendations
   - patterns such as time of day

3. Do NOT treat the current issue as a completely new issue
   when relevant previous history exists.

4. If a troubleshooting step previously produced only a
   temporary improvement, do NOT recommend repeating the
   same step as the primary solution unless there is a clear
   reason to do so.

5. If the history contains a previous recommendation and the
   same problem has returned, use that recommendation as
   context for the next step.

6. If the outcome of a previous recommendation is unknown,
   NEVER claim that it was completed, failed, or succeeded.
   Instead use cautious language such as:
   - "review the previously recommended..."
   - "confirm whether the previously recommended..."
   - "consider proceeding with the previously recommended..."

7. If the history shows that several temporary fixes have
   already been tried, prefer a more appropriate next-level
   action instead of repeating another temporary fix.

8. If a diagnostic has NOT been recorded as previously
   performed, it may be recommended when it is relevant to
   the current problem.

9. Do not invent:
   - tests
   - diagnostic results
   - technician visits
   - network actions
   - customer actions
   - router details
   - ONT details
   - dates
   - outcomes

10. Never claim that you or the support team performed an action.

11. Clearly distinguish between:
   - what has already happened
   - what is recommended next

12. The recommendation must be based on the strongest relevant
   evidence in the customer's history, not a generic ISP script.

13. Do not display the customer's full history.

14. Do not list all previous troubleshooting attempts.

15. Do not expose internal reasoning.

16. Keep the response concise and customer-friendly.

17. CUSTOMER RESPONSE must describe a recommendation only.
   It must NOT claim that an action has already been performed.

18. Do not use:
   - "I will..."
   - "I can arrange..."
   - "We will..."
   - "We'll..."
   - "I have..."
   - "We have..."
   - "We performed..."
   - "We ran..."

19. Prefer wording such as:
   - "We recommend..."
   - "The next step is..."
   - "The next step would be..."
   - "Consider..."
   - "We recommend reviewing..."

RETURN EXACTLY THIS FORMAT:

ISSUE:
<one short sentence describing the customer's current issue>

RECOMMENDED ACTION:
<one clear, specific next step that uses the customer's relevant history>

CUSTOMER RESPONSE:
<one short natural customer-facing response describing the recommendation>

FINAL CHECK BEFORE ANSWERING:

- Is the recommendation actually influenced by the previous history?
- Did I avoid repeating a previously temporary troubleshooting step?
- Did I avoid claiming an unknown recommendation was completed?
- Did I avoid inventing any action or result?
- Did I return ONLY ISSUE, RECOMMENDED ACTION, and CUSTOMER RESPONSE?
"""

    response = groq.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a careful ISP support intelligence agent. "
                    "Use customer history to make recommendations specific "
                    "and contextual. Never invent facts or claim an action "
                    "was performed."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
    )

    result = response.choices[0].message.content

    return result