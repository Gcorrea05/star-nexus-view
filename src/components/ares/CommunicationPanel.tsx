import { useSim } from "@/lib/simulation";
import { StatusCard } from "./StatusCard";
import { Radio, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommunicationPanel() {
  const { state } = useSim();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StatusCard title="Nós distribuídos da colônia">
        <ul className="space-y-2">
          {state.nodes.map((n) => {
            const color = n.status === "online" ? "text-status-ok" : n.status === "instavel" ? "text-status-warn" : "text-status-crit";
            return (
              <li key={n.id} className="flex items-center gap-3 rounded border border-border/50 bg-background/40 px-3 py-2">
                <span className={cn("inline-block size-2 rounded-full pulse-dot", color)} style={{ backgroundColor: "currentColor" }} />
                <span className="text-mono text-xs text-foreground/90">{n.name}</span>
                <span className="ml-auto text-mono text-[10px] uppercase tracking-widest text-muted-foreground">{n.role}</span>
                <span className={cn("text-mono text-[10px] uppercase tracking-widest", color)}>{n.status}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2 text-mono text-[11px]">
          <div className="rounded border border-border/50 bg-background/40 p-2">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Nó ativo</div>
            <div className="text-primary">{state.activeNode === "principal" ? "ARES-CORE-01" : "ARES-CORE-02 (reserva)"}</div>
          </div>
          <div className="rounded border border-border/50 bg-background/40 p-2">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Continuidade</div>
            <div className="text-status-ok">Failover automático ativo</div>
          </div>
        </div>
      </StatusCard>

      <StatusCard title="Qualidade do link com a Terra">
        <div className="flex items-center gap-3">
          {state.earthLink === "offline" ? (
            <WifiOff className="size-6 text-status-crit" />
          ) : (
            <Wifi className={cn("size-6", state.earthLink === "ok" ? "text-status-ok" : "text-status-warn")} />
          )}
          <div>
            <div className="text-mono text-xs uppercase tracking-widest text-muted-foreground">Link</div>
            <div className={cn("text-mono text-sm font-semibold", state.earthLink === "ok" ? "text-status-ok" : state.earthLink === "instavel" ? "text-status-warn" : "text-status-crit")}>
              {state.earthLink.toUpperCase()}
            </div>
          </div>
          <Radio className="ml-auto size-5 text-primary" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-mono text-[11px]">
          <Metric label="Latência" value={`${state.latency.toFixed(0)} ms`} />
          <Metric label="Perda pacotes" value={`${state.packetLoss.toFixed(1)}%`} />
          <Metric label="Sincronização" value={`${state.syncPct.toFixed(1)}%`} />
        </div>
      </StatusCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/50 bg-background/40 p-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-foreground/90">{value}</div>
    </div>
  );
}
