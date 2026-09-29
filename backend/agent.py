import os
from dotenv import load_dotenv
from hindsight_client import Hindsight
from groq import Groq

load_dotenv()

# Hindsight
hindsight = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

BANK_ID = os.getenv("HINDSIGHT_BANK_ID")

# Groq
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "openai/gpt-oss-120b"


def recall_customer_history(customer_id, message):
    query = (
        f"Customer ID: {customer_id}. "
        f"What previous support issues, solutions, environment details, "
        f"preferences, and outcomes are relevant to this message: {message}"
    )

    result = hindsight.recall(
        bank_id=BANK_ID,
        query=query
    )

    memories = []

    for memory in result.results:
        memories.append(memory.text)

    return memories


def generate_response(customer_id, message):
    memories = recall_customer_history(customer_id, message)

    history = "\n".join(f"- {m}" for m in memories)

    if not history:
        history = "No previous customer history found."

    system_prompt = """
You are a professional customer support intelligence agent.

Your job is not just to answer questions.
Use the customer's previous history when it is relevant.

Rules:
1. Do not ask the customer to repeat information already known.
2. Do not blindly repeat a solution that previously failed.
3. Prefer solutions that worked previously when relevant.
4. Clearly distinguish known history from assumptions.
5. Recommend escalation when repeated attempts have failed.
6. Be helpful, concise, and professional.
"""

    user_prompt = f"""
Customer ID: {customer_id}

Relevant customer history:
{history}

Current customer message:
{message}

Give the best support response based on the current issue and the customer's history.
"""

    response = groq.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    answer = response.choices[0].message.content

    # Store this new interaction in Hindsight
    hindsight.retain(
        bank_id=BANK_ID,
        content=(
            f"Customer ID: {customer_id}\n"
            f"Customer message: {message}\n"
            f"Support response: {answer}"
        ),
        context="customer support interaction"
    )

    return answer


if __name__ == "__main__":
    customer_id = "CUST-001"

    print("Customer Support Agent")
    print("Type 'exit' to stop.\n")

    while True:
        message = input("Customer: ")

        if message.lower() == "exit":
            break

        try:
            answer = generate_response(customer_id, message)

            print("\nAgent:")
            print(answer)
            print()

        except Exception as e:
            print(f"\nError: {e}\n")