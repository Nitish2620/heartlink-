const fs = require('fs');
const path = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove the broken block at the end
const brokenBlockRegex = /\{\/\* V3 Design Tokens & A11y \*\/\}.*?<\/div>\s*\)\}/s;
code = code.replace(brokenBlockRegex, '');

// 2. Insert the V3 Design Tokens block in the right place
const correctInsertionPoint = `
              </div>
`;

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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
`;

// Find `              </div>\n            </motion.div>\n          )}\n        </AnimatePresence>\n      </div>` and replace it
const replaceTargetRegex = /              <\/div>\n            <\/motion\.div>\n          \)}\n        <\/AnimatePresence>\n      <\/div>/s;
code = code.replace(replaceTargetRegex, extraControls);

fs.writeFileSync(path, code);
console.log("Fix script executed");
