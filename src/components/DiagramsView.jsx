import { useEffect, useState } from "react";
import { getDiagrams } from "../api";
import NodeGraph from "./NodeGraph";

export default function DiagramsView({ subjectId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    getDiagrams(subjectId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [subjectId]);

  if (error) return <div className="empty-state">Esta materia todavía no tiene diagramas. ({error})</div>;
  if (!data) return <div className="empty-state">Cargando diagramas…</div>;
  if (data.length === 0) return <div className="empty-state">Esta materia todavía no tiene diagramas.</div>;

  return (
    <div className="diagrams-view">
      <h2>Diagramas</h2>
      <p className="conceptmap-intro">Cómo funcionan, paso a paso, los procesos y mecanismos más importantes de la materia.</p>

      <div className="diagrams-list">
        {data.map((d, i) => (
          <div key={i} className="diagram-card">
            <div className="diagram-caption">{d.title}</div>
            {d.description && <p className="diagram-description">{d.description}</p>}
            <div className="conceptmap-diagram">
              <NodeGraph
                nodes={d.nodes}
                edges={d.edges}
                viewBoxW={d.viewBoxW || 720}
                viewBoxH={d.viewBoxH || 260}
                markerId={`diagram-arrow-${i}`}
                ariaLabel={d.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
