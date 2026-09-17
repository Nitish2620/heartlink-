const fs = require('fs');
const file = 'registry/default/blocks/chat-list-card/chat-list-card.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_list_card_custom_colors', JSON.stringify(customColors));
    }
  }, [customColors]);`;

const insertStr = `
  const [mySavedThemes, setMySavedThemes] = useState<{name: string, colors: CustomThemeColors}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_list_card_my_themes');
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_list_card_my_themes', JSON.stringify(mySavedThemes));
    }
  }, [mySavedThemes]);

  // Business Logic: Contrast Checker (Luminance based)
  const getLuminance = (hex: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return 1; // Default fallback
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
  
  const hasContrastWarning = useMemo(() => {
    const ratio = getContrastRatio(customColors.textColor, customColors.canvasBg);
    return ratio < 4.5;
  }, [customColors]);
  
  const handleHexInputChange = (key: keyof CustomThemeColors, value: string) => {
    // Only apply if it's a valid hex
    if (/^#[0-9A-Fa-f]{3,6}$/i.test(value)) {
      // Normalize to 6 chars
      let hex = value;
      if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
      }
      if (hex.length === 7) {
        setCustomColors(prev => ({ ...prev, [key]: hex }));
        setUiTheme('custom');
      }
    }
  };
`;

content = content.replace(targetStr, targetStr + '\n' + insertStr);
fs.writeFileSync(file, content);
console.log('Inserted logic successfully.');
