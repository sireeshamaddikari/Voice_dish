import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart, useOrders } from "@/lib/store";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Tandoor.ai" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, clear, total } = useCart();
  const addOrder = useOrders((s) => s.add);
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pay, setPay] = useState<"upi" | "card" | "wallet">("upi");
  const subtotal = total();
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + tax;

  function checkout() {
    if (!name || !phone) return toast.error("Please add your name and phone");
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    addOrder({
      id,
      customer: `${name} (Web)`,
      channel: "web",
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: grand,
      status: "received",
      placedAt: "just now",
    });
    clear();
    toast.success("Order placed! Track it live.");
    nav({ to: "/track", search: { id } });
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <ShoppingBag className="size-12 mx-auto text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl font-semibold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Pick something delicious from our menu.</p>
          <Link to="/menu" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-primary-foreground font-medium">Browse menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_380px] gap-8">
        <div>
          <h1 className="font-display text-4xl font-semibold mb-6">Your order</h1>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4">
                <div className="text-3xl">{i.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-sm text-muted-foreground">₹{i.price} each</div>
                </div>
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                  <button onClick={() => setQty(i.id, i.qty - 1)} className="size-8 grid place-items-center rounded-md hover:bg-card"><Minus className="size-4" /></button>
                  <span className="w-6 text-center font-medium">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} className="size-8 grid place-items-center rounded-md hover:bg-card"><Plus className="size-4" /></button>
                </div>
                <div className="font-semibold w-20 text-right">₹{i.price * i.qty}</div>
                <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-card border border-border rounded-2xl p-6 h-fit sticky top-20">
          <h2 className="font-display text-2xl font-semibold mb-4">Checkout</h2>
          <div className="space-y-3 mb-5">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="text-sm font-medium mb-2">Payment</div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {([["upi", Smartphone, "UPI"], ["card", CreditCard, "Card"], ["wallet", Wallet, "Wallet"]] as const).map(([k, Ic, l]) => (
              <button key={k} onClick={() => setPay(k)} className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition ${pay === k ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}>
                <Ic className="size-4" /> {l}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST 5%</span><span>₹{tax}</span></div>
            <div className="flex justify-between font-display text-xl font-semibold pt-2"><span>Total</span><span>₹{grand}</span></div>
          </div>
          <button onClick={checkout} className="mt-5 w-full rounded-xl bg-primary py-3 text-primary-foreground font-medium shadow-warm hover:scale-[1.01] transition">
            Place order
          </button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">Demo checkout — wire Razorpay/Stripe to go live.</p>
        </aside>
      </div>
    </div>
  );
}
