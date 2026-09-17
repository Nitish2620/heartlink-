const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'registry/default/blocks/heartlink/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix imports
  code = code.replace(/from '\.\.\/chat-list-card\/types'/g, "from '../types'");
  code = code.replace(/from '\.\.\/types'/g, "from '../types'");
  code = code.replace(/from '\.\.\/chat-list-card'/g, "from '../types'");
  // For SpeedDiscoveryProfile which might be imported from chat-list-card directly
  
  fs.writeFileSync(filePath, code);
}

const appPath = path.join(__dirname, 'registry/default/blocks/heartlink/heartlink-app.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');
appCode = appCode.replace(/import type { SpeedDiscoveryProfile } from '\.\/chat-list-card';/g, ""); // Remove if present
// Fix missing handler types
appCode = appCode.replace(/onSelectPrompt=\{\(promptText\)/g, "onSelectPrompt={(promptText: string)");
appCode = appCode.replace(/onStartChat=\{\(profile\)/g, "onStartChat={(profile: any)");
appCode = appCode.replace(/onSendDateInvite=\{\(inviteText\)/g, "onSendDateInvite={(inviteText: string)");
appCode = appCode.replace(/onSendGroupInvite=\{\(inviteMessage\)/g, "onSendGroupInvite={(inviteMessage: string)");
fs.writeFileSync(appPath, appCode);

console.log("Fixed component imports and missing types.");
