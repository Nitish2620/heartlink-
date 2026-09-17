import re
with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'r') as f:
    text = f.read()
start = text.find('Live Color Customizer')
end = text.find('</AnimatePresence>', start)
drawer = text[start:end+18]

# strip all curly brace expressions roughly by just replacing `{...}` if we could, but let's just use a better regex
tags = re.finditer(r'<(/?[a-zA-Z]+[a-zA-Z0-9\.]*)([^>]*?)>', drawer)
stack = []
for m in tags:
    tag = m.group(1)
    attrs = m.group(2)
    # ignore if this looks like a generic type or arrow function
    if tag == 'span' and attrs.startswith(' className="w-px h-5 bg-slate-200 mx-1" /'):
        continue
    
    if attrs.endswith('/'): # self closing
        continue
        
    # check for manual self closing cases where `/` has space before `>`
    if attrs.strip().endswith('/'):
        continue

    if tag.startswith('/'):
        if not stack:
            print(f"Error: closing {tag} without opening at pos {m.start()}")
        else:
            top = stack.pop()
            if top != tag[1:]:
                print(f"Error: mismatch! {top} closed by {tag} around {drawer[m.start()-30:m.start()+30]}")
    else:
        stack.append(tag)

if stack:
    print(f"Unclosed tags: {stack}")
else:
    print("All tags matched perfectly!")
