import FormData from "form-data";
import axios from "axios";
import fs from "fs/promises";

const ASSEMBLY_AI_API_KEY =
  process.env.ASSEMBLY_AI_API_KEY || `aadd80b90d8542c7bd7c5f798a10e3a8`;

async function transcribeAudio(audioPath) {
  console.log("Reading audio file...");
  const file = await fs.readFile(audioPath);

  console.log(`File size: ${(file.length / 1024 / 1024).toFixed(2)} MB`);

  const form = new FormData();
  form.append("file", file, { filename: "audio.mp3" });

  console.log("Uploading audio to AssemblyAI...");
  const uploadRes = await axios.post(
    "https://api.assemblyai.com/v2/upload",
    form,
    {
      headers: {
        Authorization: ASSEMBLY_AI_API_KEY,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  const audioUrl = uploadRes.data.upload_url;
  console.log("Audio uploaded. URL:", audioUrl);

  console.log("Requesting transcription...");
  const transcriptRes = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: audioUrl,
      auto_chapters: false,
      auto_highlights: false,
      punctuate: true,
      format_text: true,
    },
    {
      headers: { Authorization: ASSEMBLY_AI_API_KEY },
    }
  );

  const transcriptionId = transcriptRes.data.id;
  console.log("Transcription requested. ID:", transcriptionId);

  // Poll for transcription status
  let transcriptionResult = null;
  console.log("Polling for transcription result...");

  while (!transcriptionResult || transcriptionResult.status !== "completed") {
    console.log("Checking transcription status...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const statusRes = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptionId}`,
      {
        headers: {
          Authorization: ASSEMBLY_AI_API_KEY,
        },
      }
    );
    transcriptionResult = statusRes.data;
  }

  console.log("Transcription completed.");
  return transcriptionResult.text; // Return the transcribed text
}

export default transcribeAudio;
