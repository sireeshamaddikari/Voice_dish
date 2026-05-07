import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Mic, MicOff, Volume2, Sparkles, Loader2 } from "lucide-react";
import { voiceOrderChat } from "@/server/voice-order.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/voice")({
  head: () => ({ meta: [
    { title: "Voice Ordering — Tandoor.ai" },
    { name: "description", content: "Order your meal by voice. Just speak — Tara, our AI host, takes care of the rest." },
  ]}),
  component: VoicePage,
});

type Msg = { role: "user" | "assistant"; content: string };

function VoicePage() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm Tara from Tandoor. What would you like to order tonight?" },
  ]);
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = "en-IN";
    r.onresult = (e: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interimText += t;
      }
      setInterim(interimText);
      if (finalText) handleUserSpeech(finalText.trim());
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
    // Greet on load
    speak("Hi! I'm Tara from Tandoor. What would you like to order tonight?");
    return () => { try { r.stop(); } catch {} window.speechSynthesis?.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function speak(text: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    u.rate = 1.05;
    u.pitch = 1.0;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  async function handleUserSpeech(text: string) {
    setInterim("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setThinking(true);
    try {
      const { reply } = await voiceOrderChat({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally {
      setThinking(false);
    }
  }

  function toggleMic() {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      try { recognitionRef.current.start(); setListening(true); } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" /> Voice AI · powered by Tandoor
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold">Just speak your order.</h1>
          <p className="mt-3 text-muted-foreground">Tap the mic, say what you want — Tara will take care of the rest.</p>
        </div>

        {!supported && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-center mb-6">
            Voice recognition isn't supported in this browser. Try Chrome on desktop or Android.
          </div>
        )}

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-warm">
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={toggleMic}
              disabled={!supported || thinking}
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
                : listening ? "Listening… speak now"
                : "Tap the mic to start"}
            </div>
            {interim && <div className="text-sm italic text-muted-foreground">"{interim}"</div>}
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

        <p className="text-center text-xs text-muted-foreground mt-6">
          Speech is processed locally by your browser. Conversation is handled by Lovable AI.
        </p>
      </div>
    </div>
  );
}
