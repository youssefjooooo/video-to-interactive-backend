import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";

async function extractAudio(videoPath, audioPath) {
  console.log("Starting audio extraction...");

  // Log video file size
  const videoFileSizeBytes = await fs.stat(videoPath);
  const videoFileSizeMB = (videoFileSizeBytes.size / 1024 / 1024).toFixed(2);
  console.log(`Video file size: ${videoFileSizeMB} MB`);

  // Extract audio using ffmpeg and convert to MP3 (wrapped in a Promise)
  await new Promise((resolve, reject) => {
    ffmpeg()
      .setFfmpegPath(
        "D:/ffmpeg-7.1.1-essentials_build/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe"
      )
      .input(videoPath)
      .noVideo() // Disable video stream
      .audioCodec("libmp3lame") // Use MP3 codec
      .audioBitrate("128k") // Set the bitrate to 128kbps for compression
      .audioChannels(2) // Keep stereo channels
      .on("start", (commandLine) => {
        console.log("FFmpeg command line:", commandLine);
      })
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent}% done`);
      })
      .on("end", () => {
        console.log("Audio extraction complete.");
        resolve(); // Resolve the promise when the extraction and conversion is complete
      })
      .on("error", (err) => {
        console.error("Error during extraction:", err);
        reject(err); // Reject the promise if an error occurs
      })
      .save(audioPath); // Save as MP3
  });

  // Log audio file size
  const audioFileSizeBytes = await fs.stat(audioPath);
  const audioFileSizeMB = (audioFileSizeBytes.size / 1024 / 1024).toFixed(2);
  console.log(`Audio file size: ${audioFileSizeMB} MB`);

  // Get and log the duration of the extracted audio file
  ffmpeg.ffprobe(audioPath, (err, metadata) => {
    if (err) {
      console.error("Error checking audio metadata", err);
    } else {
      console.log("Audio Duration (seconds): ", metadata.format.duration);
    }
  });

  return audioPath; // Return path to the extracted audio
}

export default extractAudio;
