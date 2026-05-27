import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export type Severity = "info" | "ok" | "warn" | "high" | "crit";
export type OverallStatus = "OPERACIONAL" | "ATENCAO" | "RISCO_ALTO" | "EMERGENCIA";

export interface LogEntry {
  id: string;
  ts: number;
  module: string;
  severity: Severity;
  message: string;
}

export interface NodeStatus {
  id: string;
  name: string;
  status: "online" | "instavel" | "offline";
  role: "principal" | "reserva" | "modulo";
}

export interface AccessAttempt {
  id: string;
  ts: number;
  user: string;
  sector: string;
  result: "autorizado" | "negado";
}

export interface EncryptedPacket {
  id: string;
  ts: number;
  original: Record<string, unknown>;
  payload: string;
  hash: string;
  status: "transmissao_segura" | "alerta_integridade";
}

export interface SimState {
  // Energy
  battery: number;
  solarGen: number;
  powerDraw: number;
  elecTemp: number;
  panelsOnline: number;
  panelsTotal: number;
  ecoMode: boolean;
  nonEssentialOffline: boolean;
  // Environment
  tempIn: number;
  humidity: number;
  oxygen: number;
  co2: number;
  pressure: number;
  radiation: number;
  // Resources
  water: number;
  oxygenReserve: number;
  food: number;
  airFilters: number;
  recyclingEff: number;
  // Access
  doorsLocked: number;
  doorsTotal: number;
  restrictedPresence: boolean;
  sectorLockdown: string | null;
  accessLog: AccessAttempt[];
  // Communication
  nodes: NodeStatus[];
  latency: number;
  packetLoss: number;
  syncPct: number;
  earthLink: "ok" | "instavel" | "offline";
  activeNode: "principal" | "reserva";
  // Cybersecurity
  encryptionActive: boolean;
  packets: EncryptedPacket[];
  tamperAlert: boolean;
  // Sensors
  offlineSensor: string | null;
  // Misc
  logs: LogEntry[];
  history: { t: number; battery: number; oxygen: number; co2: number; temp: number; pressure: number; radiation: number }[];
  scenario: string;
  lastAlert: LogEntry | null;
}

const HISTORY_LEN = 40;

const initial: SimState = {
  battery: 86,
  solarGen: 72,
  powerDraw: 54,
  elecTemp: 42,
  panelsOnline: 8,
  panelsTotal: 8,
  ecoMode: false,
  nonEssentialOffline: false,
  tempIn: 22.4,
  humidity: 45,
  oxygen: 20.9,
  co2: 410,
  pressure: 101.3,
  radiation: 0.18,
  water: 78,
  oxygenReserve: 82,
  food: 64,
  airFilters: 71,
  recyclingEff: 94,
  doorsLocked: 6,
  doorsTotal: 12,
  restrictedPresence: false,
  sectorLockdown: null,
  accessLog: [
    { id: "a1", ts: Date.now() - 60_000, user: "CMD-01", sector: "Comando", result: "autorizado" },
    { id: "a2", ts: Date.now() - 120_000, user: "ENG-04", sector: "Energia", result: "autorizado" },
  ],
  nodes: [
    { id: "n1", name: "ARES-CORE-01", status: "online", role: "principal" },
    { id: "n2", name: "ARES-CORE-02", status: "online", role: "reserva" },
    { id: "n3", name: "MOD-AMBIENTAL", status: "online", role: "modulo" },
    { id: "n4", name: "MOD-ENERGIA", status: "online", role: "modulo" },
    { id: "n5", name: "MOD-RECURSOS", status: "online", role: "modulo" },
    { id: "n6", name: "MOD-SEGURANCA", status: "online", role: "modulo" },
  ],
  latency: 480,
  packetLoss: 0.4,
  syncPct: 99.6,
  earthLink: "ok",
  activeNode: "principal",
  encryptionActive: true,
  packets: [],
  tamperAlert: false,
  offlineSensor: null,
  logs: [],
  history: [],
  scenario: "Normal",
  lastAlert: null,
};

type Action =
  | { type: "TICK" }
  | { type: "SCENARIO"; key: string }
  | { type: "LOG"; entry: Omit<LogEntry, "id" | "ts"> }
  | { type: "ADD_PACKET"; packet: EncryptedPacket }
  | { type: "RESET" };

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function jitter(v: number, amount: number, min?: number, max?: number) {
  let n = v + (Math.random() - 0.5) * amount;
  if (min !== undefined) n = Math.max(min, n);
  if (max !== undefined) n = Math.min(max, n);
  return n;
}

function makeLog(entry: Omit<LogEntry, "id" | "ts">): LogEntry {
  return { ...entry, id: Math.random().toString(36).slice(2, 9), ts: Date.now() };
}

function fakeHash(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, "0") + Math.random().toString(16).slice(2, 10);
}

function fakeEncrypt(obj: Record<string, unknown>) {
  const raw = JSON.stringify(obj);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  for (let i = 0; i < Math.max(28, raw.length); i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case "RESET":
      return { ...initial, logs: state.logs, history: state.history };
    case "LOG": {
      const log = makeLog(action.entry);
      return {
        ...state,
        logs: [log, ...state.logs].slice(0, 200),
        lastAlert: log.severity === "warn" || log.severity === "high" || log.severity === "crit" ? log : state.lastAlert,
      };
    }
    case "ADD_PACKET":
      return { ...state, packets: [action.packet, ...state.packets].slice(0, 12) };
    case "SCENARIO":
      return applyScenario(state, action.key);
    case "TICK":
      return tick(state);
  }
}

function tick(state: SimState): SimState {
  let s = { ...state };

  // Energy dynamics
  const solarVar = jitter(s.solarGen, 4, 0, 100);
  const drawVar = jitter(s.powerDraw, 3, 10, 120);
  s.solarGen = solarVar;
  s.powerDraw = drawVar;
  const net = (s.solarGen - s.powerDraw) * 0.02;
  s.battery = Math.max(0, Math.min(100, s.battery + net));
  s.elecTemp = jitter(s.elecTemp, 0.6, 25, 95);

  // Environment
  s.tempIn = jitter(s.tempIn, 0.15, 5, 40);
  s.humidity = jitter(s.humidity, 0.6, 10, 90);
  s.oxygen = jitter(s.oxygen, 0.1, 12, 25);
  s.co2 = jitter(s.co2, 8, 350, 5000);
  s.pressure = jitter(s.pressure, 0.15, 70, 110);
  s.radiation = jitter(s.radiation, 0.02, 0.05, 5);

  // Resources slow drain
  s.water = Math.max(0, s.water - rand(0, 0.05));
  s.oxygenReserve = Math.max(0, s.oxygenReserve - rand(0, 0.04));
  s.food = Math.max(0, s.food - rand(0, 0.02));
  s.airFilters = Math.max(0, s.airFilters - rand(0, 0.03));
  s.recyclingEff = jitter(s.recyclingEff, 0.3, 60, 100);

  // Communication
  s.latency = jitter(s.latency, 30, 300, 1500);
  s.packetLoss = Math.max(0, jitter(s.packetLoss, 0.2, 0, 30));
  s.syncPct = jitter(s.syncPct, 0.05, 85, 100);

  // History
  s.history = [
    ...s.history,
    {
      t: Date.now(),
      battery: s.battery,
      oxygen: s.oxygen,
      co2: s.co2,
      temp: s.tempIn,
      pressure: s.pressure,
      radiation: s.radiation,
    },
  ].slice(-HISTORY_LEN);

  return s;
}

function applyScenario(state: SimState, key: string): SimState {
  let s = { ...state, scenario: key };
  switch (key) {
    case "power_drop":
      s.battery = 12;
      s.solarGen = 18;
      s.powerDraw = 70;
      s.elecTemp = 78;
      s.ecoMode = true;
      s.nonEssentialOffline = true;
      break;
    case "pressure_leak":
      s.pressure = 82;
      s.sectorLockdown = "Setor C - Habitat";
      break;
    case "co2_high":
      s.co2 = 2800;
      s.oxygen = 18.4;
      s.airFilters = Math.max(20, s.airFilters - 25);
      break;
    case "sensor_offline":
      s.offlineSensor = "TEMP-04 (Habitat)";
      break;
    case "intrusion":
      s.restrictedPresence = true;
      s.doorsLocked = s.doorsTotal;
      s.accessLog = [
        { id: Math.random().toString(36).slice(2), ts: Date.now(), user: "UNKNOWN-X", sector: "Comando", result: "negado" },
        ...s.accessLog,
      ].slice(0, 12);
      break;
    case "comm_loss":
      s.earthLink = "offline";
      s.latency = 1400;
      s.packetLoss = 22;
      s.activeNode = "reserva";
      s.nodes = s.nodes.map((n) => (n.id === "n1" ? { ...n, status: "offline" } : n));
      break;
    case "tamper":
      s.tamperAlert = true;
      break;
    case "reset":
      return { ...initial, logs: state.logs, history: state.history, scenario: "Normal" };
  }
  return s;
}

function computeStatus(s: SimState): { status: OverallStatus; risk: number } {
  let risk = 0;
  if (s.battery < 30) risk += 15;
  if (s.battery < 15) risk += 25;
  if (s.oxygen < 19.5) risk += 25;
  if (s.co2 > 1500) risk += 20;
  if (s.pressure < 95) risk += 25;
  if (s.radiation > 1) risk += 20;
  if (s.tempIn < 16 || s.tempIn > 28) risk += 10;
  if (s.elecTemp > 75) risk += 10;
  if (s.earthLink === "instavel") risk += 10;
  if (s.earthLink === "offline") risk += 25;
  if (s.restrictedPresence) risk += 15;
  if (s.tamperAlert) risk += 20;
  if (s.offlineSensor) risk += 5;
  if (s.water < 20) risk += 10;
  if (s.oxygenReserve < 20) risk += 10;
  risk = Math.min(100, risk);
  let status: OverallStatus = "OPERACIONAL";
  if (risk >= 70) status = "EMERGENCIA";
  else if (risk >= 45) status = "RISCO_ALTO";
  else if (risk >= 20) status = "ATENCAO";
  return { status, risk };
}

interface SimCtxValue {
  state: SimState;
  overall: ReturnType<typeof computeStatus>;
  trigger: (key: string) => void;
  log: (entry: Omit<LogEntry, "id" | "ts">) => void;
  sendPacket: () => void;
}

const SimCtx = createContext<SimCtxValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const prevRef = useRef<SimState>(initial);

  // Tick loop
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: "TICK" }), 1500);
    return () => clearInterval(id);
  }, []);

  // Auto-detect alerts and reactions
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    const fire = (entry: Omit<LogEntry, "id" | "ts">, toastFn: "info" | "warning" | "error" = "warning") => {
      dispatch({ type: "LOG", entry });
      const t = toast as unknown as Record<string, (m: string, o?: unknown) => void>;
      t[toastFn](entry.message, { description: entry.module });
    };
    if (prev.battery >= 30 && state.battery < 30) fire({ module: "ENERGIA", severity: "warn", message: "Energia abaixo de 30% — Modo economia ativado" });
    if (prev.battery >= 15 && state.battery < 15) fire({ module: "ENERGIA", severity: "crit", message: "Energia crítica < 15% — Desligando módulos não essenciais" }, "error");
    if (prev.elecTemp <= 75 && state.elecTemp > 75) fire({ module: "ENERGIA", severity: "high", message: "Temperatura do sistema elétrico elevada" });
    if (prev.oxygen >= 19.5 && state.oxygen < 19.5) fire({ module: "AMBIENTAL", severity: "high", message: "Oxigênio abaixo do nível seguro" });
    if (prev.co2 <= 1500 && state.co2 > 1500) fire({ module: "AMBIENTAL", severity: "high", message: "CO₂ elevado — ativando ventilação reforçada" });
    if (prev.pressure >= 95 && state.pressure < 95) fire({ module: "AMBIENTAL", severity: "crit", message: "Queda de pressão — isolando setor afetado" }, "error");
    if (prev.radiation <= 1 && state.radiation > 1) fire({ module: "AMBIENTAL", severity: "high", message: "Radiação acima do limite seguro" });
    if ((prev.tempIn >= 16 && prev.tempIn <= 28) && (state.tempIn < 16 || state.tempIn > 28))
      fire({ module: "AMBIENTAL", severity: "warn", message: "Temperatura interna fora da faixa segura" });
    if (!prev.offlineSensor && state.offlineSensor) fire({ module: "SENSORES", severity: "warn", message: `Sensor offline: ${state.offlineSensor} — redundância ativada` });
    if (!prev.restrictedPresence && state.restrictedPresence) fire({ module: "SEGURANCA", severity: "crit", message: "Tentativa de invasão detectada — acesso bloqueado" }, "error");
    if (prev.earthLink === "ok" && state.earthLink !== "ok") fire({ module: "COMUNICACAO", severity: "high", message: "Comunicação com a Terra instável — ativando nó reserva" });
    if (!prev.tamperAlert && state.tamperAlert) fire({ module: "CYBERSECURITY", severity: "crit", message: "Tentativa de adulteração de dados detectada" }, "error");
    if (prev.water >= 20 && state.water < 20) fire({ module: "RECURSOS", severity: "warn", message: "Água potável em nível crítico" });
  }, [state]);

  // Encrypted packet auto-emit
  useEffect(() => {
    const id = setInterval(() => {
      const sensors = [
        { modulo: "ambiental", sensor: "oxigenio", valor: +state.oxygen.toFixed(2) },
        { modulo: "ambiental", sensor: "co2", valor: Math.round(state.co2) },
        { modulo: "energia", sensor: "bateria", valor: Math.round(state.battery) },
        { modulo: "ambiental", sensor: "pressao", valor: +state.pressure.toFixed(2) },
      ];
      const original = sensors[Math.floor(Math.random() * sensors.length)] as Record<string, unknown>;
      const payload = fakeEncrypt(original);
      const hash = fakeHash(JSON.stringify(original));
      dispatch({
        type: "ADD_PACKET",
        packet: {
          id: Math.random().toString(36).slice(2),
          ts: Date.now(),
          original,
          payload,
          hash,
          status: state.tamperAlert ? "alerta_integridade" : "transmissao_segura",
        },
      });
    }, 4000);
    return () => clearInterval(id);
  }, [state.oxygen, state.co2, state.battery, state.pressure, state.tamperAlert]);

  const value = useMemo<SimCtxValue>(
    () => ({
      state,
      overall: computeStatus(state),
      trigger: (key) => {
        dispatch({ type: "SCENARIO", key });
        const labels: Record<string, string> = {
          power_drop: "Simulação: queda de energia",
          pressure_leak: "Simulação: vazamento de pressão",
          co2_high: "Simulação: CO₂ elevado",
          sensor_offline: "Simulação: sensor offline",
          intrusion: "Simulação: tentativa de invasão",
          comm_loss: "Simulação: perda de comunicação com a Terra",
          tamper: "Simulação: adulteração de dados",
          reset: "Operação normal restaurada",
        };
        dispatch({ type: "LOG", entry: { module: "CENARIO", severity: key === "reset" ? "ok" : "high", message: labels[key] ?? key } });
      },
      log: (entry) => dispatch({ type: "LOG", entry }),
      sendPacket: () => {
        const original = { modulo: "ambiental", sensor: "oxigenio", valor: +state.oxygen.toFixed(2), status: state.oxygen < 19.5 ? "alerta" : "ok" };
        dispatch({
          type: "ADD_PACKET",
          packet: {
            id: Math.random().toString(36).slice(2),
            ts: Date.now(),
            original,
            payload: fakeEncrypt(original),
            hash: fakeHash(JSON.stringify(original)),
            status: state.tamperAlert ? "alerta_integridade" : "transmissao_segura",
          },
        });
      },
    }),
    [state],
  );

  return <SimCtx.Provider value={value}>{children}</SimCtx.Provider>;
}

export function useSim() {
  const ctx = useContext(SimCtx);
  if (!ctx) throw new Error("useSim must be used inside SimulationProvider");
  return ctx;
}

export function severityToToken(sev: Severity) {
  switch (sev) {
    case "ok": return "status-ok";
    case "info": return "status-info";
    case "warn": return "status-warn";
    case "high": return "status-high";
    case "crit": return "status-crit";
  }
}

export function statusLabel(s: OverallStatus) {
  return { OPERACIONAL: "Operacional", ATENCAO: "Atenção", RISCO_ALTO: "Risco Alto", EMERGENCIA: "Emergência" }[s];
}