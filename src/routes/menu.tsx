import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { menu, categories } from "@/lib/data";
import { useCart } from "@/lib/store";
import { Plus, Flame, Leaf, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [
    { title: "Menu — Tandoor.ai" },
    { name: "description", content: "Browse our full menu and order in seconds." },
  ]}),
  component: MenuPage,
});

function MenuPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const add = useCart((s) => s.add);

  const filtered = menu.filter((m) =>
    (cat === "All" || m.category === cat) &&
    (q === "" || m.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold">The Menu</h1>
            <p className="text-muted-foreground mt-2">Fresh from the tandoor, straight to your door.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes…" className="pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {["All", ...categories].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <article key={m.id} className="group bg-card border border-border rounded-2xl p-6 flex flex-col hover:shadow-soft transition">
              <div className="flex items-start justify-between">
                <div className="text-5xl">{m.emoji}</div>
                <div className="flex gap-1">
                  {m.veg && <span className="size-5 rounded border-2 border-success grid place-items-center"><span className="size-2 rounded-full bg-success" /></span>}
                  {m.spicy && <Flame className="size-5 text-primary" />}
                  {m.popular && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron/20 text-foreground">Popular</span>}
                </div>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 flex-1">{m.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-semibold text-lg">₹{m.price}</span>
                <button onClick={() => { add(m); toast.success(`${m.name} added`); }} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:scale-[1.03] transition">
                  <Plus className="size-4" /> Add
                </button>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Leaf className="size-10 mx-auto mb-3 opacity-50" />
            No dishes match.
          </div>
        )}
      </div>
    </div>
  );
}
