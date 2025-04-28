import path from "path";
import fs from "fs/promises";

import generateResponse from "../utils/generateResponse.js";
import transcribeAudio from "../utils/transcripeAudio.js";
import getAudioFromVideo from "../utils/getAudioFromVideo.js";

export default async function processVideo(req, res) {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ error: "No video URL provided" });
    }

    const audioDir = "/tmp";
    await fs.mkdir(audioDir, { recursive: true });
    const audioPath = path.join(audioDir, "audio.mp3");

    console.log(`Downloading audio from URL: ${videoUrl}`);
    console.log(`Audio will be saved to: ${audioPath}`);

    try {
      await getAudioFromVideo(audioPath, videoUrl);
    } catch (error) {
      console.error("Error downloading audio:", error);
      return res
        .status(500)
        .json({ error: "Failed to download audio", details: error.message });
    }

    console.log("Audio download complete. Transcribing audio...");
    console.log(`Transcribing audio from: ${audioPath}`);

    let transcription;
    try {
      transcription = await transcribeAudio(audioPath);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      return res
        .status(500)
        .json({ error: "Failed to transcribe audio", details: error.message });
    }

    let aiResponse;
    try {
      aiResponse = await generateResponse(transcription);
    } catch (error) {
      console.error("Error generating AI response:", error);
      return res.status(500).json({
        error: "Failed to generate AI response",
        details: error.message,
      });
    }

    const result = aiResponse;

    try {
      await fs.unlink(audioPath);
      console.log(`Audio file deleted: ${audioPath}`);
    } catch (error) {
      console.error("Error deleting audio file:", error);
    }

    console.log(
      "============================================================================="
    );

    return res.status(200).json({
      status: "Success",
      transcription: transcription.text,
      data: result,
    });
  } catch (error) {
    console.error("Processing failed:", error);
    return res
      .status(500)
      .json({ error: "Processing failed", details: error.message });
  }
}
