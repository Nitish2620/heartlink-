const fs = require('fs');
const file = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let content = fs.readFileSync(file, 'utf8');

// First, inject the Export State logic right before the drawer
const exportLogic = `
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

const drawerStartMarker = '{/* Live Color Customizer Side Panel */}';
const drawerStartIdx = content.indexOf(drawerStartMarker);
if (drawerStartIdx === -1) process.exit(1);

const drawerEndMarker = '</AnimatePresence>';
const drawerEndIdx = content.indexOf(drawerEndMarker, drawerStartIdx) + drawerEndMarker.length;

const newDrawer = `{/* Live Color Customizer Side Panel */}
        <AnimatePresence>
          {showColorCustomizer && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute top-0 -right-[424px] w-[400px] shrink-0 p-5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] space-y-4 z-50 h-[760px] overflow-y-auto hidden xl:block"
            >
              {/* Drawer Header */}
              <div className="flex flex-col pb-3 border-b border-slate-200/60 gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-purple-100 rounded-xl shadow-sm border border-purple-200/50">
                      <Palette className="w-4.5 h-4.5 text-purple-600" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900 tracking-tight">Theme Engine</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={history.length === 0}
                      onClick={undoColorChange}
                      className="text-slate-400 hover:text-purple-600 disabled:opacity-30 hover:bg-purple-50 p-1.5 rounded-full transition cursor-pointer"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowColorCustomizer(false)}
                      className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100/80 text-slate-500 px-2.5 py-1 rounded-md font-bold tracking-wide uppercase border border-slate-200/50">
                    WCAG AAA Grade
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const newName = prompt('Enter a name for your custom preset:');
                        if (newName) {
                           setMySavedThemes(prev => [...prev, { name: newName, colors: customColors }]);
                           showToast('Saved to My Themes!');
                        }
                      }}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition cursor-pointer border border-green-200/60 shadow-sm flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        applyColorUpdate(PRESET_PALETTES[0].colors);
                        setUiTheme('artchat_creative');
                        showToast('Reset to default');
                      }}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer border border-rose-200/60 shadow-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Export */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Export Format</span>
                   <div className="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded-md">
                     {(['json', 'css', 'tailwind'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setExportMode(mode)}
                          className={\`text-[9px] font-bold px-2 py-1 rounded \${exportMode === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                        >
                          {mode.toUpperCase()}
                        </button>
                     ))}
                   </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(generateExportString());
                      showToast(\`Copied \${exportMode.toUpperCase()} to clipboard!\`);
                    }
                  }}
                  className="w-full py-1.5 flex justify-center items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition shadow-sm"
                >
                  <Code className="w-3 h-3" /> Copy Generated Code
                </button>
              </div>

              {/* Contrast Warning Banner */}
              <AnimatePresence>
                {contrastWarnings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
                      <TriangleAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[11px] font-bold text-amber-900 leading-tight">WCAG Low Contrast</h4>
                        <ul className="text-[9.5px] text-amber-700/90 mt-1 space-y-0.5 leading-snug list-disc pl-3">
                          {contrastWarnings.map((warn, i) => (
                            <li key={i}>{warn}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Presets Bar */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Theme Presets</span>
                   <div className="flex items-center gap-1">
                     <button
                       type="button"
                       onClick={flipToDarkMode}
                       className="text-[10px] flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                     >
                       <MoonStar className="w-3 h-3" /> Invert
                     </button>
                     <button
                       type="button"
                       onClick={applySmartAutoMix}
                       className="text-[10px] flex items-center gap-1 font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors"
                     >
                       <Wand2 className="w-3 h-3" /> Auto-Mix
                     </button>
                   </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[...mySavedThemes, ...PRESET_PALETTES].map((preset, idx) => {
                    const isMyTheme = idx < mySavedThemes.length;
                    return (
                      <button
                        key={preset.name + idx}
                        type="button"
                        onClick={() => applyColorUpdate(preset.colors)}
                        className={\`px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-2 border shadow-sm group \${
                           isMyTheme 
                             ? 'bg-blue-50/50 hover:bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-300' 
                             : 'bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 hover:border-purple-300'
                        }\`}
                      >
                        <span className="flex items-center -space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm z-20" style={{ backgroundColor: preset.colors.canvasBg }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm z-10" style={{ backgroundColor: preset.colors.primaryAction }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm z-0" style={{ backgroundColor: preset.colors.outgoingBubble }} />
                        </span>
                        <span>{preset.name.replace(/🎨 |🔥 |✨ |🌊 |🌿 |🔮 /, '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categorized Slot Pickers Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {SLOT_METADATA.map((slot) => {
                  const currentColor = customColors[slot.key] || '#ffffff';
                  const isHovered = hoveredSlot === slot.key;
                  return (
                    <div
                      key={slot.key}
                      onMouseEnter={() => setHoveredSlot(slot.key)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      className={\`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group \${
                        isHovered
                          ? 'bg-purple-50/90 border-purple-300 shadow-md ring-4 ring-purple-50 scale-[1.02] z-10 relative'
                          : 'bg-white/60 border-slate-200 hover:bg-white shadow-sm hover:shadow hover:border-slate-300'
                      }\`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={\`text-[10px] font-bold truncate flex items-center gap-1.5 \${isHovered ? 'text-purple-700' : 'text-slate-600'}\`}>
                          <span className={isHovered ? 'opacity-100' : 'opacity-60'}>{slot.icon}</span>
                          <span className="truncate tracking-wide">{slot.label}</span>
                        </span>
                      </div>
                      <div className={\`flex items-center gap-2 p-1.5 rounded-xl border shadow-xs transition-colors \${isHovered ? 'bg-white border-purple-200' : 'bg-slate-50 border-slate-200 group-hover:border-slate-300 group-hover:bg-white'}\`}>
                        <div className="relative w-5 h-5 shrink-0 rounded-md shadow-sm border border-black/10 overflow-hidden">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => {
                              applyColorUpdate({ ...customColors, [slot.key]: e.target.value });
                            }}
                            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                             // Temporarily update just this string, the CSS handles invalid hex gracefully
                             setCustomColors(prev => ({ ...prev, [slot.key]: e.target.value }));
                             setUiTheme('custom');
                          }}
                          onBlur={(e) => {
                             // On blur we can push to history if it's a valid hex
                             if (/^#[0-9A-Fa-f]{3,6}$/i.test(e.target.value)) {
                                applyColorUpdate({ ...customColors, [slot.key]: e.target.value });
                             }
                          }}
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none text-slate-600 group-hover:text-slate-900 transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>`;

content = content.substring(0, drawerStartIdx) + exportLogic + newDrawer + content.substring(drawerEndIdx);
fs.writeFileSync(file, content);
console.log('Successfully applied MNC grade UI logic.');
