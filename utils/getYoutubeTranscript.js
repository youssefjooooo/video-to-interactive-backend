import { YoutubeTranscript } from "youtube-transcript";

async function getYoutubeTranscript(videoUrl) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    if (!transcript || transcript.length === 0) {
      return "No transcript available for this video.";
    }

    const fullText = transcript.map((entry) => entry.text).join(" ");
    return fullText;
  } catch (error) {
    console.error("Could not fetch transcript:", error);
    return "Error fetching transcript or transcript is disabled.";
  }
}

export default getYoutubeTranscript;
