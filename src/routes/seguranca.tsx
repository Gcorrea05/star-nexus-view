import { createFileRoute } from "@tanstack/react-router";
import { SecurityPanel } from "@/components/ares/SecurityPanel";
import { AlertPanel } from "@/components/ares/AlertPanel";
import { StatusCard } from "@/components/ares/StatusCard";

export const Route = createFileRoute("/seguranca")({ component: () => (
  <div className="space-y-6">
    <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Acesso & Segurança</h1>
    <SecurityPanel />
    <StatusCard title="Alertas de segurança"><AlertPanel /></StatusCard>
  </div>
) });
