import { Button } from "@/components/ui/button";
import { useSim } from "@/lib/simulation";
import { BatteryWarning, Wind, Gauge, RadioTower, ShieldAlert, SatelliteDish, AlertCircle, RefreshCw } from "lucide-react";

const scenarios = [
  { key: "power_drop", label: "Queda de energia", icon: BatteryWarning },
  { key: "pressure_leak", label: "Vazamento de pressão", icon: Gauge },
  { key: "co2_high", label: "CO₂ elevado", icon: Wind },
  { key: "sensor_offline", label: "Sensor offline", icon: RadioTower },
  { key: "intrusion", label: "Tentativa de invasão", icon: ShieldAlert },
  { key: "comm_loss", label: "Perda de comunicação", icon: SatelliteDish },
  { key: "tamper", label: "Adulteração de dados", icon: AlertCircle },
];

export function ScenarioControls() {
  const { trigger } = useSim();
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {scenarios.map((s) => (
        <Button
          key={s.key}
          variant="outline"
          onClick={() => trigger(s.key)}
          className="h-auto justify-start gap-2 border-status-high/40 bg-status-high/5 py-3 text-left text-xs hover:bg-status-high/15 hover:text-status-high"
        >
          <s.icon className="size-4 text-status-high" />
          <span>{s.label}</span>
        </Button>
      ))}
      <Button
        onClick={() => trigger("reset")}
        variant="outline"
        className="h-auto gap-2 border-status-ok/40 bg-status-ok/10 py-3 text-status-ok hover:bg-status-ok/20"
      >
        <RefreshCw className="size-4" />
        Restaurar operação
      </Button>
    </div>
  );
}
