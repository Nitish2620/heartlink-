import json
import sys

transcript_path = "/home/nitishyadav/.gemini/antigravity/brain/6f5ef8aa-f057-4d6b-b81d-7e0c6384e487/.system_generated/logs/transcript_full.jsonl"
target_file = "/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/chat-list-card.tsx"

content = ""

# We will look for the last time the file was fully written, or we will apply the edits manually?
# It's better to just extract the file state if it's stored in a view_file response, or write_to_file call.
# Since we might not have a full file snapshot, we can look for the last view_file output.
for line in open(transcript_path, 'r'):
    try:
        step = json.loads(line)
        if step.get("type") == "PLANNER_RESPONSE":
            for call in step.get("tool_calls", []):
                if call["function"]["name"] == "default_api:write_to_file":
                    args = json.loads(call["function"]["arguments"])
                    if args.get("TargetFile") == target_file:
                        content = args.get("CodeContent", "")
    except Exception as e:
        pass

print("Found content length:", len(content))
if content:
    with open("recovered_chat_list.tsx", "w") as f:
        f.write(content)
        
