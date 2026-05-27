import { useSim, sevText, sevBg } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MissionLog({ height = 360 }: { height?: number }) {
  const { state } = useSim();
  return (
    <ScrollArea style={{ height }} className="rounded-md border border-border/60 bg-background/40">
      <ul className="divide-y divide-border/40 text-mono text-xs">
        {state.logs.length === 0 && <li className="p-4 text-muted-foreground">Sem eventos.</li>}
        {state.logs.map((l) => (
          <li key={l.id} className="flex items-center gap-3 px-3 py-2">
            <span className="w-20 shrink-0 text-muted-foreground">{new Date(l.ts).toLocaleTimeString()}</span>
            <span className={cn("w-32 shrink-0 uppercase tracking-widest text-[10px]", sevText[l.severity])}>{l.module}</span>
            <span className={cn("inline-block size-1.5 shrink-0 rounded-full", sevBg[l.severity])} />
            <span className="text-foreground/90">{l.message}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
