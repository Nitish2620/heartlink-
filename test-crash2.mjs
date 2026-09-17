import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.error('PAGE_ERROR:', err.toString());
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE_ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle2' });
    console.log("Page loaded");
    
    // Test 1: Type in ChatInputEditor
    console.log("Testing ChatInputEditor...");
    const editor = await page.$('div[contenteditable="true"]');
    if (editor) {
      await editor.type('hello world', { delay: 50 });
      console.log("Typed in ChatInputEditor successfully!");
    } else {
      console.log("ChatInputEditor not found");
    }

    // Test 2: Type in NewChatModalDialog
    console.log("Testing NewChatModalDialog...");
    // Find button to open modal (usually has a Plus icon or something)
    // We'll just click all buttons
    const buttons = await page.$$('button');
    for (let btn of buttons) {
      await btn.click().catch(() => {});
      await new Promise(r => setTimeout(r, 100)); // wait for dialog
      const input = await page.$('input[placeholder="e.g. Sarah Jenkins"]');
      if (input) {
        console.log("Found modal! Typing...");
        await input.type('test name', { delay: 50 });
        console.log("Typed successfully!");
        break;
      }
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
  } catch (err) {
    console.error("SCRIPT_ERROR", err);
  } finally {
    await browser.close();
  }
})();
