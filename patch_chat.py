import re

with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'r') as f:
    text = f.read()

with open('registry/default/blocks/chat-list-card/right-side-snippet.tsx', 'r') as f:
    snippet = f.read()

# We want to extract the INNER content of the right-side-snippet
# snippet starts with:
# {/* Right Side: Active Messenger Thread Card */}
# <div className="lg:col-span-7 ...">
#   {selectedChat ? ( ...
# We want everything starting from {selectedChat ? (
start_inner = snippet.find('{selectedChat ? (')
inner_content = snippet[start_inner:]
# It might end with some extra divs, let's strip whitespace
inner_content = inner_content.strip()

# Now we find where to inject it in chat-list-card.tsx
# In chat-list-card.tsx, we have:
#       <DecorationPickerModal ... />
#     
#       </div>
# 
# 
#  {/* Nitro Subscription Tier Upgrade Modal */}
# We want to inject `inner_content` right after that `</div>` and BEFORE `{/* Nitro Subscription Tier Upgrade Modal */}`
# Also we must close the lg:col-span-7 div and the grid div!

marker = '      </div>\n\n\n {/* Nitro Subscription Tier Upgrade Modal */}'
injection = f"""      </div>

{inner_content}

 {{/* Nitro Subscription Tier Upgrade Modal */}}"""

if ' {/* Nitro Subscription Tier Upgrade Modal */}' in text:
    new_text = text.replace('      </div>\n\n\n {/* Nitro Subscription Tier Upgrade Modal */}', injection)
    # Wait, the inner_content already contains the closing divs! 
    # Let's check inner_content's end.
    if new_text != text:
        with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'w') as out:
            out.write(new_text)
        print('Patched successfully!')
    else:
        # try regex
        new_text = re.sub(r'      </div>\s*\{\/\* Nitro Subscription Tier Upgrade Modal \*\/\}', injection, text, flags=re.MULTILINE)
        with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'w') as out:
            out.write(new_text)
        print('Patched successfully via regex!')
else:
    print('Marker not found')
