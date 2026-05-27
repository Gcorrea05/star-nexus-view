import { createFileRoute } from "@tanstack/react-router";
import { ResourcePanel } from "@/components/ares/ResourcePanel";

export const Route = createFileRoute("/recursos")({ component: () => (
  <div className="space-y-6">
    <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Módulo de Recursos</h1>
    <ResourcePanel />
  </div>
) });
