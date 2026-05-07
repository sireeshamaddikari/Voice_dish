import { createFileRoute } from "@tanstack/react-router";
import { useOrders } from "@/lib/store";
import { salesData, channelData } from "@/lib/data";
import { TrendingUp, ShoppingBag, Clock, IndianRupee } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const COLORS = ["oklch(0.62 0.21 32)", "oklch(0.62 0.16 150)", "oklch(0.78 0.17 75)"];

function AdminOverview() {
  const orders = useOrders((s) => s.orders);
  const today = orders.reduce((n, o) => n + o.total, 0);
  const live = orders.filter((o) => o.status !== "completed").length;

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-2 mb-8">
        <div>
          <h1 className="font-display text-4xl font-semibold">Good evening 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's cooking right now.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={IndianRupee} label="Today's Revenue" value={`₹${(today + 41820).toLocaleString()}`} delta="+18%" />
        <Stat icon={ShoppingBag} label="Orders" value={String(orders.length + 142)} delta="+12%" />
        <Stat icon={Clock} label="Live in Kitchen" value={String(live)} delta="now" />
        <Stat icon={TrendingUp} label="Avg Ticket" value="₹486" delta="+₹32" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold">Revenue this week</h3>
            <span className="text-xs text-muted-foreground">₹ thousand</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.21 32)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.62 0.21 32)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="oklch(0.5 0.025 50)" />
                <YAxis stroke="oklch(0.5 0.025 50)" tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.62 0.21 32)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display text-xl font-semibold mb-4">Order channels</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={channelData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {channelData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-sm">
            {channelData.map((c, i) => (
              <div key={c.name} className="flex justify-between">
                <span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: COLORS[i] }} />{c.name}</span>
                <span className="font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mt-6">
        <h3 className="font-display text-xl font-semibold mb-4">Recent orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground tracking-wider">
              <tr><th className="py-2">ID</th><th>Customer</th><th>Channel</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="py-3 font-mono">{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="capitalize">{o.channel}</td>
                  <td className="text-muted-foreground">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                  <td className="font-medium">₹{o.total}</td>
                  <td><span className="text-xs px-2 py-0.5 rounded-full bg-secondary capitalize">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="size-5" /></div>
        <span className="text-xs font-medium text-success">{delta}</span>
      </div>
      <div className="mt-4 font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
