import { createFileRoute, redirect, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/store";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Users, Mic, MessageCircle, BarChart3, LogOut, Flame } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Tandoor.ai" }] }),
  beforeLoad: () => {
    const { role } = useAuth.getState();
    if (role !== "admin") throw redirect({ to: "/login" });
  },
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/staff", label: "Staff", icon: Users },
  { to: "/admin/voice", label: "Voice AI", icon: Mic },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { name, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="bg-sidebar text-sidebar-foreground p-4 lg:sticky lg:top-0 lg:h-screen flex flex-col">
          <Link to="/" className="flex items-center gap-2 px-2 py-3">
            <div className="size-9 rounded-xl bg-gradient-hero grid place-items-center"><Flame className="size-5 text-primary-foreground" /></div>
            <span className="font-display text-lg font-semibold">Tandoor.ai</span>
          </Link>
          <nav className="mt-6 space-y-1 flex-1">
            {nav.map((n) => {
              const active = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${active ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"}`}>
                  <n.icon className="size-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-sidebar-border pt-3 mt-3">
            <div className="px-3 py-2 text-xs text-sidebar-foreground/60">Signed in as</div>
            <div className="px-3 text-sm font-medium">{name || "Admin"}</div>
            <button onClick={logout} className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </aside>
        <main className="p-6 lg:p-10 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
