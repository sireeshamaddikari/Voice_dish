import { createFileRoute } from "@tanstack/react-router";
import { useOrders } from "@/lib/store";
import type { OrderStatus } from "@/lib/data";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const statuses: OrderStatus[] = ["received", "preparing", "ready", "completed"];

function AdminOrders() {
  const { orders, updateStatus } = useOrders();
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold mb-6">Orders</h1>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">ID</th><th>Customer</th><th>Channel</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono">{o.id}</td>
                <td>{o.customer}</td>
                <td className="capitalize">{o.channel}</td>
                <td className="text-muted-foreground max-w-xs truncate">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                <td className="font-medium">₹{o.total}</td>
                <td className="px-2">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)} className="bg-secondary rounded-md px-2 py-1 text-xs capitalize">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
