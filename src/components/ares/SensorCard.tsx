import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Severity } from "@/lib/simulation";
import { sevText, sevBg } from "@/lib/simulation";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  severity?: Severity;
  trend?: string;
  sublabel?: string;
  progress?: number;
}

export function SensorCard({ icon: Icon, label, value, unit, severity = "ok", trend, sublabel, progress }: Props) {
  return (
    <div className="hud-panel rounded-md p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className={cn("size-4", sevText[severity])} />
          <span className="text-mono text-[11px] uppercase tracking-widest">{label}</span>
        </div>
        {trend && <span className="text-mono text-[10px] text-muted-foreground">{trend}</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={cn("text-mono text-3xl font-semibold tabular-nums", sevText[severity])}>{value}</span>
        {unit && <span className="text-mono text-xs text-muted-foreground">{unit}</span>}
      </div>
      {sublabel && <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div>}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className={cn("h-full transition-all", sevBg[severity])} style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </div>
      )}
    </div>
  );
}
