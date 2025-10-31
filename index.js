const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

let latestCrash = "Loading...";

const scrapeCrash = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://games.africabet.com/LaunchG', { waitUntil: 'networkidle2' });

    await page.waitForSelector('.multiplier'); // Confirm selector via Inspect
    const crash = await page.$eval('.multiplier', el => el.textContent.trim());

    latestCrash = crash;
    await browser.close();
  } catch (err) {
    console.error('Scrape error:', err);
  }
};

setInterval(scrapeCrash, 30000);

app.get('/', (req, res) => {
  res.json({ crashPoint: latestCrash });
});

app.listen(process.env.PORT || 3000);
