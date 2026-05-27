import { createFileRoute } from "@tanstack/react-router";
import { useSim } from "@/lib/simulation";
import { SensorCard } from "@/components/ares/SensorCard";
import { StatusCard } from "@/components/ares/StatusCard";
import { AlertPanel } from "@/components/ares/AlertPanel";
import { MissionLog } from "@/components/ares/MissionLog";
import { Preventions } from "@/components/ares/Preventions";
import { MiniChart } from "@/components/ares/MiniChart";
import {
  Battery, Wind, Thermometer, Gauge, Radiation, Droplets, Satellite, Lock, Bell, Activity,
} from "lucide-react";
import type { Severity } from "@/lib/simulation";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const { state } = useSim();

  const energySev: Severity = state.battery < 15 ? "crit" : state.battery < 30 ? "high" : "ok";
  const oxySev: Severity = state.oxygen < 18 ? "crit" : state.oxygen < 19.5 ? "high" : "ok";
  const co2Sev: Severity = state.co2 > 2500 ? "crit" : state.co2 > 1500 ? "high" : state.co2 > 1000 ? "warn" : "ok";
  const tempSev: Severity = state.tempIn < 14 || state.tempIn > 30 ? "high" : state.tempIn < 16 || state.tempIn > 28 ? "warn" : "ok";
  const pressSev: Severity = state.pressure < 90 ? "crit" : state.pressure < 95 ? "high" : "ok";
  const radSev: Severity = state.radiation > 2 ? "crit" : state.radiation > 1 ? "high" : state.radiation > 0.5 ? "warn" : "ok";
  const waterSev: Severity = state.water < 20 ? "crit" : state.water < 40 ? "warn" : "ok";
  const linkSev: Severity = state.earthLink === "offline" ? "crit" : state.earthLink === "instavel" ? "warn" : "ok";

  const chartData = state.history.map((h) => ({ t: h.t, v: h.battery }));

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em] text-foreground/90">Visão Geral · Colônia ARES-BASE</h1>
            <p className="mt-1 text-xs text-muted-foreground">Telemetria em tempo real · sensores simulados · canal criptografado com a Terra</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SensorCard icon={Battery} label="Energia" value={state.battery.toFixed(0)} unit="%" severity={energySev} progress={state.battery} />
          <SensorCard icon={Wind} label="Oxigênio" value={state.oxygen.toFixed(2)} unit="%" severity={oxySev} />
          <SensorCard icon={Activity} label="CO₂" value={state.co2.toFixed(0)} unit="ppm" severity={co2Sev} />
          <SensorCard icon={Thermometer} label="Temp. interna" value={state.tempIn.toFixed(1)} unit="°C" severity={tempSev} />
          <SensorCard icon={Gauge} label="Pressão" value={state.pressure.toFixed(1)} unit="kPa" severity={pressSev} />
          <SensorCard icon={Radiation} label="Radiação" value={state.radiation.toFixed(2)} unit="mSv/h" severity={radSev} />
          <SensorCard icon={Droplets} label="Água potável" value={state.water.toFixed(0)} unit="%" severity={waterSev} progress={state.water} />
          <SensorCard icon={Satellite} label="Link Terra" value={state.earthLink.toUpperCase()} severity={linkSev} sublabel={`${state.latency.toFixed(0)} ms · ${state.packetLoss.toFixed(1)}% loss`} />
          <SensorCard icon={Lock} label="Criptografia" value={state.encryptionActive ? "ATIVA" : "OFF"} severity={state.encryptionActive ? "ok" : "crit"} sublabel="AES-256 · canal verificado" />
          <SensorCard icon={Bell} label="Último alerta" value={state.lastAlert ? state.lastAlert.module : "—"} severity={state.lastAlert?.severity ?? "ok"} sublabel={state.lastAlert ? state.lastAlert.message : "Sem ocorrências"} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <StatusCard title="Tendência · Energia (últimos ciclos)" className="lg:col-span-2">
          <MiniChart data={chartData} domain={[0, 100]} unit="%" />
        </StatusCard>
        <StatusCard title="Alertas ativos">
          <AlertPanel />
        </StatusCard>
      </section>

      <Preventions />

      <StatusCard title="Últimos eventos">
        <MissionLog height={260} />
      </StatusCard>
    </div>
  );
}
