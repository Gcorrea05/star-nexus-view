import { useSim } from "@/lib/simulation";
import { StatusCard } from "./StatusCard";
import { Lock, ShieldCheck, ShieldAlert, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EncryptionPanel() {
  const { state, sendPacket } = useSim();
  const latest = state.packets[0];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StatusCard
        title="Transmissão Segura · Colônia → Terra"
        action={
          <Button size="sm" variant="outline" onClick={sendPacket} className="h-7 gap-1.5 text-xs">
            <Send className="size-3" /> Enviar pacote
          </Button>
        }
      >
        {latest ? (
          <div className="space-y-3">
            <div>
              <div className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">Mensagem original (sensor)</div>
              <pre className="mt-1 overflow-x-auto rounded border border-border/50 bg-background/60 p-3 text-mono text-[11px] text-foreground/90">{JSON.stringify(latest.original, null, 2)}</pre>
            </div>
            <div>
              <div className="text-mono text-[10px] uppercase tracking-widest text-muted-foreground">Pacote criptografado (AES-256 simulado)</div>
              <pre className="mt-1 overflow-x-auto rounded border border-primary/30 bg-primary/5 p-3 text-mono text-[11px] text-primary">{JSON.stringify({
                origem: "ARES-BASE-MOD-AMBIENTAL",
                destino: "CENTRO-TERRA",
                payloadCriptografado: latest.payload,
                hashIntegridade: latest.hash,
                status: latest.status,
              }, null, 2)}</pre>
            </div>
            <div className={cn("flex items-center gap-2 rounded border px-3 py-2 text-xs",
              state.tamperAlert ? "border-status-crit/50 bg-status-crit/10 text-status-crit" : "border-status-ok/40 bg-status-ok/10 text-status-ok")}>
              {state.tamperAlert ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
              <span className="text-mono uppercase tracking-widest text-[10px]">
                {state.tamperAlert ? "Alerta de adulteração — verificar integridade" : "Integridade verificada · canal seguro"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-mono text-xs text-muted-foreground">Aguardando primeiro pacote…</div>
        )}
      </StatusCard>

      <StatusCard title="Histórico de pacotes">
        <ul className="divide-y divide-border/40">
          {state.packets.length === 0 && <li className="py-3 text-mono text-xs text-muted-foreground">Sem pacotes.</li>}
          {state.packets.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2 text-mono text-[11px]">
              <Lock className={cn("size-3.5", p.status === "transmissao_segura" ? "text-status-ok" : "text-status-crit")} />
              <span className="w-20 text-muted-foreground">{new Date(p.ts).toLocaleTimeString()}</span>
              <span className="flex-1 truncate text-foreground/80">{p.payload.slice(0, 24)}…</span>
              <span className="hidden truncate text-muted-foreground sm:inline">{p.hash.slice(0, 10)}</span>
              <span className={cn("uppercase text-[9px] tracking-widest", p.status === "transmissao_segura" ? "text-status-ok" : "text-status-crit")}>
                {p.status === "transmissao_segura" ? "SEGURO" : "ALERTA"}
              </span>
            </li>
          ))}
        </ul>
      </StatusCard>
    </div>
  );
}
