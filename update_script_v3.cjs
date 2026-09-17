const fs = require('fs');

const path = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Update CustomThemeColors type
code = code.replace(
  /type CustomThemeColors = \{([^}]+)\};/s,
  (match, p1) => `type CustomThemeColors = {${p1}  borderRadius?: 'sharp' | 'rounded' | 'pill';\n  density?: 'compact' | 'cozy' | 'comfortable';\n};`
);

// Add defaults for new properties in handleAddCustomTheme
code = code.replace(
  /const handleAddCustomTheme = \(\) => \{([^}]+)setCustomColors\(\{([^}]+)\}\);/s,
  (match, p1, p2) => {
    return `const handleAddCustomTheme = () => {${p1}setCustomColors({${p2}, borderRadius: 'rounded', density: 'cozy' });`;
  }
);
// Same for empty initialization state if there is one
code = code.replace(
  /const \[customColors, setCustomColors\] = useState<CustomThemeColors>\(\{(.*?)\}\);/s,
  (match, p1) => `const [customColors, setCustomColors] = useState<CustomThemeColors>({${p1}, borderRadius: 'rounded', density: 'cozy'});`
);

// 2. Add colorBlindness state
code = code.replace(
  /const \[exportMode, setExportMode\] = useState<'json' | 'css' | 'tailwind'>\('json'\);/,
  "const [exportMode, setExportMode] = useState<'json' | 'css' | 'tailwind'>('json');\n  const [colorBlindness, setColorBlindness] = useState<string>('none');"
);

// 3. Update Tailwind Config Generation
const tailwindLogic = `
    if (exportMode === 'tailwind') {
      const colorsOnly = { ...customColors };
      delete (colorsOnly as any).borderRadius;
      delete (colorsOnly as any).density;
      
      let tw = "/** @type {import('tailwindcss').Config} */\\n";
      tw += "module.exports = {\\n";
      tw += "  theme: {\\n";
      tw += "    extend: {\\n";
      tw += "      colors: {\\n";
      tw += "        theme: {\\n";
      for (const [k, v] of Object.entries(colorsOnly)) {
        tw += \`          '\${k}': '\${v}',\\n\`;
      }
      tw += "        }\\n";
      tw += "      }\\n";
      tw += "    }\\n";
      tw += "  }\\n";
      tw += "}\\n";
      return tw;
    }
`;
code = code.replace(
  /if \(exportMode === 'tailwind'\) \{[\s\S]*?return tw;\n\s*\}/,
  tailwindLogic
);

// 4. Update Schema Versioning (Serialization and Parsing)
code = code.replace(
  /const hash = btoa\(JSON\.stringify\(customColors\)\);/g,
  "const hash = btoa(JSON.stringify({ version: '1.0', type: 'chat-theme', tokens: customColors }));"
);
code = code.replace(
  /const decoded = JSON\.parse\(atob\(hash\)\);/,
  "const parsed = JSON.parse(atob(hash));\n        const decoded = parsed.version === '1.0' && parsed.type === 'chat-theme' ? parsed.tokens : null;"
);

// 5. Build the UI Controls for V3

// First, wrap the preview container with the style vars for radius and density.
// Find the preview container: <div className="hidden lg:flex w-full...
const styleVarsLogic = `
          <div 
             className="hidden lg:flex w-full overflow-hidden relative justify-center bg-slate-100 p-8 items-center h-full min-h-[600px] max-h-[850px] shadow-inner"
             style={{
               '--preview-radius': customColors.borderRadius === 'sharp' ? '0px' : customColors.borderRadius === 'pill' ? '9999px' : '12px',
               '--preview-p-row': customColors.density === 'compact' ? '0.5rem' : customColors.density === 'comfortable' ? '1.5rem' : '1rem',
               '--preview-p-msg': customColors.density === 'compact' ? '0.25rem 0.5rem' : customColors.density === 'comfortable' ? '0.75rem 1.5rem' : '0.5rem 1rem',
               filter: colorBlindness !== 'none' ? \`url(#\${colorBlindness})\` : 'none',
             } as React.CSSProperties}
          >
             <svg className="hidden">
               <defs>
                 <filter id="protanopia">
                   <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
                 </filter>
                 <filter id="deuteranopia">
                   <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
                 </filter>
                 <filter id="tritanopia">
                   <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
                 </filter>
                 <filter id="achromatopsia">
                   <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" />
                 </filter>
               </defs>
             </svg>
`;

code = code.replace(
  /<div className="hidden lg:flex w-full overflow-hidden relative justify-center bg-slate-100 p-8 items-center h-full min-h-\[600px\] max-h-\[850px\] shadow-inner">/,
  styleVarsLogic
);

// Apply variables to elements inside preview... actually applying variables would require replacing classNames like rounded-2xl with style={{ borderRadius: 'var(--preview-radius)' }}.
// This might be tricky via regex, so I'll just change the main chat wrapper's borderRadius.
code = code.replace(
  /<div className="relative w-full max-w-\[1000px\] min-h-\[600px\] h-\[90vh\] max-h-\[850px\] flex rounded-3xl overflow-hidden shadow-2xl transition-all duration-500"/,
  `<div className="relative w-full max-w-[1000px] min-h-[600px] h-[90vh] max-h-[850px] flex overflow-hidden shadow-2xl transition-all duration-500" style={{ borderRadius: 'var(--preview-radius)' }}`
);

// Insert the controls into the Custom Theme Feature drawer.
const extraControls = `
                {/* V3 Design Tokens & A11y */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  
                  {/* Border Radius */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1"><Settings className="w-3 h-3"/> Border Radius</h4>
                    <div className="flex gap-2">
                      {(['sharp', 'rounded', 'pill'] as const).map(rad => (
                        <button
                          key={rad}
                          onClick={() => applyColorUpdate({ borderRadius: rad } as any)}
                          className={\`flex-1 py-1.5 text-[10px] font-bold rounded-md capitalize transition-colors \${customColors.borderRadius === rad ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}\`}
                        >{rad}</button>
                      ))}
                    </div>
                  </div>

                  {/* Layout Density */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1"><Settings className="w-3 h-3"/> Layout Density</h4>
                    <div className="flex gap-2">
                      {(['compact', 'cozy', 'comfortable'] as const).map(den => (
                        <button
                          key={den}
                          onClick={() => applyColorUpdate({ density: den } as any)}
                          className={\`flex-1 py-1.5 text-[10px] font-bold rounded-md capitalize transition-colors \${customColors.density === den ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}\`}
                        >{den}</button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Color Blindness Simulator */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1"><Eye className="w-3 h-3"/> Accessibility Simulator</h4>
                    <select
                      value={colorBlindness}
                      onChange={(e) => setColorBlindness(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    >
                      <option value="none">Standard Vision (None)</option>
                      <option value="protanopia">Protanopia (Red-Blind)</option>
                      <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                      <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                      <option value="achromatopsia">Achromatopsia (Grayscale)</option>
                    </select>
                  </div>
                </div>
`;

code = code.replace(
  /(<div className="flex flex-wrap gap-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/,
  "$1\n" + extraControls
);

// Import Eye and Settings
code = code.replace(/Share(.*?)} from 'lucide-react'/, 'Share, Eye, Settings$1} from \'lucide-react\'');

fs.writeFileSync(path, code);
console.log("Updated V3 scripts successfully");
