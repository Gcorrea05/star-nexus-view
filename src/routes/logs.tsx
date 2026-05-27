import { createFileRoute } from "@tanstack/react-router";
import { MissionLog } from "@/components/ares/MissionLog";
import { StatusCard } from "@/components/ares/StatusCard";

export const Route = createFileRoute("/logs")({ component: () => (
  <div className="space-y-6">
    <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Logs de Missão</h1>
    <StatusCard title="Histórico cronológico"><MissionLog height={560} /></StatusCard>
  </div>
) });
