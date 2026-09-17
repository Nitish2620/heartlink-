import fs from 'fs';

const logFile = '/home/nitishyadav/.gemini/antigravity/brain/6f5ef8aa-f057-4d6b-b81d-7e0c6384e487/.system_generated/tasks/task-15570.log';

function checkLog() {
  if (fs.existsSync(logFile)) {
    console.log(fs.readFileSync(logFile, 'utf8'));
  } else {
    setTimeout(checkLog, 1000);
  }
}
checkLog();
