import { createFileRoute } from "@tanstack/react-router";
import { Mic, Languages, PhoneForwarded, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/voice")({ component: VoiceAI });

function VoiceAI() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-semibold">Voice AI</h1>
      <p className="text-muted-foreground mt-2">Configure how AI answers your restaurant phone.</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Card icon={Mic} title="Voice persona" desc="Warm, female, Indian English" />
        <Card icon={Languages} title="Languages" desc="English · हिंदी · తెలుగు" />
        <Card icon={PhoneForwarded} title="Fallback to human" desc="Transfer after 2 unclear attempts" />
        <Card icon={Sparkles} title="Upselling" desc="Suggest dessert + drinks" />
      </div>

      <div className="mt-8 bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-xl font-semibold mb-4">Live transcript</h3>
        <div className="space-y-3 text-sm font-mono">
          <Bubble who="ai">Namaste! Welcome to Tandoor. Aap kya order karna chahenge?</Bubble>
          <Bubble who="caller">Mujhe do butter chicken aur teen garlic naan chahiye.</Bubble>
          <Bubble who="ai">Ji bilkul. Kya aap ke saath koi dessert? Aaj gulab jamun special hai.</Bubble>
          <Bubble who="caller">Haan, ek plate gulab jamun bhi.</Bubble>
          <Bubble who="ai">Total ₹1,180. UPI link bhej diya hai. Dhanyavaad!</Bubble>
        </div>
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
          <strong className="text-primary">Setup needed:</strong> connect Twilio + ElevenLabs to take real calls. Ask in chat to wire it up.
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
      <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="size-5" /></div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function Bubble({ who, children }: { who: "ai" | "caller"; children: React.ReactNode }) {
  return (
    <div className={`flex ${who === "ai" ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-md px-4 py-2.5 rounded-2xl ${who === "ai" ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>{children}</div>
    </div>
  );
}
