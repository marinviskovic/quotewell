import { NavLink } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { LayoutDashboard, Users, LogOut, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
          <Sparkles size={16} />
        </div>
        <span className="text-lg font-bold">QuoteWell</span>
      </div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="truncate px-3 pb-2 text-xs text-slate-400">{user?.email}</div>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
}
