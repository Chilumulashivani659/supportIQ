from backend.memory import recall_customer_history


customer_id = "ISP-1001"

issue = "My internet is slow again every evening."

memories = recall_customer_history(customer_id, issue)

print()
print("==========================================")
print("RAW HINDSIGHT MEMORIES")
print("==========================================")

if not memories:
    print("NO MEMORIES FOUND")

for i, memory in enumerate(memories, start=1):
    print()
    print(f"========== MEMORY {i} ==========")
    print(memory)

print()
print("==========================================")
print(f"TOTAL MEMORIES: {len(memories)}")
print("==========================================")