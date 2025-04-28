import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBvkx2dIGjm6Ma8D5SLn12rNeY1aPjKEUc",
});

async function generateResponse(transcription) {
  console.log("Transcription received. Preparing prompt...");

  const prompt = `Here's a coding tutorial video transcript: ${transcription}. Generate the following:

  1. 5 multiple-choice questions based on the transcript with the correct answers.
  2. A coding challenge matching the level of what's in the transcript.
  3. A concise summary of the video.

  Please **return ONLY the following in strict JSON format**, no additional explanation or extra text. The JSON response should look like this:

  {
    "summary": "Summary of the video.",
    "mcqs": [
      {
        "question": "Question 1?",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Option 1",
        "score": eg: 4
      },
      ...
    ],
    "codingChallenge": {
      "challenge": "Challenge description here",
      "description": "Details of the challenge",
      "tips": "Tips for solving the challenge"
    }
  }`;

  console.log("Sending request to Gemini...");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  console.log("Received response from Gemini.");

  const data = response.text;

  if (!data) {
    console.error("No text content found in the response");
    throw new Error("No text content found in the response");
  }

  const jsonMatch = data.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error("No JSON structure found in the response text");
    throw new Error("No JSON found in the response text");
  }

  const extractedJSON = JSON.parse(jsonMatch[0]);

  console.log("Successfully parsed JSON.");

  return extractedJSON;
}

export default generateResponse;
