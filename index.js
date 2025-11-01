const scrapeCrash = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://games.africabet.com/LaunchG', { waitUntil: 'networkidle2' });

    // Wait for any span to load — fallback strategy
    await page.waitForSelector('span', { timeout: 10000 });

    // Extract all span texts that look like multipliers
    const multipliers = await page.$$eval('span', spans =>
      spans.map(el => el.textContent.trim()).filter(text => /^\d+\.\d+x$/.test(text))
    );

    latestCrash = multipliers.length > 0 ? multipliers[0] : "Error";
    console.log("Crash detected:", latestCrash);
    await browser.close();
  } catch (err) {
    console.error("Scrape error:", err.message);
    latestCrash = "Error";
  }
};
