const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
//nkln
//jkn

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async (openseaUrl, totalTokens) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    );

    // const context = await browser.createIncognitoBrowserContext();
    // const page = await context.newPage();

    await page.goto(openseaUrl);
    console.log("page opened");

    const threeDotElementSelector =
      ".sc-b0f989b5-0.sc-95996c10-0.bnHJzG.jLnBvM.material-icons-outlined";
    // ".sc-2f8f3753-0 sc-ca43447a-0 jqAQZk eVgtyW material-icons-outlined";

    const refreshElementSelector = "text/Refresh metadata";

    for (let i = 0; i < totalTokens; i++) {
      const newTab = await browser.newPage();
      const collectionUrl = page.url().split("/").slice(0, -1).join("/") + "/";
      const nextUrl = collectionUrl + i;
      // await newTab.setUserAgent(
      //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
      // );

      // await newTab.setExtraHTTPHeaders({
      //   "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      // });
      await newTab.setBypassCSP(true);
      await newTab.goto(nextUrl);
      await delay(1500);

      const threeDotElement = await newTab.waitForSelector(
        threeDotElementSelector
      );
      await threeDotElement.click();
      const refreshElement = await newTab.waitForSelector(
        refreshElementSelector
      );
      await refreshElement.click();
      console.log("refreshed for tokenId:", i);
      await delay(1500);
      await threeDotElement.dispose();
      await refreshElement.dispose();
      await newTab.close();
    }

    await browser.close();
  } catch (err) {
    console.log("err is jns", err);
  }
})(
  "https://opensea.io/assets/matic/0x362ba4dff07e64d3b582dd8ba19fe0c2c5be87dd/0",
  98
);
