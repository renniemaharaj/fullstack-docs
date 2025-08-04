import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import app from "../firebase";
import { getSystemInstructions } from "./utils";

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Wrap in an async function so you can use await
export async function prompt(msg: string) {
  return getSystemInstructions().then(async (res) => {
    // Create a `GenerativeModel` instance with a model that supports your use case
    const model = getGenerativeModel(ai, {
      model: "gemini-2.5-flash",
      systemInstruction: res,
    });

    // Provide a prompt that contains text
    const prompt = msg;

    // To generate text output, call generateContent with the text input
    const result = await model.generateContent(prompt);

    const response = result.response;
    let text = response.text();

    // Utility function to remove code fences
    function removeCodeFences(str: string): string {
      return str.replace(/```[\s\S]*?\n([\s\S]*?)```/g, "$1").trim();
    }

    text = removeCodeFences(text);

    return text;
  });
}
