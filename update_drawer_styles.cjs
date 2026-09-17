const fs = require('fs');
let content = fs.readFileSync('registry/default/blocks/chat-list-card/chat-list-card.tsx', 'utf8');

// 1. Fix the drawer positioning to be a fixed floating panel
content = content.replace(
  /className="absolute top-0 -right-\[424px\] w-\[400px\] shrink-0 p-5/g,
  'className="fixed top-6 right-6 bottom-6 w-[400px] p-6'
);

content = content.replace(
  /shadow-\[0_8px_32px_rgba\(0,0,0,0\.08\)\] space-y-4 z-50 h-\[760px\] overflow-y-auto hidden xl:block"/g,
  'shadow-2xl space-y-5 z-[100] overflow-y-auto hidden xl:block"'
);

// 2. Fix the selection border flashing.
// The user wants "dont flash border when user change custom color of target only show whites border"
// We remove ring-2 ring-white/60 and scale effects to make it a crisp solid white border like Figma/Webflow.
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 shadow-2xl scale-\[1\.002\] transition-all duration-150 z-20'/g, "'border-[3px] border-white shadow-2xl z-20 transition-none'");
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 shadow-2xl scale-\[1\.005\] z-30'/g, "'border-[3px] border-white shadow-2xl z-30 transition-none'");
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 scale-105 shadow-md z-30'/g, "'border-[3px] border-white shadow-md z-30 transition-none'");
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 shadow-xl scale-\[1\.01\] z-30'/g, "'border-[3px] border-white shadow-xl z-30 transition-none'");
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 shadow-md scale-105 z-30'/g, "'border-[3px] border-white shadow-md z-30 transition-none'");
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 shadow-xl scale-\[1\.01\] z-30 p-2 rounded-2xl'/g, "'border-[3px] border-white shadow-xl z-30 p-2 rounded-2xl transition-none'");
content = content.replace(/'border-2 border-white ring-2 ring-white\/60 scale-110 shadow-xl z-30'/g, "'border-[3px] border-white shadow-xl z-30 transition-none'");

fs.writeFileSync('registry/default/blocks/chat-list-card/chat-list-card.tsx', content);
console.log('Styles updated.');
