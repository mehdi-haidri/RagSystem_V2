'use server'


import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { StreamingTextResponse } from 'ai'; // Correct import

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

export async function POST(request) {
  try {
    const body = await request.json();

    const messages = body.messages;
    const confirmedReport = body.data.ConfirmedReport;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { 
        status: 400 
      });
    }

    const latestMessage = messages[messages.length - 1].content;
    if (!latestMessage?.trim()) {
      return new Response(JSON.stringify({ error: "Empty message content" }), { 
        status: 400 
      });
    }

    // Generate embeddings
    const embedResponse = await embeddingModel.embedContent(latestMessage);
    let docContext = "";

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const vector = embedResponse.embedding.values;

      // Vector search
      const cursor = collection.find(null, {
        sort: { $vector: vector },
        limit: 10
      });

      const documents = await cursor.toArray();
      const docMap = documents?.map(doc => doc.text);
      docContext = JSON.stringify(docMap);
    } catch (error) { 
      console.error("Vector search error:", error);
      docContext = "";
    }

    // Construct Gemini prompt
    const template = {
      role: "user",
      parts: [{
        text: `You are provided with a **summary of a patient's clinical report**, a **user query**, and **generic clinical insights** that may or may not be relevant to the report.  

### **Instructions:**
- you are a **medical chatbot**.
- Carefully analyze the clinical report if there was one before answering the user's query. 
- Use the provided **generic clinical findings** only if they are relevant to the patient's case. **Do not include unrelated insights.**  
- Ensure your response is **factually accurate, well-justified, and demonstrates a deep understanding** of both the query and the clinical report.  
- If necessary, enrich your knowledge by referring to the generic clinical findings before formulating your response.  
- **Do not rephrase or restate the user's query unless necessary for clarity.**  
- **Provide a thorough, well-supported justification for your answer.**  

---

### **Patient's Clinical Report Summary:**  
${confirmedReport}  
**(End of Patient's Clinical Report Summary)**  

---

### **User Query:**  
${latestMessage}  
**(End of User Query)**  

---

### **Relevant Clinical Findings (if applicable):**  
${docContext}  
**(End of Clinical Findings)**  

---

### **Fact-Based Answer with Justification:**  

`}]
    };
    

    // Initialize chat model
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

    // Generate streamed response
    const response = await chatModel.generateContentStream({
      contents: [template]
    });

    // Check if response.stream is iterable
    if (!response.stream || typeof response.stream[Symbol.asyncIterator] !== 'function') {
      console.error('Response stream is not iterable or empty');
      return new Response(
        JSON.stringify({ error: "Unable to generate stream" }),
        { status: 500 }
      );
    }

    // Convert to ReadableStream
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       for await (const chunk of response.stream) {
    //         const chunkText = await chunk.text(); // Extract text from chunk
    //         controller.enqueue(new TextEncoder().encode(chunkText)); // Encode as Uint8Array
    //       }
    //     } catch (error) {
    //       console.error("Stream error:", error);
    //       controller.error(error);
    //     } finally {
    //       controller.close();
    //     
    //   }
    // });
    const stream = new ReadableStream({
      async start(controller) {
        const id = Date.now().toString(); // Generate a unique ID
        const role = "system"; // Set the role to "assistant"
    
        // Send the initial message object
       
    
        // Stream the content
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
    
  
    // Return proper streaming response
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}