import re
with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'r') as f:
    text = f.read()

jsx_str = text.split('return (')[1]
lines = jsx_str.split('\n')

div_depth = 0
for i, line in enumerate(lines):
    div_opens = len(re.findall(r'<div[ >]', line))
    div_closes = len(re.findall(r'</div>', line))
    m_opens = len(re.findall(r'<motion\.div[ >]', line))
    m_closes = len(re.findall(r'</motion\.div>', line))
    
    div_depth += (div_opens - div_closes + m_opens - m_closes)
    
    if div_depth < 0:
        print(f"Error at line offset {i+1}: depth {div_depth}, line: {line.strip()}")
        break

print("Final depth:", div_depth)
