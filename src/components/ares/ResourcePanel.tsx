import { useSim } from "@/lib/simulation";
import { Droplets, Wind, Apple, Filter, Recycle } from "lucide-react";
import { SensorCard } from "./SensorCard";
import { StatusCard } from "./StatusCard";
import type { Severity } from "@/lib/simulation";

export function ResourcePanel() {
  const { state } = useSim();
  const sev = (v: number): Severity => (v < 15 ? "crit" : v < 30 ? "high" : v < 50 ? "warn" : "ok");
  const worst = Math.min(state.water, state.oxygenReserve, state.food, state.airFilters);
  const autonomyDays = Math.round((worst / 100) * 45);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <SensorCard icon={Droplets} label="Água potável" value={state.water.toFixed(1)} unit="%" severity={sev(state.water)} progress={state.water} />
      <SensorCard icon={Wind} label="Oxigênio (reserva)" value={state.oxygenReserve.toFixed(1)} unit="%" severity={sev(state.oxygenReserve)} progress={state.oxygenReserve} />
      <SensorCard icon={Apple} label="Alimentos" value={state.food.toFixed(1)} unit="%" severity={sev(state.food)} progress={state.food} />
      <SensorCard icon={Filter} label="Filtros de ar" value={state.airFilters.toFixed(1)} unit="%" severity={sev(state.airFilters)} progress={state.airFilters} />
      <SensorCard icon={Recycle} label="Eficiência reciclagem" value={state.recyclingEff.toFixed(0)} unit="%" severity={state.recyclingEff < 80 ? "warn" : "ok"} progress={state.recyclingEff} />
      <StatusCard title="Autonomia estimada">
        <div className="flex items-baseline gap-2">
          <span className="text-mono text-4xl font-bold text-primary">{autonomyDays}</span>
          <span className="text-mono text-xs text-muted-foreground">dias</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Calculado com base no recurso mais escasso e na eficiência atual de reciclagem.</p>
      </StatusCard>
    </div>
  );
}
