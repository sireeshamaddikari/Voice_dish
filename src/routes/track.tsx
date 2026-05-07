import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useOrders } from "@/lib/store";
import { useState } from "react";
import { CheckCircle2, ChefHat, Bike, Receipt } from "lucide-react";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) ?? "" }),
  head: () => ({ meta: [{ title: "Track Order — Tandoor.ai" }] }),
  component: TrackPage,
});

const steps = [
  { key: "received", label: "Received", Icon: Receipt },
  { key: "preparing", label: "In the Kitchen", Icon: ChefHat },
  { key: "ready", label: "Ready", Icon: Bike },
  { key: "completed", label: "Completed", Icon: CheckCircle2 },
] as const;

function TrackPage() {
  const { id } = Route.useSearch();
  const [query, setQuery] = useState(id);
  const orders = useOrders((s) => s.orders);
  const order = orders.find((o) => o.id.toLowerCase() === query.toLowerCase());
  const stepIdx = order ? steps.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl font-semibold">Track your order</h1>
        <div className="mt-6 flex gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Order ID e.g. ORD-1042" className="flex-1 px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        {order ? (
          <div className="mt-10 bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="text-xs text-muted-foreground">Order</div>
                <div className="font-display text-2xl font-semibold">{order.id}</div>
              </div>
              <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">{order.channel}</span>
            </div>

            <div className="mt-8 relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
                <div className="h-full bg-primary transition-all" style={{ width: `${(stepIdx / (steps.length - 1)) * 100}%` }} />
              </div>
              <div className="relative grid grid-cols-4 gap-2">
                {steps.map((s, i) => {
                  const done = i <= stepIdx;
                  return (
                    <div key={s.key} className="flex flex-col items-center text-center">
                      <div className={`size-10 rounded-full grid place-items-center transition ${done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        <s.Icon className="size-5" />
                      </div>
                      <div className={`mt-2 text-xs font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6 space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{it.qty} × {it.name}</span>
                  <span className="text-muted-foreground">₹{it.qty * it.price}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-3 border-t border-border mt-3">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </div>
        ) : query ? (
          <div className="mt-10 text-center text-muted-foreground py-12">No order found with that ID.</div>
        ) : (
          <div className="mt-10 text-center text-muted-foreground py-12">Enter an order ID to start tracking.</div>
        )}
      </div>
    </div>
  );
}
