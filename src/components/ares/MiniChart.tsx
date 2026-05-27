import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, Tooltip } from "recharts";

interface Props {
  data: { t: number; v: number }[];
  color?: string;
  domain?: [number | "auto", number | "auto"];
  height?: number;
  unit?: string;
}

export function MiniChart({ data, color = "oklch(0.78 0.16 210)", domain = ["auto", "auto"], height = 110, unit = "" }: Props) {
  const gid = "g-" + color.replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis domain={domain} hide />
          <Tooltip
            contentStyle={{ background: "oklch(0.16 0.03 250)", border: "1px solid oklch(0.32 0.04 230)", fontSize: 11, fontFamily: "ui-monospace" }}
            labelFormatter={(v) => new Date(v as number).toLocaleTimeString()}
            formatter={(v: number) => [`${v.toFixed(2)}${unit}`, ""]}
          />
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gid})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
