const fs = require('fs');
let code = fs.readFileSync('/home/nitishyadav/.gemini/antigravity/brain/6f5ef8aa-f057-4d6b-b81d-7e0c6384e487/task.md', 'utf8');

code = code.replace(
  /- \[ \] \*\*Algorithmic Color Harmony Engine\*\*\n  - \[ \] Implement HSL manipulation utilities \(`hexToHSL`, `hslToHex`\)\.\n  - \[ \] Replace random `Auto-Mix` with a proper HSL-based palette generator \(Triadic\/Analogous\)\./,
  "- [x] **Algorithmic Color Harmony Engine**\n  - [x] Implement HSL manipulation utilities (`hexToHSL`, `hslToHex`).\n  - [x] Replace random `Auto-Mix` with a proper HSL-based palette generator (Triadic/Analogous/Mono)."
);
code = code.replace(
  /- \[ \] \*\*WCAG AA\/AAA Live Ratings\*\*\n  - \[ \] Add WCAG Badges \(`AA`, `AAA`, `FAIL`\) next to color pickers in the visual inspector\.\n  - \[ \] Ensure Badges dynamically calculate contrast against their logical background \(e\.g\., text vs canvas\)\./,
  "- [x] **WCAG AA/AAA Live Ratings**\n  - [x] Add WCAG Badges (`AA`, `AAA`, `FAIL`) next to color pickers in the visual inspector.\n  - [x] Ensure Badges dynamically calculate contrast against their logical background (e.g., text vs canvas)."
);
code = code.replace(
  /- \[ \] \*\*Shareable Theme Serialization\*\*\n  - \[ \] Implement `btoa\(JSON\.stringify\(\)\)` encoding for themes\.\n  - \[ \] Add a "Share Theme" button that copies the pseudo URL\./,
  "- [x] **Shareable Theme Serialization**\n  - [x] Implement `btoa(JSON.stringify())` encoding for themes.\n  - [x] Add a \"Share Theme\" button that copies the pseudo URL."
);
code = code.replace(
  /- \[ \] \*\*Smart Auto-Naming\*\*\n  - \[ \] Create a heuristic function that maps `primaryAction` hues\/lightness to cool names\.\n  - \[ \] Apply the auto-name when saving to presets\./,
  "- [x] **Smart Auto-Naming**\n  - [x] Create a heuristic function that maps `primaryAction` hues/lightness to cool names.\n  - [x] Apply the auto-name when saving to presets."
);
code = code.replace(
  /- \[ \] \*\*CSS Variable Real-time Injection Mode\*\*\n  - \[ \] Show CSS Variables format in the Export Code window\./,
  "- [x] **CSS Variable Real-time Injection Mode**\n  - [x] Show CSS Variables format in the Export Code window (Verified already implemented)."
);
fs.writeFileSync('/home/nitishyadav/.gemini/antigravity/brain/6f5ef8aa-f057-4d6b-b81d-7e0c6384e487/task.md', code);
