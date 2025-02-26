

import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { StreamingTextResponse, OpenAIStream } from 'ai'; // Correct import$
import "dotenv/config";

// Environment variables
const ASTRA_DB_NAMESPACE = process.env.ASTRA_DB_NAMESPACE;
const ASTRA_DB_COLLECTION = process.env.ASTRA_DB_COLLECTION;
const ASTRA_DB_URL = process.env.ASTRA_DB_URL;
const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize clients
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_URL, { namespace: ASTRA_DB_NAMESPACE });
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Models
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });



const test = ` **Complete Blood Count (CBC) Report Summary:**
The patient's hemoglobin is low at 12.5 g/dL (reference range: 13.0-17.0 g/dL).
The packed cell volume (PCV) is high at 57.5% (reference range: 40-50%).
  RBC count is 5.2 mill/cumm (reference range: 4.5-5.5 mill/cumm) and MCV is 87.75 fL (reference range: 83-101 fL).
   MCH is 27.2 pg (reference range: 27-32 pg). MCHC is 32.8 g/dL (reference range: 32.5-34.5 g/dL).
   Platelet count is borderline at 150,000/cumm (reference range: 150,000-410,000/cumm).
    Further confirmation for anemia is recommended.
`

const userQuestion = "What should i ask my doctor?";











async function main() {
    const embedResponse = await embeddingModel.embedContent(test);
    let docContext = "";

    try {
        const collection = await db.collection(ASTRA_DB_COLLECTION);
        const vector = embedResponse.embedding.values;

        // Vector search
        const cursor = collection.find(null, {
            sort: { $vector: vector },
            limit: 5
        });

        const documents = await cursor.toArray();
        const docMap = documents?.map(doc => doc.text);
        docContext = JSON.stringify(docMap);
    } catch (error) {
        console.error("Vector search error:", error);
        docContext = "";
    }



    
    const finalPrompt = {
        parts: [{
            text: `Here is a summary of a patient's clinical report, and a user query. Some generic clinical findings are also provided that may or may not be relevant for the report.
Go through the clinical report and answer the user query.
Ensure the response is factually accurate, and demonstrates a thorough understanding of the query topic and the clinical report.
Before answering you may enrich your knowledge by going through the provided clinical findings. 
The clinical findings are generic insights and not part of the patient's medical report. Do not include any clinical finding if it is not relevant for the patient's case.

\n\n**Patient's Clinical report summary:** \n${test}. 
\n**end of patient's clinical report** 

\n\n**User Query:**\n${userQuestion}?
\n**end of user query** 

\n\n**Generic Clinical findings:**
\n\n${docContext}. 
\n\n**end of generic clinical findings** 

\n\nProvide thorough justification for your answer.
\n\n**Answer:**
`}]};
    
    
const chatModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    safetySettings: [{
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_ONLY_HIGH"
    }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000
    }
});
const response = await chatModel.generateContentStream({
    contents: [finalPrompt]
  });
    
const stream = new ReadableStream({
    async start(controller) {
   
      for await (const chunk of response.stream) {
        const chunkText = await chunk.text();
        console.log(chunkText)
        controller.enqueue(
          new TextEncoder().encode(
            chunkText 
          )
        );
      }
    
      controller.close();
    },
  });
    
    
}

main();