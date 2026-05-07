import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useOrders, useAuth } from "@/lib/store";
import type { OrderStatus } from "@/lib/data";
import { Phone, MessageCircle, Globe } from "lucide-react";

export const Route = createFileRoute("/kitchen")({
  head: () => ({ meta: [{ title: "Kitchen — Tandoor.ai" }] }),
  beforeLoad: () => {
    const role = useAuth.getState().role;
    if (!role) throw redirect({ to: "/login" });
  },
  component: KitchenPage,
});

const channelIcon = { voice: Phone, whatsapp: MessageCircle, web: Globe } as const;
const next: Record<OrderStatus, OrderStatus | null> = {
  received: "preparing", preparing: "ready", ready: "completed", completed: null,
};
const colors: Record<OrderStatus, string> = {
  received: "bg-saffron/20 text-foreground border-saffron/40",
  preparing: "bg-primary/10 text-primary border-primary/30",
  ready: "bg-success/15 text-success border-success/30",
  completed: "bg-muted text-muted-foreground border-border",
};

function KitchenPage() {
  const { orders, updateStatus } = useOrders();
  const buckets: OrderStatus[] = ["received", "preparing", "ready", "completed"];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold">Kitchen Display</h1>
            <p className="text-sm text-muted-foreground mt-1">Drag orders down the line as they progress.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-success animate-pulse" /> Live
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {buckets.map((b) => {
            const list = orders.filter((o) => o.status === b);
            return (
              <div key={b} className="bg-secondary/40 rounded-2xl p-3 min-h-[300px]">
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="font-display font-semibold capitalize">{b}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-card border border-border">{list.length}</span>
                </div>
                <div className="space-y-2">
                  {list.map((o) => {
                    const Ch = channelIcon[o.channel];
                    return (
                      <div key={o.id} className="bg-card rounded-xl p-4 border border-border shadow-soft">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-xs text-muted-foreground">{o.id}</div>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${colors[o.status]}`}>{o.status}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-sm">
                          <Ch className="size-3.5 text-muted-foreground" /> {o.customer}
                        </div>
                        <ul className="mt-3 space-y-1 text-sm">
                          {o.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between"><span>{it.qty} × {it.name}</span></li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{o.placedAt}</span><span className="font-semibold text-foreground">₹{o.total}</span>
                        </div>
                        {next[o.status] && (
                          <button onClick={() => updateStatus(o.id, next[o.status]!)} className="mt-3 w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:scale-[1.01] transition">
                            Mark {next[o.status]}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {list.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">Nothing here.</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
