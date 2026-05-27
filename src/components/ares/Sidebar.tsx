import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Zap, Wind, Droplets, ShieldCheck, Network, Lock, ScrollText, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSim, statusLabel } from "@/lib/simulation";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/energia", label: "Energia", icon: Zap },
  { to: "/ambiental", label: "Ambiental", icon: Wind },
  { to: "/recursos", label: "Recursos", icon: Droplets },
  { to: "/seguranca", label: "Acesso & Segurança", icon: ShieldCheck },
  { to: "/comunicacao", label: "Comunicação", icon: Network },
  { to: "/cybersecurity", label: "Cybersecurity", icon: Lock },
  { to: "/logs", label: "Logs de Missão", icon: ScrollText },
  { to: "/cenarios", label: "Simulação", icon: FlaskConical },
] as const;

export function AresSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { overall } = useSim();
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur">
      <div className="border-b border-border/60 p-4">
        <div className="text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Mission Control</div>
        <div className="mt-1 text-mono text-xl font-bold tracking-widest text-primary">ARES-BASE</div>
        <div className="mt-1 text-[10px] text-muted-foreground">Centro Terra · Link Colônia</div>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {items.map((i) => {
          const active = path === i.to;
          return (
            <Link key={i.to} to={i.to}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 transition-colors",
                active ? "bg-primary/15 text-primary glow-primary" : "text-foreground/75 hover:bg-sidebar-accent hover:text-foreground",
              )}>
              <i.icon className="size-4" />
              <span className="text-mono uppercase tracking-wider text-[11px]">{i.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/60 p-3">
        <div className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">Status colônia</div>
        <div className="mt-1 text-mono text-sm font-semibold text-primary">{statusLabel(overall.status)}</div>
        <div className="text-[10px] text-muted-foreground">Risco {overall.risk}%</div>
      </div>
    </aside>
  );
}
