import { useEffect, useState } from "react";
import { getConceptMap } from "../api";
import NodeGraph from "./NodeGraph";

const VB_W = 1000;
const VB_H = 520;

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

  return (
    <div className="conceptmap-view">
      <h2>Mapa conceptual</h2>
      {data.intro && <p className="conceptmap-intro">{data.intro}</p>}

      <div className="conceptmap-diagram">
        <NodeGraph nodes={data.nodes} edges={data.edges} viewBoxW={VB_W} viewBoxH={VB_H} markerId="map-arrow" ariaLabel="Mapa conceptual de la materia" />
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
