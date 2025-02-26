import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
import "dotenv/config";
import fs from 'fs';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const prompt = `Attached is an image of a clinical report. 
Go over the the clinical report and identify biomarkers that show slight or large abnormalities. Then summarize in 100 words. You may increase the word limit if the report has multiple pages. Do not output patient name, date etc. Make sure to include numerical values and key details from the report, including report title.
## Summary: `;
async function readImageAsBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        return `data:image/jpg;base64,${imageBuffer.toString("base64")}`; // Change `png` to correct format if needed
    } catch (error) {
        console.error("Error reading image:", error);
        return null;
    }
}

export async function main() {

    const imagePath = "clinical_report.jpg"// Change the filename as needed
    const base64 = await readImageAsBase64(imagePath);

    if (!base64) {
        console.log("Failed to read image as base64");
        return 0;
    }
    const filePart = fileToGenerativePart(base64)

    const generatedContent = await model.generateContent([prompt, filePart]);

    console.log(generatedContent);
    const textResponse = generatedContent.response.candidates[0].content.parts[0].text;
    console.log(textResponse);

    // return new Response(textResponse, { status: 200 })
}








function fileToGenerativePart(imageData) {
    return {
        inlineData: {
            data: imageData.split(",")[1],
            mimeType: "image/png", // Change this dynamically if handling multiple formats
        },
    };
}

main();