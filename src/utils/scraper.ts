import { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";
import { Logger } from "./logger";
import { Browser as CoreBrowser } from "puppeteer-core";
import { getPuppeteerOptions } from "./puppeteerSetup";

const logger = new Logger("scraper");

// Function to clean text content
function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
}

export interface ScrapedContent {
  url: string;
  title: string;
  headings: {
    h1: string;
    h2: string;
  };
  metaDescription: string;
  content: string;
  error: string | null;
  cachedAt?: number;
}

// Function to scrape content from a URL using Puppeteer + Cheerio
export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  try {
    // Check cache first
    logger.info(`Starting scrape process for: ${url}`);

    let browser: Browser | CoreBrowser | null = null;
    try {
      logger.info("Launching puppeteer browser");

      if (process.env.NODE_ENV === "development") {
        logger.info("Launching puppeteer browser on development");
        const puppeteer = await import("puppeteer");

        const launchOptions = await getPuppeteerOptions();
        logger.info("Launching puppeteer browser on development");
        browser = await puppeteer.launch(launchOptions);
        logger.info("Browser launched successfully");
      } else {
        logger.info("Launching puppeteer-core browser on production");
        const puppeteer = await import("puppeteer-core");

        // Log version information
        logger.info(`Node version: ${process.version}`);

        logger.info("Getting puppeteer options on production");
        const launchOptions = await getPuppeteerOptions();
        logger.info("Launching puppeteer-core browser on production");
        browser = await puppeteer.launch(launchOptions);
      }

      const page = (await browser.newPage()) as Page;

      await page.goto(url, { waitUntil: "networkidle2" });

      // 4. Extract the entire page content (including dynamically loaded content)
      await autoScroll(page);

      const fullContent = await page.content();

      logger.info(`Full content: ${fullContent}`);

      const title = await page
        .$eval("title", el => el.textContent || "")
        .catch(() => "");
      const h1 = await page
        .$eval("h1", el => el.textContent || "")
        .catch(() => "");
      const h2 = await page
        .$eval("h2", el => el.textContent || "")
        .catch(() => "");
      const metaDescription = await page
        .$eval(
          'meta[name="description"]',
          el => el.getAttribute("content") || ""
        )
        .catch(() => "");

      return {
        url,
        title: cleanText(title),
        headings: {
          h1: cleanText(h1),
          h2: cleanText(h2),
        },
        metaDescription: cleanText(metaDescription),
        content: cleanText(fullContent),
        error: null,
      };
    } catch (error) {
      logger.error(`Error during scraping: ${error}`);
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  } catch (error) {
    logger.error(`Error scraping ${url}: ${error}`);
    return {
      url,
      title: "",
      headings: { h1: "", h2: "" },
      metaDescription: "",
      content: "",
      error: `Failed to scrape URL: ${(error as Error).message || "Unknown error"}`,
    };
  }
}

// Helper function to scroll page and trigger lazy loading
async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
