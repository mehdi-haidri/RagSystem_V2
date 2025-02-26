import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;
const ASTRA_DB_URL = process.env.ASTRA_DB_URL;
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const links = [
//   "https://en.wikipedia.org/wiki/NBA",
//   "https://www.nba.com/",
//   "https://www.espn.com/nba/",
//   "https://www.cbssports.com/nba/",
//   "https://www.basketball-reference.com/",
//   "https://www.nba.com/standings",
//   "https://www.nba.com/scores",
//   "https://www.nba.com/stats/",
//   "https://www.espn.com/nba/standings",
//   "https://www.espn.com/nba/stats",
//   "https://www.basketball-reference.com/leagues/NBA_2024.html",
//   "https://www.basketball-reference.com/playoffs/",
//   "https://en.wikipedia.org/wiki/NBA_Finals",
//   "https://en.wikipedia.org/wiki/List_of_NBA_champions",
//   "https://www.foxsports.com/nba/stats",
//   "https://bleacherreport.com/nba",
//   "https://sports.yahoo.com/nba/",
//   "https://www.nbcsports.com/nba",
//   "https://www.sportskeeda.com/basketball",
//   "https://www.spotrac.com/nba/contracts/",
//   "https://www.spotrac.com/nba/salaries/",
//   "https://www.espn.com/nba/transactions"
// ];
const links = [
  // "https://www.imdb.com/search/title/?title_type=feature,tv_series,tv_episode&release_date=2024-01-01,2024-12-31",
  // "https://en.wikipedia.org/wiki/List_of_American_films_of_2025",
  // ' https://en.wikipedia.org/wiki/List_of_American_films_of_2024',
  // "https://en.wikipedia.org/wiki/2024_in_film",
  // "https://en.wikipedia.org/wiki/2025_in_film",
  "C:\Users\mehdi\Downloads\Top_100_Trending_Movies_2025.csv"
]
  

const client = new DataAPIClient( ASTRA_DB_APPLICATION_TOKEN );
const db = client.db(ASTRA_DB_URL, { namespace: ASTRA_DB_NAMESPACE });

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// CORRECTED: Use the embedding model properly
const embeddingModel = genAI.getGenerativeModel({
  model: "embedding-001" // Updated model name
});

// const chatModel = genAI.getGenerativeModel({ 
//   model: "gemini-1.5-flash-latest",
//   generationConfig: {
//     temperature: 0.5,
//     topP: 1,
//     topK: 32,
//     maxOutputTokens: 8192,
//   }
// });

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 100 });

const createCollection = async (similarityMetric) => {
    const collection = await db.createCollection(ASTRA_DB_COLLECTION,
        {
            vector:
            {
                dimension : 768,
                metric: similarityMetric
            }
        });
    console.log("Created collection", collection);
}

const loadSampleData = async () => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    
    for (const url of links) {
      const content = await scrapePage(url);
      const chunks = await splitter.splitText(content);

      for (const chunk of chunks) {
        // CORRECTED: Use embedContent instead of embedText
        const embedResponse = await embeddingModel.embedContent(chunk);
        const vector = embedResponse.embedding.values; // Updated path to values
        
        const result = await collection.insertOne({
          text: chunk,
          $vector: vector,
        });
        console.log(result);
      }
    }
    console.log("Data loaded successfully!");
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// CORRECTED: Fix the scrapePage return statement
const scrapePage = async (url) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: { headless: true },
    gotoOptions: { waitUntil: "domcontentloaded" },
    evaluate: async (page) => { // Removed unused browser parameter
      const result = await page.evaluate(() => document.body.innerHTML);
      return result;
    },
  });
  
  const scraped = await loader.scrape();
  return scraped?.replace(/<[^>]*>?/gm, '') || "";
};

createCollection("dot_product").then(() => {
  loadSampleData();
});