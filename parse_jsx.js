const fs = require('fs');
const parser = require('@babel/parser');

const code = fs.readFileSync('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'utf-8');

try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log('No syntax errors!');
} catch (e) {
  console.error('Syntax error at line', e.loc.line, 'column', e.loc.column);
  console.error(e.message);
}
