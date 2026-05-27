import { cn } from "@/lib/utils";
import { statusLabel, type OverallStatus } from "@/lib/simulation";

const map: Record<OverallStatus, { color: string; ring: string }> = {
  OPERACIONAL: { color: "text-status-ok", ring: "ring-status-ok/40 bg-status-ok/10" },
  ATENCAO: { color: "text-status-warn", ring: "ring-status-warn/40 bg-status-warn/10" },
  RISCO_ALTO: { color: "text-status-high", ring: "ring-status-high/40 bg-status-high/10" },
  EMERGENCIA: { color: "text-status-crit", ring: "ring-status-crit/50 bg-status-crit/15 blink" },
};

export function RiskBadge({ status, risk }: { status: OverallStatus; risk: number }) {
  const m = map[status];
  return (
    <div className={cn("inline-flex items-center gap-3 rounded-md px-4 py-2 ring-1 text-mono uppercase tracking-widest text-sm", m.ring)}>
      <span className={cn("inline-block size-2 rounded-full pulse-dot", m.color)} style={{ backgroundColor: "currentColor" }} />
      <span className={cn("font-semibold", m.color)}>{statusLabel(status)}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-foreground/80">RISCO {risk}%</span>
    </div>
  );
}
