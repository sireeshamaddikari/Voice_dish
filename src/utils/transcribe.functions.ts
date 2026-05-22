import { createServerFn } from "@tanstack/react-start";

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: { audioBase64: string; mimeType: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

    const bin = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
    const ext = data.mimeType.includes("mp4") ? "mp4"
      : data.mimeType.includes("ogg") ? "ogg"
      : data.mimeType.includes("wav") ? "wav"
      : "webm";
    const blob = new Blob([bin], { type: data.mimeType });

    const form = new FormData();
    form.append("file", blob, `audio.${ext}`);
    form.append("model_id", "scribe_v2");
    form.append("tag_audio_events", "false");

    const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: form,
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Transcription failed (${res.status}): ${t.slice(0, 200)}`);
    }
    const json = await res.json();
    return { text: (json.text ?? "").trim() };
  });
