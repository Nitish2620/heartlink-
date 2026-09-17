const fs = require('fs');
const path = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let code = fs.readFileSync(path, 'utf8');

const brokenRegex = / <\/div>\n <\/div>\n\n                \n\n \{\/\* New Chat Modal \*\/\}/s;
code = code.replace(brokenRegex, ' </div>\n </div>\n )}\n\n {/* New Chat Modal */}');

fs.writeFileSync(path, code);
console.log("Fix script 2 executed");
