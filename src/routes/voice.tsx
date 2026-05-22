import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Mic, MicOff, Volume2, Sparkles, Loader2, ShoppingBag } from "lucide-react";
import { voiceOrderChat } from "@/utils/voice-order.functions";
import { transcribeAudio } from "@/utils/transcribe.functions";
import { useCart } from "@/lib/store";
import { menu } from "@/lib/data";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/voice")({
  head: () => ({ meta: [
    { title: "Voice Ordering — Tandoor.ai" },
    { name: "description", content: "Order your meal by voice. Just speak — Tara, our AI host, takes care of the rest." },
  ]}),
  component: VoicePage,
});

type Msg = { role: "user" | "assistant"; content: string };

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => {
      const s = String(r.result || "");
      resolve(s.split(",")[1] || "");
    };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

function VoicePage() {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm Tara from Tandoor. What would you like to order tonight?" },
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cartAdd = useCart((s) => s.add);
  const cartRemove = useCart((s) => s.remove);
  const cartClear = useCart((s) => s.clear);
  const cartItems = useCart((s) => s.items);
  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0);

  useEffect(() => {
    speak("Hi! I'm Tara from Tandoor. What would you like to order tonight?");
    return () => {
      window.speechSynthesis?.cancel();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 1.05;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  async function startRecording() {
    try {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4"
        : "";
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const type = mr.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (blob.size < 800) { toast.error("Didn't catch that. Try again."); return; }
        await processAudio(blob, type);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setListening(true);
    } catch (e: any) {
      toast.error(e?.message || "Microphone permission denied");
    }
  }

  function stopRecording() {
    setListening(false);
    try { mediaRecorderRef.current?.stop(); } catch {}
  }

  async function processAudio(blob: Blob, mime: string) {
    setThinking(true);
    try {
      const audioBase64 = await blobToBase64(blob);
      const { text } = await transcribeAudio({ data: { audioBase64, mimeType: mime } });
      if (!text) { toast.error("Couldn't hear you clearly."); return; }
      const next: Msg[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      const { reply, actions } = await voiceOrderChat({ data: { messages: next } });
      if (Array.isArray(actions)) {
        for (const a of actions) {
          if (a.type === "clear") { cartClear(); continue; }
          if (!a.id) continue;
          const item = menu.find((m) => m.id === String(a.id));
          if (!item) continue;
          if (a.type === "add") {
            const qty = Math.max(1, Number(a.qty ?? 1));
            for (let i = 0; i < qty; i++) cartAdd(item);
            toast.success(`Added ${qty} × ${item.name}`);
          } else if (a.type === "remove") {
            cartRemove(item.id);
            toast.success(`Removed ${item.name}`);
          }
        }
      }
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setThinking(false);
    }
  }

  function toggleMic() {
    if (thinking) return;
    if (listening) stopRecording();
    else startRecording();
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" /> Voice AI · powered by ElevenLabs + Lovable AI
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold">Just speak your order.</h1>
          <p className="mt-3 text-muted-foreground">Tap the mic, say what you want — Tara will take care of the rest.</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-warm">
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={toggleMic}
              disabled={thinking}
              className={`relative size-32 rounded-full grid place-items-center transition-all ${
                listening ? "bg-primary text-primary-foreground scale-110" : "bg-secondary hover:bg-secondary/70"
              } disabled:opacity-50`}
            >
              {listening && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />}
              {listening ? <Mic className="size-12 relative" /> : <MicOff className="size-12 relative" />}
            </button>
            <div className="h-6 text-sm text-muted-foreground">
              {thinking ? <span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Thinking…</span>
                : speaking ? <span className="inline-flex items-center gap-2"><Volume2 className="size-4" /> Tara is speaking…</span>
                : listening ? "Recording… tap mic to send"
                : "Tap the mic to start"}
            </div>
          </div>

          <div className="mt-8 space-y-3 max-h-96 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <ShoppingBag className="size-4 text-primary" />
              <span className="font-medium">{cartCount} item{cartCount === 1 ? "" : "s"} in cart</span>
              <span className="text-muted-foreground hidden sm:inline">
                {cartItems.map((i) => `${i.qty}× ${i.name}`).join(", ")}
              </span>
            </div>
            <Link to="/cart" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground text-sm font-medium">Checkout</Link>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          Speech is transcribed by ElevenLabs Scribe. Replies generated by Lovable AI.
        </p>
      </div>
    </div>
  );
}
