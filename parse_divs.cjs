const fs = require('fs');
const content = fs.readFileSync('update_drawer_ui.cjs', 'utf8');

const regexOpen = /<div[ >]/g;
const regexClose = /<\/div>/g;

const drawerStrMatch = content.match(/const newDrawer = `([\s\S]+?)`;/);
if (!drawerStrMatch) {
  console.log('could not find drawer str');
  process.exit(1);
}

const str = drawerStrMatch[1];
const lines = str.split('\n');

let depth = 0;
for (let i=0; i<lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(regexOpen) || []).length;
  const closes = (line.match(regexClose) || []).length;
  
  if (opens > 0 || closes > 0) {
    depth += (opens - closes);
    console.log(\`Line \${i+1} [\${depth}]: \${line.trim()}\`);
  }
}
