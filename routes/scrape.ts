import express, { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer";

let router = express.Router();
router.get(
  "/:query",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.params.query;

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      // Navigate to Google
      await page.goto("https://www.google.com");

      // Enter the query in the search input and submit the form
      const textareaElement: any = await page.$("textarea.gLFyf");
      console.log(textareaElement, "textarea");
      await textareaElement.type(query);
      await page.keyboard.press("Enter");

      // Wait for the search results to load
      await page.waitForNavigation();

      // Extract the search results
      const results = await page.$$eval("div.g", (elements) => {
        return elements.map((el) => {
          const titleElement = el.querySelector("h3");
          const linkElement = el.querySelector("a");
          const descriptionElement = el.querySelector("span.st");

          const title = titleElement ? titleElement.textContent : "";
          const link = linkElement ? linkElement.href : "";
          const description = descriptionElement
            ? descriptionElement.textContent
            : "";

          return { title, link, description };
        });
      });

      // Close the browser
      await browser.close();

      res.json(results);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

export default router;
