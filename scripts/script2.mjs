import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as pdfjsLib from "pdfjs-dist";
import "dotenv/config";

const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;
const ASTRA_DB_URL = process.env.ASTRA_DB_URL;
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_URL, { namespace: ASTRA_DB_NAMESPACE });

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Corrected: Use the embedding model properly
const embeddingModel = genAI.getGenerativeModel({
  model: "embedding-001", // Correct model name
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 100 });

const createCollection = async (similarityMetric) => {
  const collection = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  });
  console.log("Created collection", collection);
};

// Function to read and extract text from a PDF using pdfjs-dist
const extractTextFromPDF = async (pdfPath) => {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    let textContent = "";

    for (let i = 22; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      textContent += text.items.map(item => item.str).join(' ');
    }

    return textContent;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
};

const loadSampleData = async (pdfPath) => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    
    // Extract text from the PDF
    const content = await extractTextFromPDF(pdfPath);
    const chunks = await splitter.splitText(content);

    for (const chunk of chunks) {
      // Use embedContent instead of embedText
      const embedResponse = await embeddingModel.embedContent(chunk);
      const vector = embedResponse.embedding.values; // Updated path to values
      
      const result = await collection.insertOne({
        text: chunk,
        $vector: vector,
      });
      console.log(result);
    }

    console.log("Data loaded successfully!");
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

// Example: Replace 'document.pdf' with your actual PDF file path
const pdfFilePath = "document.pdf";

createCollection("dot_product").then(() => {
  loadSampleData(pdfFilePath);
});


// extractTextFromPDF(pdfFilePath);