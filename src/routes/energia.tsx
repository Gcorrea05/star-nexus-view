import { createFileRoute } from "@tanstack/react-router";
import { useSim } from "@/lib/simulation";
import { SensorCard } from "@/components/ares/SensorCard";
import { StatusCard } from "@/components/ares/StatusCard";
import { MiniChart } from "@/components/ares/MiniChart";
import { AlertPanel } from "@/components/ares/AlertPanel";
import { Battery, Sun, Plug, Thermometer, SunDim } from "lucide-react";
import type { Severity } from "@/lib/simulation";

export const Route = createFileRoute("/energia")({ component: EnergyPage });

function EnergyPage() {
  const { state } = useSim();
  const sev: Severity = state.battery < 15 ? "crit" : state.battery < 30 ? "high" : "ok";
  const drawSev: Severity = state.powerDraw > 90 ? "crit" : state.powerDraw > 75 ? "high" : "ok";
  const tempSev: Severity = state.elecTemp > 85 ? "crit" : state.elecTemp > 75 ? "high" : "ok";

  return (
    <div className="space-y-6">
      <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Módulo de Energia</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SensorCard icon={Battery} label="Bateria" value={state.battery.toFixed(0)} unit="%" severity={sev} progress={state.battery} />
        <SensorCard icon={Sun} label="Geração solar" value={state.solarGen.toFixed(0)} unit="kW" severity="ok" progress={state.solarGen} />
        <SensorCard icon={Plug} label="Consumo atual" value={state.powerDraw.toFixed(0)} unit="kW" severity={drawSev} progress={state.powerDraw} />
        <SensorCard icon={Thermometer} label="Temp. elétrica" value={state.elecTemp.toFixed(1)} unit="°C" severity={tempSev} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard title="Tendência · Bateria" className="lg:col-span-2">
          <MiniChart data={state.history.map((h) => ({ t: h.t, v: h.battery }))} domain={[0, 100]} unit="%" color="oklch(0.78 0.18 155)" height={180} />
        </StatusCard>
        <StatusCard title="Painéis solares">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: state.panelsTotal }).map((_, i) => {
              const online = i < state.panelsOnline;
              return (
                <div key={i} className={`flex aspect-square items-center justify-center rounded border ${online ? "border-status-ok/40 bg-status-ok/10 text-status-ok" : "border-status-crit/40 bg-status-crit/10 text-status-crit"}`}>
                  <SunDim className="size-5" />
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-mono text-xs text-muted-foreground">{state.panelsOnline}/{state.panelsTotal} painéis online</div>
          {state.ecoMode && <div className="mt-3 rounded border border-status-warn/40 bg-status-warn/10 px-3 py-2 text-mono text-[11px] text-status-warn">Modo economia ATIVO</div>}
          {state.nonEssentialOffline && <div className="mt-2 rounded border border-status-crit/40 bg-status-crit/10 px-3 py-2 text-mono text-[11px] text-status-crit">Módulos não essenciais DESLIGADOS</div>}
        </StatusCard>
      </div>

      <StatusCard title="Alertas de energia">
        <AlertPanel />
      </StatusCard>
    </div>
  );
}
