import { createFileRoute } from "@tanstack/react-router";
import { EncryptionPanel } from "@/components/ares/EncryptionPanel";

export const Route = createFileRoute("/cybersecurity")({ component: () => (
  <div className="space-y-6">
    <h1 className="text-mono text-lg font-bold uppercase tracking-[0.3em]">Cybersecurity & Criptografia</h1>
    <p className="text-xs text-muted-foreground">Toda telemetria crítica enviada da colônia para a Terra é criptografada (AES-256 simulado) e protegida por hash de integridade.</p>
    <EncryptionPanel />
  </div>
) });
