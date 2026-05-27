import { AlertTriangle } from "lucide-react";
import { useSim, sevText, sevBorder, sevBgSoft } from "@/lib/simulation";
import { cn } from "@/lib/utils";

export function AlertPanel() {
  const { state } = useSim();
  const alerts = state.logs.filter((l) => l.severity !== "ok" && l.severity !== "info").slice(0, 6);
  if (alerts.length === 0) {
    return <div className="text-mono text-xs text-muted-foreground">Sem alertas ativos. Todos os sistemas nominais.</div>;
  }
  return (
    <ul className="space-y-2">
      {alerts.map((a) => (
        <li key={a.id} className={cn("flex items-start gap-3 rounded border px-3 py-2 text-xs", sevBorder[a.severity], sevBgSoft[a.severity])}>
          <AlertTriangle className={cn("mt-0.5 size-4", sevText[a.severity])} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={cn("text-mono uppercase tracking-widest text-[10px]", sevText[a.severity])}>{a.module}</span>
              <span className="text-mono text-[10px] text-muted-foreground">{new Date(a.ts).toLocaleTimeString()}</span>
            </div>
            <div className="mt-1 text-foreground/90">{a.message}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
