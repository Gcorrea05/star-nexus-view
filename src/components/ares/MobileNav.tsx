import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Zap, Wind, Droplets, ShieldCheck, Network, Lock, ScrollText, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dash", icon: LayoutDashboard },
  { to: "/energia", label: "ENE", icon: Zap },
  { to: "/ambiental", label: "ENV", icon: Wind },
  { to: "/recursos", label: "REC", icon: Droplets },
  { to: "/seguranca", label: "SEG", icon: ShieldCheck },
  { to: "/comunicacao", label: "COM", icon: Network },
  { to: "/cybersecurity", label: "CRY", icon: Lock },
  { to: "/logs", label: "LOG", icon: ScrollText },
  { to: "/cenarios", label: "SIM", icon: FlaskConical },
] as const;

export function MobileNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="md:hidden sticky bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur">
      <ul className="flex justify-between overflow-x-auto px-1 py-1.5">
        {items.map((i) => {
          const active = path === i.to;
          return (
            <li key={i.to}>
              <Link to={i.to} className={cn("flex flex-col items-center gap-0.5 rounded px-2 py-1 text-[9px] uppercase tracking-widest", active ? "text-primary" : "text-muted-foreground")}>
                <i.icon className="size-4" />
                <span>{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
