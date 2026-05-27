import { useSim } from "@/lib/simulation";
import { StatusCard } from "./StatusCard";
import { ShieldCheck, Power, Lock, Wind, RadioTower, SatelliteDish, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function Preventions() {
  const { state } = useSim();
  const items = [
    { active: state.battery < 30, icon: Power, label: "Modo economia ativado", trigger: "Energia < 30%" },
    { active: state.battery < 15, icon: Power, label: "Módulos não essenciais desligados", trigger: "Energia < 15%" },
    { active: !!state.sectorLockdown, icon: Lock, label: `Isolamento de setor: ${state.sectorLockdown ?? "—"}`, trigger: "Queda de pressão" },
    { active: state.co2 > 1500, icon: Wind, label: "Ventilação reforçada", trigger: "CO₂ elevado" },
    { active: !!state.offlineSensor, icon: RadioTower, label: "Redundância de sensor ativada", trigger: "Sensor offline" },
    { active: state.restrictedPresence, icon: KeyRound, label: "Acesso bloqueado em setores críticos", trigger: "Tentativa de invasão" },
    { active: state.earthLink !== "ok", icon: SatelliteDish, label: "Nó reserva ativado para comunicação", trigger: "Link Terra instável" },
    { active: state.tamperAlert, icon: ShieldCheck, label: "Alerta de cybersecurity disparado", trigger: "Dado adulterado" },
  ];
  return (
    <StatusCard title="Sistema de prevenção de falhas">
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((i, idx) => (
          <li key={idx} className={cn("flex items-start gap-3 rounded border px-3 py-2 text-xs",
            i.active ? "border-status-info/50 bg-status-info/10" : "border-border/40 bg-background/30 opacity-60")}>
            <i.icon className={cn("mt-0.5 size-4", i.active ? "text-status-info" : "text-muted-foreground")} />
            <div className="flex-1">
              <div className="text-mono text-[11px] text-foreground/90">{i.label}</div>
              <div className="text-mono text-[10px] text-muted-foreground">Gatilho: {i.trigger}</div>
            </div>
            <span className={cn("text-mono text-[10px] uppercase tracking-widest", i.active ? "text-status-info" : "text-muted-foreground")}>
              {i.active ? "ATIVO" : "standby"}
            </span>
          </li>
        ))}
      </ul>
    </StatusCard>
  );
}
