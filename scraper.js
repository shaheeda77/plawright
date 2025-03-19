const { chromium } = require('playwright');
const fs = require('fs');

const SESSION_FILE = 'session.json';

(async () => {
    const browser = await chromium.launch({ headless: false });
    let context;

    if (fs.existsSync(SESSION_FILE)) {
        console.log("✅ Using existing session.");
        context = await browser.newContext({ storageState: SESSION_FILE });
    } else {
        console.log("🔐 No session found. Logging in...");
        context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://hiring.idenhq.com/'); // Login page URL

        await page.fill('#email', 'Shaeeda.kasim@cmr.edu.in');
        await page.fill('#password', '8i6IJrYZ');
        await page.click('button[type="submit"]');

        // ✅ Directly navigate to the product table page instead of waiting for dashboard
        await page.waitForNavigation({ waitUntil: 'networkidle' }); // Ensures login is complete
        await context.storageState({ path: SESSION_FILE });
    }

    const page = await context.newPage();
    await page.goto('https://hiring.idenhq.com/challenge'); // 🔹 Replace with actual product table URL

    console.log("✅ Successfully reached product table page.");

    // ✅ Step 5: Extract product data (same as before)
    let products = [];

    while (true) {
        const pageProducts = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.rounded-lg.border.bg-card')).map(card => ({
                id: card.querySelector('.flex.items-center.justify-between.font-mono span.font-medium')?.innerText.trim(),
                weight: card.querySelectorAll('.flex.items-center.justify-between span.font-medium.truncate.max-w-[100px]')[0]?.innerText.trim(),
                category: card.querySelectorAll('.flex.items-center.justify-between span.font-medium.truncate.max-w-[100px]')[1]?.innerText.trim(),
                color: card.querySelectorAll('.flex.items-center.justify-between span.font-medium.truncate.max-w-[100px]')[2]?.innerText.trim(),
            }));
        });

        products = products.concat(pageProducts);

        const nextButton = await page.$('button#next-page:not([disabled])');
        if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(2000);
        } else {
            break;
        }
    }

    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

    console.log(`✅ Extracted ${products.length} products and saved to products.json.`);
    await browser.close();
})();
