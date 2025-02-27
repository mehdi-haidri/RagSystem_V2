import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
import "dotenv/config";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});



const prompt = `Attached is an image of a clinical report. 
Go over the the clinical report and identify biomarkers that show slight or large abnormalities. Then summarize in 100 words. You may increase the word limit if the report has multiple pages. Do not output patient name, date etc. Make sure to include numerical values and key details from the report, including report title.
## Summary: `;

export async function POST(req) { 
    
    const { base64Image } = await req.json();
    const imagePart = fileToGenerativePart(base64Image);
    const generatedContent = await model.generateContent([prompt, imagePart]);

    const textResponse = generatedContent.response.candidates[0].content.parts[0].text;
    console.log(textResponse);
     return  Response.json(textResponse, { status: 200 })

}

function fileToGenerativePart(imageData) {
    return {
        inlineData: {
            data: imageData.split(",")[1],
            mimeType: imageData.substring(
                imageData.indexOf(":") + 1,
                imageData.lastIndexOf(";")
            ),
        },
    }
}