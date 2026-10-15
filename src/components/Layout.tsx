import { createContext, useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Columns3, LayoutDashboard, LogOut, Plus, Users } from "lucide-react";
import { isDemoAccount, useAuth } from "@/auth/AuthProvider";
import { DEMO } from "@/integrations/supabase/client";
import LeadForm from "./LeadForm";
import { Button, Logo, Wordmark } from "./ui";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/leads", label: "Leads", icon: Users, end: false },
  { to: "/app/pipeline", label: "Pipeline", icon: Columns3, end: false },
];

const FormContext = createContext<() => void>(() => {});
export const useOpenLeadForm = () => useContext(FormContext);

export default function Layout() {
  const { user, signOut } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const initial = (user?.email ?? "?")[0].toUpperCase();

  return (
    <FormContext.Provider value={() => setFormOpen(true)}>
      <div className="min-h-dvh lg:pl-60">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-surface/60 px-3 py-5 lg:flex">
          <div className="px-2.5">
            <Wordmark />
          </div>
          <Button className="mx-1 mt-7 justify-start" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> New lead
          </Button>
          <nav className="mt-5 space-y-0.5" aria-label="Main">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors ${isActive ? "bg-fern-soft text-fern" : "text-muted hover:bg-black/[0.04] hover:text-ink"}`
                }
              >
                <Icon size={17} strokeWidth={1.9} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-line bg-surface p-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marigold-soft text-sm font-semibold text-[#8a5a00]">{initial}</span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{isDemoAccount(user) ? "Fernway Landscaping" : "Your workspace"}</div>
                <div className="truncate text-xs text-muted">{user?.email}</div>
              </div>
            </div>
            <button onClick={signOut} className="mt-2 flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-[13px] text-muted hover:bg-black/[0.04] hover:text-ink">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
          <Wordmark />
          <button onClick={signOut} aria-label="Sign out" className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] text-muted">
            <LogOut size={16} />
          </button>
        </header>

        {(DEMO || isDemoAccount(user)) && (
          <div className="border-b border-line bg-marigold-soft/70 px-4 py-1.5 text-center text-xs text-[#7a5200] lg:px-8">
            {DEMO ? "Concept demo with sample data. Changes stay in your browser." : "Shared demo account. The sample data resets every night."}
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-12 lg:pt-8">
          <Outlet />
        </main>

        {/* Mobile tab bar */}
        <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          <div className="grid grid-cols-4">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive ? "text-fern" : "text-faint"}`}
              >
                <Icon size={21} strokeWidth={1.9} />
                {label}
              </NavLink>
            ))}
            <button onClick={() => setFormOpen(true)} className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-fern">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fern text-white">
                <Plus size={17} />
              </span>
              Add
            </button>
          </div>
        </nav>

        {formOpen && <LeadForm onClose={() => setFormOpen(false)} />}
      </div>
    </FormContext.Provider>
  );
}

export { Logo };
