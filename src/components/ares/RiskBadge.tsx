import { cn } from "@/lib/utils";
import { statusLabel, type OverallStatus } from "@/lib/simulation";

const map: Record<OverallStatus, { text: string; ring: string; bg: string; extra?: string }> = {
  OPERACIONAL: { text: "text-status-ok", ring: "ring-status-ok/40", bg: "bg-status-ok/10" },
  ATENCAO: { text: "text-status-warn", ring: "ring-status-warn/40", bg: "bg-status-warn/10" },
  RISCO_ALTO: { text: "text-status-high", ring: "ring-status-high/40", bg: "bg-status-high/10" },
  EMERGENCIA: { text: "text-status-crit", ring: "ring-status-crit/50", bg: "bg-status-crit/15", extra: "blink" },
};

export function RiskBadge({ status, risk }: { status: OverallStatus; risk: number }) {
  const m = map[status];
  return (
    <div className={cn("inline-flex items-center gap-3 rounded-md px-4 py-2 ring-1 text-mono uppercase tracking-widest text-xs sm:text-sm", m.ring, m.bg, m.extra)}>
      <span className={cn("inline-block size-2 rounded-full pulse-dot", m.text)} style={{ backgroundColor: "currentColor" }} />
      <span className={cn("font-semibold", m.text)}>{statusLabel(status)}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-foreground/80">RISCO {risk}%</span>
    </div>
  );
}
