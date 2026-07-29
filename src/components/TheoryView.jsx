import { useEffect, useState } from "react";
import { getTheory } from "../api";

export default function TheoryView({ subjectId, moduleId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    getTheory(subjectId, moduleId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [subjectId, moduleId]);

  if (error) return <div className="empty-state">Este módulo todavía no tiene teoría resumida. ({error})</div>;
  if (!data) return <div className="empty-state">Cargando teoría…</div>;

  return (
    <div className="theory-view">
      {data.thesis && (
        <div className="theory-thesis">
          <span className="theory-label">La idea central</span>
          <p>{data.thesis}</p>
        </div>
      )}

      {data.examTip && (
        <div className="callout callout-info">
          <span className="theory-label">Qué te van a preguntar</span>
          <p>{data.examTip}</p>
        </div>
      )}

      {data.concepts?.length > 0 && (
        <div className="theory-pillrow">
          {data.concepts.map((c, i) => (
            <span key={i} className="pill">
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="theory-sections">
        {data.sections?.map((s, i) => (
          <div key={i} className="theory-section">
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
