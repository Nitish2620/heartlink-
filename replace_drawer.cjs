const fs = require('fs');
const file = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let content = fs.readFileSync(file, 'utf8');

const drawerStart = content.indexOf('{/* Live Color Customizer Side Panel */}');
const drawerEnd = content.indexOf('</AnimatePresence>', drawerStart) + '</AnimatePresence>'.length;

const newDrawer = `{/* Live Color Customizer Side Panel */}
        <AnimatePresence>
          {showColorCustomizer && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="absolute top-0 -right-[424px] w-[400px] shrink-0 p-5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] space-y-5 z-50 h-[760px] overflow-y-auto hidden xl:block"
            >
              {/* Drawer Header */}
              <div className="flex flex-col pb-4 border-b border-slate-200/60 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-purple-100 rounded-xl shadow-sm border border-purple-200/50">
                      <Palette className="w-4.5 h-4.5 text-purple-600" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-900 tracking-tight">Theme Builder</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowColorCustomizer(false)}
                    className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100/80 text-slate-500 px-2.5 py-1 rounded-md font-bold tracking-wide uppercase border border-slate-200/50">
                    13-Slot Granular Control
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(JSON.stringify(customColors, null, 2));
                          showToast('Theme JSON copied to clipboard! 📋');
                        }
                      }}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer border border-slate-200 shadow-sm"
                    >
                      Copy JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomColors(PRESET_PALETTES[0].colors);
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

              {/* Quick Presets Bar */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Instant Presets</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PALETTES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setCustomColors(preset.colors);
                        setUiTheme('custom');
                        showToast(\`Applied preset: \${preset.name}\`);
                      }}
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition cursor-pointer flex items-center gap-2 border border-slate-200 hover:border-purple-300 shadow-sm group"
                    >
                      <span className="flex items-center -space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm z-20" style={{ backgroundColor: preset.colors.canvasBg }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm z-10" style={{ backgroundColor: preset.colors.primaryAction }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm z-0" style={{ backgroundColor: preset.colors.outgoingBubble }} />
                      </span>
                      <span>{preset.name.replace(/🎨 |🔥 |✨ |🌊 |🌿 |🔮 /, '')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Target Inspector Guidance Banner */}
              <div className={\`p-3 rounded-2xl border transition-all duration-300 flex flex-col gap-2.5 text-xs shadow-sm \${
                hoveredSlot
                  ? 'bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200 text-purple-900'
                  : 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-200 text-slate-600'
              }\`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{hoveredSlot ? '🎯' : '💡'}</span>
                    <span className="font-bold">
                      {hoveredSlot ? \`Targeting Slot:\` : 'Visual Inspector Guidance'}
                    </span>
                  </div>
                  {hoveredSlot && (
                    <span className="text-[9px] font-mono bg-purple-200/60 border border-purple-300 text-purple-800 px-2 py-0.5 rounded-full font-bold uppercase shrink-0 shadow-sm">
                      {hoveredSlot}
                    </span>
                  )}
                </div>
                <div className={\`font-medium \${hoveredSlot ? 'opacity-100' : 'opacity-80'}\`}>
                  {hoveredSlot
                    ? SLOT_METADATA.find(s => s.key === hoveredSlot)?.label + ': ' + SLOT_METADATA.find(s => s.key === hoveredSlot)?.description
                    : 'Hover over any color slot below to visually highlight its target region on the live card!'}
                </div>
              </div>

              {/* Categorized Slot Pickers Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
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
                      <div className="flex items-center justify-between gap-1 mb-2.5">
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
                              setCustomColors(prev => ({ ...prev, [slot.key]: e.target.value }));
                              setUiTheme('custom');
                            }}
                            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={currentColor}
                          onChange={(e) => {
                            setCustomColors(prev => ({ ...prev, [slot.key]: e.target.value }));
                            setUiTheme('custom');
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

content = content.substring(0, drawerStart) + newDrawer + content.substring(drawerEnd);
fs.writeFileSync(file, content);
console.log('Successfully updated drawer UI to MNC grade');
