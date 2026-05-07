import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/admin/whatsapp")({ component: WhatsApp });

function WhatsApp() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-semibold">WhatsApp Bot</h1>
      <p className="text-muted-foreground mt-2">Take orders directly inside WhatsApp.</p>

      <div className="mt-8 grid lg:grid-cols-[360px_1fr] gap-6">
        <div className="bg-[#075E54] rounded-3xl p-3 shadow-warm">
          <div className="bg-[#ECE5DD] rounded-2xl h-[520px] p-4 flex flex-col gap-2 text-sm">
            <Msg me={false}>Hi! 👋 Welcome to Tandoor. Reply <b>MENU</b> to see today's menu.</Msg>
            <Msg me>menu</Msg>
            <Msg me={false}>🍛 Mains<br/>1. Butter Chicken — ₹420<br/>2. Paneer Butter Masala — ₹360<br/>3. Biryani — ₹380<br/>Reply with item numbers.</Msg>
            <Msg me>1, 3 and 2 naans</Msg>
            <Msg me={false}>Got it ✅<br/>1× Butter Chicken<br/>1× Biryani<br/>2× Naan<br/>Total: ₹880<br/>Pay → upi://pay?…</Msg>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="size-10 rounded-xl bg-success/15 text-success grid place-items-center mb-3"><MessageCircle className="size-5" /></div>
            <h3 className="font-display text-xl font-semibold">Connect WhatsApp Business</h3>
            <p className="text-sm text-muted-foreground mt-1">Link your Meta WhatsApp Business number to start taking orders. Supports text and voice notes.</p>
            <button className="mt-4 rounded-xl bg-success text-white px-4 py-2.5 text-sm font-medium">Connect (coming up)</button>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">Auto-replies</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Send menu on first message</li>
              <li>· Confirm order with summary</li>
              <li>· Send UPI/payment link</li>
              <li>· Push status updates: Preparing → Ready → Out for delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Msg({ me = false, children }: { me?: boolean; children: React.ReactNode }) {
  return (
    <div className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${me ? "ml-auto bg-[#DCF8C6]" : "bg-white"}`}>{children}</div>
  );
}
