export default function CurveChart({
  viewBoxW = 620,
  viewBoxH = 340,
  xAxisLabel,
  yAxisLabel,
  origin,
  axisEnd,
  zones = [],
  curves = [],
  points = [],
  labels = [],
  ariaLabel,
}) {
  const o = origin || { x: 60, y: viewBoxH - 40 };
  const e = axisEnd || { x: viewBoxW - 20, y: 25 };

  return (
    <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} role="img" aria-label={ariaLabel}>
      {zones.map((z, i) => (
        <rect key={i} x={z.x1} y={z.y2} width={z.x2 - z.x1} height={z.y1 - z.y2} fill={z.fill || "var(--panel-2)"} opacity={z.opacity ?? 0.45} />
      ))}

      <line x1={o.x} y1={o.y} x2={e.x} y2={o.y} stroke="var(--map-edge)" strokeWidth="1.5" />
      <line x1={o.x} y1={o.y} x2={o.x} y2={e.y} stroke="var(--map-edge)" strokeWidth="1.5" />
      <polygon points={`${e.x},${o.y} ${e.x - 8},${o.y - 4} ${e.x - 8},${o.y + 4}`} fill="var(--map-edge)" />
      <polygon points={`${o.x},${e.y} ${o.x - 4},${e.y + 8} ${o.x + 4},${e.y + 8}`} fill="var(--map-edge)" />

      {xAxisLabel && (
        <text x={(o.x + e.x) / 2} y={viewBoxH - 8} textAnchor="middle" fontSize="12.5" fill="var(--map-subtitle)">
          {xAxisLabel}
        </text>
      )}
      {yAxisLabel && (
        <text
          x={16}
          y={(o.y + e.y) / 2}
          textAnchor="middle"
          fontSize="12.5"
          fill="var(--map-subtitle)"
          transform={`rotate(-90 16 ${(o.y + e.y) / 2})`}
        >
          {yAxisLabel}
        </text>
      )}

      {curves.map((c, i) => (
        <polyline
          key={i}
          points={c.points}
          fill="none"
          stroke={c.color || "var(--accent)"}
          strokeWidth={c.width || 2.5}
          strokeDasharray={c.dashed ? "6,4" : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4.5" fill={p.color || "var(--accent-2)"} />
          {p.label && (
            <text x={p.x + (p.dx ?? 8)} y={p.y + (p.dy ?? -8)} fontSize="11.5" fontWeight="600" fill={p.color || "var(--accent-2)"}>
              {p.label}
            </text>
          )}
        </g>
      ))}

      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          fontSize={l.size || 12}
          fill={l.color || "var(--text)"}
          textAnchor={l.anchor || "start"}
          fontWeight={l.weight || "400"}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}
