import { createFileRoute } from "@tanstack/react-router";
import { ScenarioControls } from "@/components/ares/ScenarioControls";
import { StatusCard } from "@/components/ares/StatusCard";
import { Preventions } from "@/components/ares/Preventions";
import { MissionLog } from "@/components/ares/MissionLog";

export const Route = createFileRoute("/cenarios")({ component: () => (
  <div className="space-y-6">
    <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Simulação de Cenários</h1>
    <p className="text-xs text-muted-foreground">Cada cenário altera a telemetria, gera alertas, registra eventos e dispara respostas preventivas automáticas.</p>
    <StatusCard title="Controles de simulação"><ScenarioControls /></StatusCard>
    <Preventions />
    <StatusCard title="Eventos disparados"><MissionLog height={320} /></StatusCard>
  </div>
) });
