import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/staff")({ component: Staff });

const staff = [
  { name: "Ramesh K.", role: "Head Chef", shift: "Evening", status: "active" },
  { name: "Anita S.", role: "Sous Chef", shift: "Evening", status: "active" },
  { name: "Vikram J.", role: "Kitchen Helper", shift: "Morning", status: "off" },
  { name: "Priya M.", role: "Order Manager", shift: "Full day", status: "active" },
];

function Staff() {
  return (
    <div>
      <h1 className="font-display text-4xl font-semibold mb-6">Staff</h1>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Name</th><th>Role</th><th>Shift</th><th>Status</th></tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.name} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td>{s.role}</td>
                <td>{s.shift}</td>
                <td>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${s.status === "active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
