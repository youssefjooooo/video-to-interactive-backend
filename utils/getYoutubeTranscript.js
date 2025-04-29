import { YoutubeTranscript } from "youtube-transcript";

async function getYoutubeTranscript(videoUrl) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const fullText = transcript.map((entry) => entry.text).join(" ");

    return fullText;
  } catch (error) {
    console.error("Could not fetch transcript:", error);
    return null;
  }
}

export default getYoutubeTranscript;
