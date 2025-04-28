import { exec } from "child_process";
import fs from "fs/promises";
import { platform } from "os";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname manually (because of ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const isWindows = platform() === "win32";

  // Correct absolute path to yt-dlp
  const ytDlpPath = path.join(
    __dirname,
    "../bin",
    isWindows ? "yt-dlp.exe" : "yt-dlp"
  );

  // On Vercel, use system ffmpeg (already installed). Locally, you can customize if needed.
  const ffmpegLocation = isWindows
    ? path.join(__dirname, "../bin")
    : "/usr/bin/ffmpeg";

  const command = `"${ytDlpPath}" -f bestaudio --extract-audio --audio-format mp3 --audio-quality 5 --ffmpeg-location "${ffmpegLocation}" -o "${audioPath}" "${videoUrl}"`;

  await runCommand(command);

  try {
    const stats = await fs.stat(audioPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Audio file size: ${fileSizeInMB} MB`);
  } catch (error) {
    console.error("Error reading file stats:", error);
  }
}

export default getAudioFromVideo;
