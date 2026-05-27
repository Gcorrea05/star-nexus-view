import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function StatusCard({ title, children, className, action }: { title: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("hud-panel rounded-md p-4", className)}>
      <header className="mb-3 flex items-center justify-between border-b border-border/60 pb-2">
        <h3 className="text-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
        {action}
      </header>
      {children}
    </section>
  );
}
