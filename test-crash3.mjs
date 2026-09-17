import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.error('PAGE_ERROR:', err.toString());
  });

  try {
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle2' });
    const editor = await page.$('div[contenteditable="true"]');
    if (editor) {
      await editor.type('hello 😂', { delay: 50 });
      console.log("Typed emoji successfully!");
      // press enter
      await page.keyboard.press('Enter');
      console.log("Pressed enter!");
    }
    
    await new Promise(r => setTimeout(r, 1000));
    
  } catch (err) {
    console.error("SCRIPT_ERROR", err);
  } finally {
    await browser.close();
  }
})();
