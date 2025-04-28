import { exec } from "child_process";
import fs from "fs/promises";
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${stderr}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function getAudioFromVideo(audioPath, videoUrl) {
  await runCommand(
    `"bin\\yt-dlp.exe" -f bestaudio --extract-audio --audio-format mp3 --audio-quality 5 --ffmpeg-location "bin" -o "${audioPath}" "${videoUrl}"`
  );

  try {
    const stats = await fs.stat(audioPath); // Fetch stats of the downloaded audio file
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2); // Convert bytes to MB
    console.log(`Audio file size: ${fileSizeInMB} MB`);
  } catch (error) {
    console.error("Error reading file stats:", error);
  }
}

export default getAudioFromVideo;
