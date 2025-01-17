import { NextResponse } from "next/server";
import { scrapeUrl } from "@/utils/scraper";
import { getGeminiResponse } from "@/utils/gemini";
import { Logger } from "@/utils/logger";

const logger = new Logger("analyze-route");

export async function POST(req: Request) {
  try {
    const { url, prompt } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Scrape the webpage
    const scrapedContent = await scrapeUrl(url);

    if (scrapedContent.error) {
      return NextResponse.json(
        { error: scrapedContent.error },
        { status: 400 }
      );
    }

    // Prepare message for Gemini
    const messages = [
      {
        role: "system" as const,
        content:
          "You are a data extraction assistant. Extract only the specific data requested by the user from web content and return it in valid JSON format. Be precise and focused on the requested data points. If no specific data is requested, extract key information like title, main topics, and key points in JSON format.",
      },
      {
        role: "user" as const,
        content: `Extract the data from the following webpage content in JSON format: 
        
        <WebpageContent>
            ${scrapedContent.content}
        </WebpageContent>
        
        <ExtractionRequest>
            ${prompt}
        </ExtractionRequest>
        
        Provide the extracted data as a valid JSON object.>`,
      },
    ];

    logger.info("Messages:", messages);

    // Get AI analysis
    const analysis = await getGeminiResponse(messages);

    return NextResponse.json({
      analysis,
      metadata: {
        title: scrapedContent.title,
        description: scrapedContent.metaDescription,
        headings: scrapedContent.headings,
      },
    });
  } catch (error) {
    logger.error("Error in analyze route:", error);
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}
