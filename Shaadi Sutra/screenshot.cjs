const { chromium } = require('playwright');
const path = require('path');

(async () => {
    try {
        console.log('Launching browser...');
        // Explicitly set executable path if needed, but playwright should find it
        const browser = await chromium.launch();
        const page = await browser.newPage();
        console.log('Navigating to localhost:3000...');
        await page.goto('http://localhost:3000');

        // waiting for some content to ensure it's loaded
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(__dirname, 'screenshot.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to ${screenshotPath}`);
        await browser.close();
    } catch (error) {
        console.error('Error taking screenshot:', error);
        process.exit(1);
    }
})();
