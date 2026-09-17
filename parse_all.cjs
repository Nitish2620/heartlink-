const fs = require('fs');
const content = fs.readFileSync('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'utf8');
const returnIdx = content.indexOf('return (');
const jsxStr = content.substring(returnIdx + 8);

const lines = jsxStr.split('\n');
let depth = 0;
let divDepth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Count un-self-closed tags
  // Actually, just count <div> and </div>
  const divOpens = (line.match(/<div[ >]/g) || []).length;
  const divCloses = (line.match(/<\/div>/g) || []).length;
  
  const mDivOpens = (line.match(/<motion\.div[ >]/g) || []).length;
  const mDivCloses = (line.match(/<\/motion\.div>/g) || []).length;

  divDepth += (divOpens - divCloses + mDivOpens - mDivCloses);
  
  if (divDepth < 0) {
    console.log(\`Error at line \${returnIdx + i}: depth \${divDepth}, line: \${line.trim()}\`);
    break;
  }
}
console.log('Final depth:', divDepth);
