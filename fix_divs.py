import subprocess

def check_build():
    res = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
    return res.returncode, res.stdout + res.stderr

with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'r') as f:
    text = f.read()

# Replace the last `</div>\n );` with `</div></div></div>\n );`
new_text = text.replace('  </div>\n  );\n}', '      </div>\n    </div>\n  </div>\n  );\n}')

with open('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'w') as f:
    f.write(new_text)

