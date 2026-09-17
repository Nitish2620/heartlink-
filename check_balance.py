import re

with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'r') as f:
    text = f.read()

# very naive tag counter
tags = re.findall(r'<\/?([a-zA-Z0-9]+)[^>]*>', text)
stack = []
for tag in tags:
    if not tag.startswith('/'):
        # ignore self-closing by checking the text directly
        pass

