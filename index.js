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

    await page.waitForSelector('.round-history span', { timeout: 10000 });

    const multipliers = await page.$$eval('.round-history span', spans =>
      spans.map(el => el.textContent.trim()).filter(text => text.includes('x'))
    );

    latestCrash = multipliers.length > 0 ? multipliers[0] : "Error";
    console.log("Crash detected:", latestCrash);
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
