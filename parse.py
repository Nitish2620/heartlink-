import re
with open('update_drawer_ui.cjs', 'r') as f:
    text = f.read()
drawer = text.split("const newDrawer = `{")[1].split("}`")[0]

depth = 0
for i, line in enumerate(drawer.split('\n')):
    opens = len(re.findall(r'<div[ >]', line))
    closes = len(re.findall(r'</div>', line))
    m_opens = len(re.findall(r'<motion\.div[ >]', line))
    m_closes = len(re.findall(r'</motion\.div>', line))
    
    depth += (opens - closes + m_opens - m_closes)
    if opens or closes or m_opens or m_closes:
        print(f"Line {i+1} [Depth: {depth}]: {line.strip()}")
