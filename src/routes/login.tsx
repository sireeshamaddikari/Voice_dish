import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/lib/store";
import { ChefHat, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Staff Login — Tandoor.ai" }] }),
  component: LoginPage,
});

function LoginPage() {
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  function go(role: "chef" | "admin") {
    login(role, role === "chef" ? "Chef Ramesh" : "Owner");
    nav({ to: role === "chef" ? "/kitchen" : "/admin" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="font-display text-4xl font-semibold text-center">Staff sign-in</h1>
        <p className="text-center text-muted-foreground mt-2">Demo mode — pick a role to enter the dashboard.</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <button onClick={() => go("chef")} className="group bg-card border border-border rounded-2xl p-8 text-left hover:shadow-warm hover:-translate-y-0.5 transition">
            <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center"><ChefHat className="size-6" /></div>
            <h3 className="mt-5 font-display text-2xl font-semibold">Kitchen / Chef</h3>
            <p className="text-sm text-muted-foreground mt-1">Live order board, status updates.</p>
          </button>
          <button onClick={() => go("admin")} className="group bg-card border border-border rounded-2xl p-8 text-left hover:shadow-warm hover:-translate-y-0.5 transition">
            <div className="size-12 rounded-xl bg-saffron/30 text-foreground grid place-items-center"><Shield className="size-6" /></div>
            <h3 className="mt-5 font-display text-2xl font-semibold">Admin / Owner</h3>
            <p className="text-sm text-muted-foreground mt-1">Analytics, menu, staff, AI workflows.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
