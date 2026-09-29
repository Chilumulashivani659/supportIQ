from hindsight_client import Hindsight

from backend.config import (
    HINDSIGHT_API_KEY,
    HINDSIGHT_BASE_URL,
    HINDSIGHT_BANK_ID,
)


hindsight = Hindsight(
    base_url=HINDSIGHT_BASE_URL,
    api_key=HINDSIGHT_API_KEY,
    timeout=60.0,
)


async def remember_interaction(customer_id, interaction):
    await hindsight.aretain(
        bank_id=HINDSIGHT_BANK_ID,
        content=f"""
ISP CUSTOMER ID: {customer_id}

{interaction}
""",
    )


async def recall_customer_history(customer_id, current_issue):
    result = await hindsight.arecall(
        bank_id=HINDSIGHT_BANK_ID,
        query=f"""
ISP CUSTOMER ID: {customer_id}

Current ISP issue:
{current_issue}

Retrieve relevant memories about this exact ISP customer.

Focus on:
- previous support tickets
- previous ISP problems
- recurring issues
- troubleshooting already attempted
- temporary or permanent outcomes
- previous recommendations
- recorded outcomes
- repeated failures
- time-of-day patterns

Return memories relevant to this customer.
""",
    )

    memories = []

    for memory in result.results:
        text = memory.text

        # Only keep memories that explicitly belong to this customer.
        if customer_id.lower() in text.lower():
            memories.append(text)

    return memories
async def close_hindsight():
    await hindsight.aclose()