const fs = require('fs');

const path = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add backgroundKey to SLOT_METADATA
code = code.replace(
  /{ key: 'textColor', label: 'Headings & Text', category: 'Typography', description: 'Contact names and main titles', icon: '✏️' }/,
  "{ key: 'textColor', label: 'Headings & Text', category: 'Typography', description: 'Contact names and main titles', icon: '✏️', backgroundKey: 'canvasBg' }"
);
code = code.replace(
  /{ key: 'incomingTextColor', label: 'In Bubble Text', category: 'Bubbles', description: 'Received message body text', icon: '💬' }/,
  "{ key: 'incomingTextColor', label: 'In Bubble Text', category: 'Bubbles', description: 'Received message body text', icon: '💬', backgroundKey: 'incomingBubble' }"
);
code = code.replace(
  /{ key: 'outgoingTextColor', label: 'Out Bubble Text', category: 'Bubbles', description: 'Sent message body text', icon: '✉️' }/,
  "{ key: 'outgoingTextColor', label: 'Out Bubble Text', category: 'Bubbles', description: 'Sent message body text', icon: '✉️', backgroundKey: 'outgoingBubble' }"
);
code = code.replace(
  /key: keyof CustomThemeColors;\n\s*label: string;\n\s*category: string;\n\s*description: string;\n\s*icon: string;/,
  "key: keyof CustomThemeColors;\n  label: string;\n  category: string;\n  description: string;\n  icon: string;\n  backgroundKey?: keyof CustomThemeColors;"
);

// 2. Add Smart Auto-Naming logic before `const handleSavePreset =`
const autoNameLogic = `
  const generateSmartName = (colors: CustomThemeColors) => {
    const { h, l } = hexToHsl(colors.primaryAction);
    const lightness = l < 30 ? "Midnight" : l > 70 ? "Daylight" : "Horizon";
    let hueName = "Slate";
    if (h >= 0 && h < 15) hueName = "Crimson";
    else if (h >= 15 && h < 45) hueName = "Sunset";
    else if (h >= 45 && h < 75) hueName = "Solar";
    else if (h >= 75 && h < 150) hueName = "Emerald";
    else if (h >= 150 && h < 210) hueName = "Cyan";
    else if (h >= 210 && h < 260) hueName = "Ocean";
    else if (h >= 260 && h < 310) hueName = "Amethyst";
    else if (h >= 310 && h < 345) hueName = "Sakura";
    else hueName = "Crimson";
    return \`\${hueName} \${lightness}\`;
  };
`;
code = code.replace('const handleSavePreset = () => {', autoNameLogic + '\n  const handleSavePreset = () => {');
code = code.replace(
  /const presetName = prompt\('Enter a name for this theme preset:', `Custom \$\{new Date\(\)\.toLocaleTimeString\(\)\}`\);/,
  "const presetName = prompt('Enter a name for this theme preset:', generateSmartName(customColors));"
);

// 3. Add Deep Linking Hash Parse in useEffect
const deepLinkEffect = `
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#theme=')) {
      try {
        const hash = window.location.hash.replace('#theme=', '');
        const decoded = JSON.parse(atob(hash));
        if (decoded && decoded.canvasBg) {
          setCustomColors(decoded);
          showToast('Loaded shared theme!');
        }
      } catch (e) {
        console.error('Failed to parse theme hash');
      }
    }
  }, []);
`;
code = code.replace('// Ref-tracked Timeout Safety', deepLinkEffect + '\n\n  // Ref-tracked Timeout Safety');

// 4. Update the save presets area to add a Share URL button
const shareBtnHtml = `
                    <button
                      type="button"
                      onClick={() => {
                        const hash = btoa(JSON.stringify(customColors));
                        const url = window.location.href.split('#')[0] + '#theme=' + hash;
                        navigator.clipboard.writeText(url);
                        showToast('Theme URL copied to clipboard!');
                      }}
                      className="text-[10px] flex items-center gap-1 font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Share className="w-3 h-3" /> Share URL
                    </button>
                    `;
code = code.replace(
  /(<button\n\s*type="button"\n\s*onClick=\{handleSavePreset\})/,
  shareBtnHtml + "\n                    $1"
);
// Import Share icon
code = code.replace('Download, Check', 'Download, Check, Share');


// 5. Update Color Picker loop to render WCAG badge
const wcagBadge = `
                      {slot.backgroundKey && (
                        <div className="mt-1 flex items-center gap-1">
                          {(() => {
                            const ratio = getContrastRatio(customColors[slot.key] as string, customColors[slot.backgroundKey as keyof CustomThemeColors] as string);
                            let badge = <span className="px-1 text-[8px] font-bold bg-red-100 text-red-600 rounded">FAIL</span>;
                            if (ratio >= 7) badge = <span className="px-1 text-[8px] font-bold bg-green-100 text-green-700 rounded">AAA</span>;
                            else if (ratio >= 4.5) badge = <span className="px-1 text-[8px] font-bold bg-blue-100 text-blue-700 rounded">AA</span>;
                            return (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[9px] text-slate-400">Contrast</span>
                                {badge}
                              </div>
                            );
                          })()}
                        </div>
                      )}
`;
code = code.replace(
  /(<div className="flex items-center gap-2 mt-1 relative">.*?<\/div>)/s,
  "$1\n" + wcagBadge
);
// Make sure it only replaces the FIRST occurrence of the div, which is inside the loop... wait, regex with g will replace all, but without g it replaces first. We have only one.
// Let's refine the replace to be safer.
const renderColorInput = `
                      <div className="flex items-center gap-2 mt-1 relative">
                        <div className="relative rounded-md overflow-hidden ring-1 ring-slate-200 shadow-sm shrink-0 w-6 h-6">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => applyColorUpdate({ [slot.key]: e.target.value })}
                            className="absolute inset-[-10px] w-12 h-12 cursor-pointer appearance-none p-0 border-0"
                          />
                        </div>
                        <input
                          type="text"
                          value={currentColor.toUpperCase()}
                          onChange={(e) => {
                             if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                               applyColorUpdate({ [slot.key]: e.target.value })
                             }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </div>
`;
code = code.replace(renderColorInput, renderColorInput + wcagBadge);


// 6. Fix applySmartAutoMix to use Monochromatic, Analogous, Triadic strategies
const strategies = `
  const applyAlgorithmicMix = (strategy: 'analogous' | 'triadic' | 'monochromatic') => {
    const baseHue = Math.floor(Math.random() * 360);
    const isDarkBase = Math.random() > 0.7; // 30% chance for a dark theme

    let pActionH = baseHue, pActionS = 80, pActionL = 60;
    let accentH = baseHue, accentS = 90, accentL = 60;
    
    if (strategy === 'triadic') {
      pActionH = (baseHue + 120) % 360;
      accentH = (baseHue + 240) % 360;
    } else if (strategy === 'analogous') {
      pActionH = (baseHue + 30) % 360;
      accentH = (baseHue - 30 + 360) % 360;
    } else if (strategy === 'monochromatic') {
      pActionH = baseHue;
      accentH = baseHue;
      pActionL = isDarkBase ? 70 : 30; // Contrast against base
      accentL = isDarkBase ? 60 : 40;
    }

    if (isDarkBase) {
      applyColorUpdate({
        canvasBg: hslToHex(baseHue, 15, 10),
        sidebarBg: hslToHex(baseHue, 12, 12),
        chatHeaderBg: hslToHex(baseHue, 12, 12),
        chatInputBg: hslToHex(baseHue, 20, 15),
        primaryAction: hslToHex(pActionH, pActionS, pActionL),
        accentHighlight: hslToHex(accentH, accentS, accentL),
        incomingBubble: hslToHex(baseHue, 25, 20),
        incomingTextColor: '#FFFFFF',
        outgoingBubble: hslToHex(pActionH, 50, 30),
        outgoingTextColor: '#FFFFFF',
        activeRowBg: hslToHex(baseHue, 25, 18),
        textColor: '#FFFFFF',
        borderColor: hslToHex(baseHue, 15, 25),
      });
    } else {
      applyColorUpdate({
        canvasBg: hslToHex(baseHue, 20, 97),
        sidebarBg: hslToHex(baseHue, 15, 99),
        chatHeaderBg: hslToHex(baseHue, 15, 99),
        chatInputBg: hslToHex(baseHue, 25, 94),
        primaryAction: hslToHex(pActionH, pActionS, pActionL),
        accentHighlight: hslToHex(accentH, accentS, accentL),
        incomingBubble: hslToHex(baseHue, 30, 94),
        incomingTextColor: hslToHex(baseHue, 50, 15),
        outgoingBubble: hslToHex(pActionH, 70, 55),
        outgoingTextColor: '#FFFFFF',
        activeRowBg: hslToHex(baseHue, 40, 92),
        textColor: hslToHex(baseHue, 40, 20),
        borderColor: hslToHex(baseHue, 20, 85),
      });
    }
  };
`;
// Replace the old applySmartAutoMix function completely
const applySmartAutoMixRegex = /const applySmartAutoMix = \(\) => \{[\s\S]*?(?=const flipToDarkMode = \(\) => \{)/;
code = code.replace(applySmartAutoMixRegex, strategies + '\n  ');

// Replace the single Auto-Mix button with three buttons
const mixButtonsHtml = `
                    <button
                       type="button"
                       onClick={() => applyAlgorithmicMix('analogous')}
                       className="text-[10px] flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md hover:bg-amber-100 transition-colors"
                     >
                       <Wand2 className="w-3 h-3" /> Analogous
                     </button>
                     <button
                       type="button"
                       onClick={() => applyAlgorithmicMix('triadic')}
                       className="text-[10px] flex items-center gap-1 font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-md hover:bg-pink-100 transition-colors"
                     >
                       <Wand2 className="w-3 h-3" /> Triadic
                     </button>
                     <button
                       type="button"
                       onClick={() => applyAlgorithmicMix('monochromatic')}
                       className="text-[10px] flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                     >
                       <Wand2 className="w-3 h-3" /> Mono
                     </button>
`;
code = code.replace(
  /<button\n\s*type="button"\n\s*onClick=\{applySmartAutoMix\}\n\s*className="text-\[10px\] flex items-center gap-1 font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors"\n\s*>\n\s*<Wand2 className="w-3 h-3" \/> Auto-Mix\n\s*<\/button>/,
  mixButtonsHtml
);


fs.writeFileSync(path, code);
console.log("Replaced successfully!");
