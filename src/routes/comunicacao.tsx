import { createFileRoute } from "@tanstack/react-router";
import { CommunicationPanel } from "@/components/ares/CommunicationPanel";

export const Route = createFileRoute("/comunicacao")({ component: () => (
  <div className="space-y-6">
    <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Comunicação Distribuída</h1>
    <CommunicationPanel />
  </div>
) });
