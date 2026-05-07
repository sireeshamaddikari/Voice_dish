import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { salesData, menu } from "@/lib/data";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

function Analytics() {
  const top = menu.filter((m) => m.popular).map((m, i) => ({ name: m.name, sales: 120 - i * 22 }));
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold mb-6">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display text-xl font-semibold mb-4">Daily orders</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.025 50)" />
                <YAxis stroke="oklch(0.5 0.025 50)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Bar dataKey="orders" fill="oklch(0.62 0.21 32)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display text-xl font-semibold mb-4">Top selling dishes</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={top} layout="vertical">
                <XAxis type="number" stroke="oklch(0.5 0.025 50)" />
                <YAxis type="category" dataKey="name" width={150} stroke="oklch(0.5 0.025 50)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Bar dataKey="sales" fill="oklch(0.78 0.17 75)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: "Peak hour", value: "8:30 PM" },
          { label: "Repeat customers", value: "62%" },
          { label: "Avg sentiment", value: "😊 4.6 / 5" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            <div className="font-display text-2xl font-semibold mt-2">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
