import { useEffect, useState } from "react";
import { getConceptMap } from "../api";

const VB_W = 1000;
const VB_H = 520;

function rectClipPoint(box, towardX, towardY) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const dx = towardX - cx;
  const dy = towardY - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const scaleX = dx !== 0 ? box.w / 2 / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? box.h / 2 / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function Edge({ from, to }) {
  const fromCenter = { x: from.x + from.w / 2, y: from.y + from.h / 2 };
  const toCenter = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  const start = rectClipPoint(from, toCenter.x, toCenter.y);
  const end = rectClipPoint(to, fromCenter.x, fromCenter.y);
  return <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="var(--map-edge)" strokeWidth="1.6" markerEnd="url(#map-arrow)" />;
}

export default function ConceptMapView({ subjectId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    getConceptMap(subjectId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [subjectId]);

  if (error) return <div className="empty-state">Esta materia todavía no tiene mapa conceptual. ({error})</div>;
  if (!data) return <div className="empty-state">Cargando mapa conceptual…</div>;

  const nodeById = Object.fromEntries(data.nodes.map((n) => [n.id, n]));

  return (
    <div className="conceptmap-view">
      <h2>Mapa conceptual</h2>
      {data.intro && <p className="conceptmap-intro">{data.intro}</p>}

      <div className="conceptmap-diagram">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label="Mapa conceptual de la materia">
          <defs>
            <marker id="map-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--map-edge)" />
            </marker>
          </defs>
          {data.edges?.map(([fromId, toId], i) => {
            const from = nodeById[fromId];
            const to = nodeById[toId];
            if (!from || !to) return null;
            return <Edge key={i} from={from} to={to} />;
          })}
          {data.nodes.map((n) => (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill="var(--map-node-bg)" stroke={n.color || "var(--accent)"} strokeWidth="1.4" />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 - (n.subtitle ? 6 : -4)} textAnchor="middle" fontSize="16" fontWeight="600" fill={n.color || "var(--accent)"}>
                {n.title}
              </text>
              {n.subtitle && (
                <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 16} textAnchor="middle" fontSize="11" fill="var(--map-subtitle)">
                  {n.subtitle}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {data.comparisons?.length > 0 && (
        <div className="conceptmap-comparisons">
          <h3>Comparaciones clave</h3>
          <table className="matrix">
            <thead>
              <tr>
                <th>Comparación</th>
                <th>Respuesta corta</th>
              </tr>
            </thead>
            <tbody>
              {data.comparisons.map(([title, detail], i) => (
                <tr key={i}>
                  <td className="matrix-title">{title}</td>
                  <td>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
