import { createFileRoute } from "@tanstack/react-router";
import { useSim } from "@/lib/simulation";
import { SensorCard } from "@/components/ares/SensorCard";
import { StatusCard } from "@/components/ares/StatusCard";
import { MiniChart } from "@/components/ares/MiniChart";
import { AlertPanel } from "@/components/ares/AlertPanel";
import { Wind, Thermometer, Gauge, Radiation, Droplets, Activity } from "lucide-react";
import type { Severity } from "@/lib/simulation";

export const Route = createFileRoute("/ambiental")({ component: Page });

function Page() {
  const { state } = useSim();
  const oxy: Severity = state.oxygen < 18 ? "crit" : state.oxygen < 19.5 ? "high" : "ok";
  const co2: Severity = state.co2 > 2500 ? "crit" : state.co2 > 1500 ? "high" : state.co2 > 1000 ? "warn" : "ok";
  const press: Severity = state.pressure < 90 ? "crit" : state.pressure < 95 ? "high" : "ok";
  const rad: Severity = state.radiation > 2 ? "crit" : state.radiation > 1 ? "high" : "ok";
  const temp: Severity = state.tempIn < 14 || state.tempIn > 30 ? "high" : state.tempIn < 16 || state.tempIn > 28 ? "warn" : "ok";
  return (
    <div className="space-y-6">
      <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Módulo Ambiental</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SensorCard icon={Thermometer} label="Temperatura interna" value={state.tempIn.toFixed(1)} unit="°C" severity={temp} />
        <SensorCard icon={Droplets} label="Umidade" value={state.humidity.toFixed(0)} unit="%" severity="ok" progress={state.humidity} />
        <SensorCard icon={Wind} label="Oxigênio" value={state.oxygen.toFixed(2)} unit="%" severity={oxy} />
        <SensorCard icon={Activity} label="CO₂" value={state.co2.toFixed(0)} unit="ppm" severity={co2} />
        <SensorCard icon={Gauge} label="Pressão" value={state.pressure.toFixed(1)} unit="kPa" severity={press} />
        <SensorCard icon={Radiation} label="Radiação" value={state.radiation.toFixed(2)} unit="mSv/h" severity={rad} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusCard title="O₂ ao longo do tempo"><MiniChart data={state.history.map((h) => ({ t: h.t, v: h.oxygen }))} unit="%" height={160} color="oklch(0.78 0.18 155)" /></StatusCard>
        <StatusCard title="CO₂ ao longo do tempo"><MiniChart data={state.history.map((h) => ({ t: h.t, v: h.co2 }))} unit="ppm" height={160} color="oklch(0.75 0.19 55)" /></StatusCard>
        <StatusCard title="Pressão"><MiniChart data={state.history.map((h) => ({ t: h.t, v: h.pressure }))} unit="kPa" height={160} color="oklch(0.78 0.16 210)" /></StatusCard>
        <StatusCard title="Radiação"><MiniChart data={state.history.map((h) => ({ t: h.t, v: h.radiation }))} unit="mSv/h" height={160} color="oklch(0.65 0.25 25)" /></StatusCard>
      </div>
      <StatusCard title="Alertas ambientais"><AlertPanel /></StatusCard>
    </div>
  );
}
