const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'registry/default/blocks/heartlink/heartlink-app.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

// The import looks like:
// import type { 
//   ChatItem, 
//   ChatListCardProps, 
//   ...
// } from './types';

appCode = appCode.replace(/import type \{\s*ChatItem,/g, "import type {\n  SpeedDiscoveryProfile,\n  ChatItem,");

fs.writeFileSync(appPath, appCode);
console.log("Added SpeedDiscoveryProfile to imports");
