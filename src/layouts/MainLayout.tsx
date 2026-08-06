import type { LucideIcon } from "lucide-react";
import { Home, PieChart, User, Target, Wallet } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

interface TabItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Match exacto (para "/" que si no, matchea todo) */
  end?: boolean;
}

const TABS: TabItem[] = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/estadisticas", label: "Estadísticas", icon: PieChart },
  { to: "/presupuesto", label: "Presupuesto", icon: Wallet },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function MainLayout() {
  return (
    <div className="min-h-dvh pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <div className="safe-top">
        <Outlet />
      </div>

      <nav className="glass-sheet fixed inset-x-0 bottom-0 z-10 flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-ios-blue"
                  : "text-[#8E8E93] hover:text-[#3C3C43] dark:hover:text-[#EBEBF5]/80"
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
