const fs = require('fs');
const file = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = ` Wand2
} from 'lucide-react';`;
const newStr = ` Wand2,
 Undo2,
 MoonStar,
 Code
} from 'lucide-react';`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(file, content);
console.log('Imports updated.');
