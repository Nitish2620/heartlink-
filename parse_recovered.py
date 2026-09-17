import re
import json
import codecs

log_path = '/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/recovered.txt'
with open(log_path, 'r') as f:
    text = f.read()

try:
    data = json.loads(text)
    if 'tool_calls' in data:
        for tc in data['tool_calls']:
            if tc['name'] == 'write_to_file' and 'CodeContent' in tc.get('args', {}):
                with open('/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/clean-chat-list-card.tsx', 'w') as out:
                    out.write(tc['args']['CodeContent'])
                exit(0)
except:
    pass

text = codecs.decode(text.encode('utf-8'), 'unicode_escape')
matches = re.findall(r'```tsx\n(.*?)\n```', text, re.DOTALL)
if matches:
    with open('/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/clean-chat-list-card.tsx', 'w') as out:
        out.write(matches[-1])
else:
    match = re.search(r'"CodeContent"\\?\s*:\s*"(.*?)"', text, re.DOTALL)
    if match:
        code = match.group(1).encode('utf-8').decode('unicode_escape')
        with open('/home/nitishyadav/.gemini/antigravity/scratch/standalone-apps/chats-list-card/registry/default/blocks/chat-list-card/clean-chat-list-card.tsx', 'w') as out:
            out.write(code)

