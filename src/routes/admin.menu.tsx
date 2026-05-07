import { createFileRoute } from "@tanstack/react-router";
import { menu } from "@/lib/data";
import { Pencil, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/menu")({ component: AdminMenu });

function AdminMenu() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl font-semibold">Menu</h1>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-primary-foreground text-sm font-medium"><Plus className="size-4" /> Add dish</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className="text-3xl">{m.emoji}</div>
              <button className="text-muted-foreground hover:text-foreground"><Pencil className="size-4" /></button>
            </div>
            <h3 className="mt-3 font-medium">{m.name}</h3>
            <p className="text-xs text-muted-foreground">{m.category}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold">₹{m.price}</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-secondary peer-checked:bg-primary transition" />
                <div className="absolute left-0.5 top-0.5 size-4 rounded-full bg-card transition peer-checked:translate-x-4" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
