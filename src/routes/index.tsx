import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Phone, MessageCircle, Globe, ArrowRight, Sparkles, Mic, BarChart3, ChefHat } from "lucide-react";
import heroImg from "@/assets/hero-food.jpg";
import { menu } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Tandoor.ai — AI Restaurant Ordering: Voice, WhatsApp & Web" },
    { name: "description", content: "Let AI take orders 24/7 across phone calls, WhatsApp and your web menu. Sync with the kitchen in real time." },
  ]}),
  component: Landing,
});

function Landing() {
  const popular = menu.filter((m) => m.popular).slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5 text-primary" /> Now with multilingual Voice AI
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] text-balance">
              Your kitchen.<br/>
              <span className="text-primary">On autopilot.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg text-balance">
              Tandoor.ai answers every call, every WhatsApp, and every tap on your menu — taking orders in English, हिंदी and తెలుగు, then dropping them straight into the kitchen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground font-medium shadow-warm hover:scale-[1.02] transition">
                Order now <ArrowRight className="size-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-medium hover:bg-secondary transition">
                <ChefHat className="size-4" /> Restaurant login
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="98%" label="Order accuracy" />
              <Stat n="<2s" label="AI response" />
              <Stat n="3×" label="Throughput" />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-warm ring-1 ring-border">
              <img src={heroImg} alt="Spread of dishes" width={1536} height={1024} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-soft w-64 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-success/15 grid place-items-center"><Mic className="size-5 text-success" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">Live order</div>
                  <div className="text-sm font-medium">"Two butter chicken, one naan…"</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl p-4 shadow-soft hidden sm:block">
              <div className="text-xs text-muted-foreground">Tonight's revenue</div>
              <div className="font-display text-2xl font-semibold">₹ 41,820</div>
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-balance max-w-2xl">Three ways to order. <span className="text-muted-foreground">One smart kitchen.</span></h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          <ChannelCard icon={Phone} title="Voice AI Calls" desc="Customers call your number. AI answers, takes the order, confirms, and books a slot." tint="bg-primary/10 text-primary" />
          <ChannelCard icon={MessageCircle} title="WhatsApp Bot" desc="Send the menu, accept text & voice notes, share UPI links and live order updates." tint="bg-success/10 text-success" />
          <ChannelCard icon={Globe} title="Web Ordering" desc="A blazing-fast menu site with cart, checkout and tracking — your customers will love it." tint="bg-saffron/20 text-foreground" />
        </div>
      </section>

      {/* Popular */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-4xl font-semibold">Tonight's favourites</h2>
            <Link to="/menu" className="text-sm font-medium text-primary inline-flex items-center gap-1">View full menu <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popular.map((m) => (
              <div key={m.id} className="group bg-card border border-border rounded-2xl p-6 hover:shadow-warm transition">
                <div className="text-5xl">{m.emoji}</div>
                <h3 className="mt-4 font-display text-xl font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold">₹{m.price}</span>
                  <Link to="/menu" className="text-sm text-primary font-medium">Order →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For owners */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium"><BarChart3 className="size-3.5 text-primary" /> For restaurant owners</div>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl font-semibold text-balance">Run a tighter kitchen with AI in the loop.</h2>
            <p className="mt-5 text-muted-foreground text-lg">Real-time order board, daily revenue, peak hour heatmaps, and a kitchen view chefs can actually use during a Friday rush.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {["Real-time KDS", "Multi-channel orders", "Voice analytics", "UPI / Card / WhatsApp Pay"].map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-charcoal text-cream p-8 shadow-warm">
            <div className="text-xs uppercase tracking-widest text-cream/60">Live kitchen feed</div>
            <div className="mt-6 space-y-3">
              {[
                { id: "ORD-1042", name: "Butter Chicken ×1, Naan ×2", chan: "WA" },
                { id: "ORD-1041", name: "Hyderabadi Biryani ×2", chan: "Voice" },
                { id: "ORD-1040", name: "Paneer Tikka, Lassi ×2", chan: "Web" },
              ].map((o) => (
                <div key={o.id} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div>
                    <div className="text-xs text-cream/60">{o.id} · {o.chan}</div>
                    <div className="font-medium">{o.name}</div>
                  </div>
                  <div className="size-2 rounded-full bg-saffron animate-pulse" />
                </div>
              ))}
            </div>
            <Link to="/admin" className="mt-8 inline-flex items-center gap-2 text-saffron font-medium">Open admin dashboard <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Tandoor.ai · Built for restaurants that move fast
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-semibold">{n}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function ChannelCard({ icon: Icon, title, desc, tint }: { icon: any; title: string; desc: string; tint: string }) {
  return (
    <div className="group bg-card border border-border rounded-2xl p-7 hover:shadow-warm hover:-translate-y-0.5 transition">
      <div className={`size-12 rounded-xl grid place-items-center ${tint}`}><Icon className="size-6" /></div>
      <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{desc}</p>
    </div>
  );
}
