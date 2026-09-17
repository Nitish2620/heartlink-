const fs = require('fs');
const file = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let content = fs.readFileSync(file, 'utf8');

// The export logic was inserted inside JSX, right before '{/* Live Color Customizer Side Panel */}'
const exportLogicBlock = `
  const [exportMode, setExportMode] = useState<'json' | 'css' | 'tailwind'>('json');
  
  const generateExportString = useCallback(() => {
    if (exportMode === 'json') return JSON.stringify(customColors, null, 2);
    if (exportMode === 'css') {
      let css = ':root {\\n';
      for (const [k, v] of Object.entries(customColors)) {
        css += \`  --theme-\${k.replace(/([A-Z])/g, "-$1").toLowerCase()}: \${v};\\n\`;
      }
      css += '}';
      return css;
    }
    if (exportMode === 'tailwind') {
       let tw = 'colors: {\\n  theme: {\\n';
       for (const [k, v] of Object.entries(customColors)) {
        tw += \`    '\${k}': '\${v}',\\n\`;
      }
      tw += '  }\\n}';
      return tw;
    }
    return '';
  }, [exportMode, customColors]);

`;

// Remove the block from the JSX part
content = content.replace(exportLogicBlock, '');

// Insert it at the end of the state declarations, let's just append it after 'flipToDarkMode'
const flipToDarkModeEnd = 'applyColorUpdate(darkColors);\n  };';
const insertionPoint = content.indexOf(flipToDarkModeEnd);

if (insertionPoint !== -1) {
   content = content.substring(0, insertionPoint + flipToDarkModeEnd.length) + '\n' + exportLogicBlock + content.substring(insertionPoint + flipToDarkModeEnd.length);
} else {
   console.log('Could not find flipToDarkModeEnd');
}

fs.writeFileSync(file, content);
console.log('Fix applied.');
