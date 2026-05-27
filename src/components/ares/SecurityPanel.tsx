import { useSim } from "@/lib/simulation";
import { StatusCard } from "./StatusCard";
import { DoorClosed, DoorOpen, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function SecurityPanel() {
  const { state } = useSim();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StatusCard title="Status de acesso">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-border/50 bg-background/40 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              {state.doorsLocked === state.doorsTotal ? <DoorClosed className="size-4" /> : <DoorOpen className="size-4" />}
              <span className="text-mono text-[10px] uppercase tracking-widest">Portas</span>
            </div>
            <div className="mt-1 text-mono text-xl text-foreground/90">{state.doorsLocked}/{state.doorsTotal}</div>
            <div className="text-mono text-[10px] text-muted-foreground">Trancadas</div>
          </div>
          <div className={cn("rounded border p-3", state.restrictedPresence ? "border-status-crit/50 bg-status-crit/10" : "border-status-ok/40 bg-status-ok/10")}>
            <div className="flex items-center gap-2">
              {state.restrictedPresence ? <ShieldAlert className="size-4 text-status-crit" /> : <ShieldCheck className="size-4 text-status-ok" />}
              <span className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">Área restrita</span>
            </div>
            <div className={cn("mt-1 text-mono text-sm font-semibold", state.restrictedPresence ? "text-status-crit" : "text-status-ok")}>
              {state.restrictedPresence ? "Presença detectada" : "Sem presença"}
            </div>
          </div>
          <div className="col-span-2 rounded border border-border/50 bg-background/40 p-3">
            <div className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">Bloqueio de setor crítico</div>
            <div className={cn("mt-1 text-mono text-sm", state.sectorLockdown ? "text-status-high" : "text-status-ok")}>
              {state.sectorLockdown ?? "Nenhum setor isolado"}
            </div>
          </div>
        </div>
      </StatusCard>

      <StatusCard title="Tentativas de acesso recentes">
        <ul className="divide-y divide-border/40">
          {state.accessLog.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-2 text-mono text-xs">
              <span className="w-20 text-muted-foreground">{new Date(a.ts).toLocaleTimeString()}</span>
              <span className="text-foreground/90">{a.user}</span>
              <span className="text-muted-foreground">→ {a.sector}</span>
              <span className={cn("ml-auto text-[10px] uppercase tracking-widest", a.result === "autorizado" ? "text-status-ok" : "text-status-crit")}>
                {a.result}
              </span>
            </li>
          ))}
        </ul>
      </StatusCard>
    </div>
  );
}
