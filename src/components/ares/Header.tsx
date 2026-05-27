import { useEffect, useState } from "react";
import { useSim } from "@/lib/simulation";
import { RiskBadge } from "./RiskBadge";
import { Satellite, Clock } from "lucide-react";

export function AresHeader() {
  const { state, overall } = useSim();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Satellite className="size-5 text-primary" />
        <div>
          <div className="text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">ARES-BASE · Mission Control</div>
          <div className="text-mono text-sm text-foreground/90">
            Cenário ativo: <span className="text-primary">{state.scenario}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <RiskBadge status={overall.status} risk={overall.risk} />
        <div className="hidden items-center gap-2 text-mono text-xs text-muted-foreground md:flex">
          <Clock className="size-3.5" />
          <span>UTC {now.toISOString().slice(11, 19)}</span>
        </div>
      </div>
    </header>
  );
}
