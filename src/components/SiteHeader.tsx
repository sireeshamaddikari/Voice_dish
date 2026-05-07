import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Flame, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useAuth } from "@/lib/store";

export function SiteHeader() {
  const items = useCart((s) => s.items);
  const auth = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cartCount = mounted ? items.reduce((n, i) => n + i.qty, 0) : 0;
  const role = mounted ? auth.role : null;
  const name = mounted ? auth.name : "";

  const nav = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/voice", label: "Voice Order" },
    { to: "/track", label: "Track Order" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-9 rounded-xl bg-gradient-hero grid place-items-center shadow-warm group-hover:scale-105 transition">
            <Flame className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Tandoor<span className="text-primary">.</span>ai</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${path === n.to ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary transition">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold grid place-items-center">{cartCount}</span>
            )}
          </Link>
          <Link to={role ? (role === "chef" ? "/kitchen" : "/admin") : "/login"} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary transition">
            <User className="size-4" />
            <span className="hidden sm:inline">{role ? name : "Staff Login"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
