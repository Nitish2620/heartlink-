const fs = require('fs');
const path = require('path');

const typesPath = path.join(__dirname, 'registry/default/blocks/heartlink/types.ts');
let typesCode = fs.readFileSync(typesPath, 'utf8');

const speedProfileDef = `

export interface SpeedDiscoveryProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  avatar: string;
  bio: string;
  promptQuestion: string;
  promptAnswer: string;
  matchScore: number;
  intent: 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun';
}
`;

if (!typesCode.includes('export interface SpeedDiscoveryProfile')) {
  typesCode += speedProfileDef;
  fs.writeFileSync(typesPath, typesCode);
}

const appPath = path.join(__dirname, 'registry/default/blocks/heartlink/heartlink-app.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

appCode = appCode.replace(/import \{ VirtualizedMessageStream \} from '.\/virtualized-message-stream';/g, "import { VirtualizedMessageStream } from './heartlink-message-stream';");

// Remove SpeedDiscoveryProfile definition from heartlink-app.tsx
appCode = appCode.replace(/export interface SpeedDiscoveryProfile \{[\s\S]*?\n\}\n/m, "");

fs.writeFileSync(appPath, appCode);

console.log("Fixed types and imports");
