const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'registry/default/blocks/chat-list-card/chat-list-card.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for DecorationPickerModal
if (!content.includes('import { DecorationPickerModal }')) {
  // Find the last import
  const importsEnd = content.lastIndexOf('import ');
  const nextLineEnd = content.indexOf('\n', importsEnd);
  content = content.slice(0, nextLineEnd + 1) + "import { DecorationPickerModal } from './decoration-picker-modal';\n" + content.slice(nextLineEnd + 1);
}

// 2. Remove AVAILABLE_DECORATIONS array definition since it's now exported from decoration-picker-modal.tsx
const availableDecorationsStart = content.indexOf('const AVAILABLE_DECORATIONS = [');
if (availableDecorationsStart !== -1) {
  const availableDecorationsEnd = content.indexOf('];', availableDecorationsStart) + 2;
  content = content.slice(0, availableDecorationsStart) + content.slice(availableDecorationsEnd);
}

// 3. Remove hoveredSlot state
content = content.replace(/const \[hoveredSlot, setHoveredSlot\] = useState<string \| null>\(null\);\s*/, '');

// 4. Remove the inline modal and replace with <DecorationPickerModal />
const animatePresenceStart = content.indexOf('<AnimatePresence>');
if (animatePresenceStart !== -1) {
  const animatePresenceEnd = content.lastIndexOf('</AnimatePresence>') + 18;
  const modalCode = content.slice(animatePresenceStart, animatePresenceEnd);
  
  if (modalCode.includes('Shop Decorations')) {
    const newModalCall = `
      <DecorationPickerModal 
        isOpen={showDecorationPicker}
        onClose={() => setShowDecorationPicker(false)}
        selectedChat={selectedChatForDecoration}
        tier={tier}
        onSubscriptionChange={setTier}
        onApplyDecoration={applyDecoration}
      />
    `;
    content = content.slice(0, animatePresenceStart) + newModalCall + content.slice(animatePresenceEnd);
  }
}

fs.writeFileSync(filePath, content);
