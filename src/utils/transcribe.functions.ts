import { createServerFn } from "@tanstack/react-start";
import { serverEnv } from "./env";

async function transcribeWithElevenLabs(
  apiKey: string,
  blob: Blob,
  ext: string,
): Promise<string> {
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
    throw new Error(`ElevenLabs (${res.status}): ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json.text ?? "").trim();
}

async function transcribeWithDeepgram(
  apiKey: string,
  blob: Blob,
  mimeType: string,
): Promise<string> {
  const res = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&language=en-IN",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": mimeType || "audio/webm",
      },
      body: blob,
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Deepgram (${res.status}): ${t.slice(0, 200)}`);
  }
  const json = await res.json();
  return (json.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "").trim();
}

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: { audioBase64: string; mimeType: string }) => input)
  .handler(async ({ data }) => {
    const elevenKey = serverEnv("ELEVENLABS_API_KEY");
    const deepgramKey = serverEnv("DEEPGRAM_API_KEY", "VITE_DEEPGRAM_API_KEY");

    if (!elevenKey && !deepgramKey) {
      throw new Error("No speech-to-text API key configured (ELEVENLABS or DEEPGRAM)");
    }

    const bin = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
    const ext = data.mimeType.includes("mp4")
      ? "mp4"
      : data.mimeType.includes("ogg")
        ? "ogg"
        : data.mimeType.includes("wav")
          ? "wav"
          : "webm";
    const blob = new Blob([bin], { type: data.mimeType });

    const errors: string[] = [];
    const providers: Array<() => Promise<string>> = [];

    if (deepgramKey) {
      providers.push(() => transcribeWithDeepgram(deepgramKey, blob, data.mimeType));
    }
    if (elevenKey) {
      providers.push(() => transcribeWithElevenLabs(elevenKey, blob, ext));
    }

    for (const transcribe of providers) {
      try {
        const text = await transcribe();
        if (text) return { text };
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
      }
    }

    throw new Error(
      errors.length > 0
        ? `Transcription failed: ${errors.join("; ")}`
        : "Couldn't hear you clearly.",
    );
  });
