import json

log_path = '/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/recovered.txt'
with open(log_path, 'r') as f:
    text = f.read()

# text is something like:
# {"step_index":864,"source":"MODEL","type":"PLANNER_RESPONSE","status":"DONE","created_at":"...","content":"...","tool_calls":[{"name":"write_to_file","args":{"CodeContent":"import React..."}}]}
# or similar, where it is a json string that contains the actual log entry.
try:
    data = json.loads(text)
    if 'tool_calls' in data:
        for tc in data['tool_calls']:
            if tc['name'] == 'write_to_file' and 'CodeContent' in tc.get('args', {}):
                with open('/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/clean-chat-list-card.tsx', 'w') as out:
                    out.write(tc['args']['CodeContent'])
                exit(0)
except Exception as e:
    print(e)
