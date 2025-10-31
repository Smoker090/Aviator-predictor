const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const express = require('express');
const cors = require('cors');
const app = express();

puppeteer.use(StealthPlugin());
app.use(cors());

let latestCrash = "Loading...";

const scrapeCrash = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://games.africabet.com/LaunchG', { waitUntil: 'networkidle2' });

    await page.waitForSelector('.multiplier', { timeout: 10000 });
    const crash = await page.$eval('.multiplier', el => el.textContent.trim());

    latestCrash = crash;
    console.log("Scraped crash:", crash);
    await browser.close();
  } catch (err) {
    console.error("Scrape error:", err.message);
    latestCrash = "Error";
  }
};

setInterval(scrapeCrash, 30000);

app.get('/', (req, res) => {
  res.json({ crashPoint: latestCrash });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('MR CRUSHER backend running...');
});
