import { existsSync } from "fs";
import { Logger } from "./logger";
import chromium from "@sparticuz/chromium-min";

const logger = new Logger("puppeteerSetup");

export const getPuppeteerOptions = async () => {
  if (process.env.NODE_ENV === "development") {
    // Try different possible Chrome/Chromium paths
    const possiblePaths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // System Chrome
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/opt/homebrew/bin/chromium",
      "/usr/bin/google-chrome",
    ];

    logger.info(
      `Checking for browser installations in ${possiblePaths.length} possible locations`
    );
    const chromePath = possiblePaths.find(path => {
      const exists = existsSync(path);
      logger.debug(
        `Checking path: ${path} - ${exists ? "Found" : "Not found"}`
      );
      if (exists) {
        logger.info(`Found browser at: ${path}`);
      }
      return exists;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const launchOptions: any = {
      headless: "new", // Use new headless mode
      timeout: 60000, // Increase timeout to 60 seconds
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
      ],
    };

    if (chromePath) {
      logger.info(`Using browser at path: ${chromePath}`);
      launchOptions.executablePath = chromePath;
    } else {
      logger.info("Using bundled Chromium");
    }

    logger.info(
      "Returning launch options:",
      JSON.stringify(launchOptions, null, 2)
    );

    return launchOptions;
  } else {
    logger.info("Getting executable path for chromium in production");
    const executablePath = await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar`
    );

    logger.info("Launching puppeteer-core browser on production");
    return {
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
        "--disable-font-subpixel-positioning",
        "--disable-font-antialiasing",
        "--no-first-run",
        "--disable-features=site-per-process",
        "--disable-features=IsolateOrigins",
        "--disable-features=site-isolation",
        "--force-color-profile=srgb",
        "--disable-remote-fonts",
        "--disable-features=FontAccess",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreDefaultArgs: ["--disable-extensions"],
    };
  }
};
