const fs = require('fs');
const file = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let content = fs.readFileSync(file, 'utf8');

// We are going to replace everything from '// Business Logic: Contrast Checker'
// down to the end of 'handleHexInputChange'
const startMarker = '// Business Logic: Contrast Checker (Luminance based)';
const endMarker = 'const handleHexInputChange ='; // Wait, it's safer to find exactly the block.

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf('};\n', content.indexOf(endMarker)) + 3;

if (startIdx === -1 || endIdx < startIdx) {
  console.log('Failed to find markers', startIdx, endIdx);
  process.exit(1);
}

const newLogic = `
  // --- MNC-GRADE BUSINESS LOGIC ENGINE ---

  // 1. History / Undo Stack
  const [history, setHistory] = useState<CustomThemeColors[]>([]);
  const applyColorUpdate = useCallback((newColors: CustomThemeColors) => {
    setHistory(prev => {
      const nextHistory = [...prev, customColors];
      return nextHistory.length > 15 ? nextHistory.slice(nextHistory.length - 15) : nextHistory;
    });
    setCustomColors(newColors);
    setUiTheme('custom');
  }, [customColors]);

  const undoColorChange = useCallback(() => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory(prev => prev.slice(0, prev.length - 1));
      setCustomColors(previousState);
    }
  }, [history]);

  // 2. Comprehensive Contrast Validation (WCAG AA standard 4.5:1)
  const getLuminance = (hex: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return 1;
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
    const [lR, lG, lB] = [r, g, b].map(c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lR + 0.7152 * lG + 0.0722 * lB;
  };

  const getContrastRatio = (color1: string, color2: string) => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrastWarnings = useMemo(() => {
    const warnings: string[] = [];
    const checks = [
      { name: 'Canvas Text', c1: customColors.textColor, c2: customColors.canvasBg },
      { name: 'Incoming Msg', c1: customColors.incomingTextColor, c2: customColors.incomingBubble },
      { name: 'Outgoing Msg', c1: customColors.outgoingTextColor, c2: customColors.outgoingBubble }
    ];
    for (const {name, c1, c2} of checks) {
      const ratio = getContrastRatio(c1, c2);
      if (ratio < 4.5) {
        warnings.push(\`\${name} contrast (\${ratio.toFixed(1)}:1) fails WCAG AA.\`);
      }
    }
    return warnings;
  }, [customColors]);

  // 3. Algorithmic Theme Generation (Smart Auto-Mix HSL Engine)
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return \`#\${f(0)}\${f(8)}\${f(4)}\`.toUpperCase();
  };

  const hexToHsl = (hex: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return {h:0, s:0, l:100};
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const applySmartAutoMix = () => {
    const baseHue = Math.floor(Math.random() * 360);
    const compHue = (baseHue + 180) % 360; // Complementary
    const analogHue = (baseHue + 30) % 360;
    const isDarkBase = Math.random() > 0.7; // 30% chance for a dark theme

    if (isDarkBase) {
      applyColorUpdate({
        canvasBg: hslToHex(baseHue, 15, 10),
        sidebarBg: hslToHex(baseHue, 12, 12),
        chatHeaderBg: hslToHex(baseHue, 12, 12),
        chatInputBg: hslToHex(baseHue, 20, 15),
        primaryAction: hslToHex(compHue, 80, 60),
        accentHighlight: hslToHex(analogHue, 70, 50),
        incomingBubble: hslToHex(baseHue, 25, 18),
        incomingTextColor: hslToHex(baseHue, 10, 90),
        outgoingBubble: hslToHex(compHue, 60, 40),
        outgoingTextColor: '#FFFFFF',
        activeRowBg: hslToHex(baseHue, 30, 16),
        textColor: hslToHex(baseHue, 10, 90),
        borderColor: hslToHex(baseHue, 20, 20),
      });
    } else {
      applyColorUpdate({
        canvasBg: hslToHex(baseHue, 20, 97),
        sidebarBg: hslToHex(baseHue, 15, 99),
        chatHeaderBg: hslToHex(baseHue, 15, 99),
        chatInputBg: hslToHex(baseHue, 25, 94),
        primaryAction: hslToHex(compHue, 80, 50),
        accentHighlight: hslToHex(analogHue, 90, 60),
        incomingBubble: hslToHex(baseHue, 30, 94),
        incomingTextColor: hslToHex(baseHue, 50, 15),
        outgoingBubble: hslToHex(compHue, 70, 55),
        outgoingTextColor: '#FFFFFF',
        activeRowBg: hslToHex(baseHue, 40, 92),
        textColor: hslToHex(baseHue, 40, 20),
        borderColor: hslToHex(baseHue, 20, 85),
      });
    }
  };

  const flipToDarkMode = () => {
    const darkColors: any = {};
    for (const [key, hex] of Object.entries(customColors)) {
      const { h, s, l } = hexToHsl(hex as string);
      let newL = 100 - l;
      if (newL < 10) newL = 10;
      if (newL > 95) newL = 95;
      darkColors[key] = hslToHex(h, s, newL);
    }
    applyColorUpdate(darkColors);
  };
`;

content = content.substring(0, startIdx) + newLogic + content.substring(endIdx);
fs.writeFileSync(file, content);
console.log('Inserted deep business logic successfully.');
