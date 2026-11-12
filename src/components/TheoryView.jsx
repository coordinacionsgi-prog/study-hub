import { useEffect, useState } from "react";
import { getTheory } from "../api";

export default function TheoryView({ subjectId, moduleId, scrollRequest }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    getTheory(subjectId, moduleId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [subjectId, moduleId]);

  useEffect(() => {
    if (!data || !scrollRequest) return;
    if (scrollRequest.moduleId !== moduleId) return;
    const el = document.getElementById(`theory-section-${scrollRequest.sectionIndex}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("theory-section-highlight");
    const timer = setTimeout(() => el.classList.remove("theory-section-highlight"), 2200);
    return () => clearTimeout(timer);
  }, [data, scrollRequest, moduleId]);

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
          <div key={i} id={`theory-section-${i}`} className="theory-section">
            <h3>{s.h}</h3>
            {s.easy && (
              <div className="theory-easy">
                <span className="theory-label">En criollo</span>
                <p>{s.easy}</p>
              </div>
            )}
            {s.figures?.map((f, j) => (
              <figure key={j} className="theory-figure">
                <a href={`${import.meta.env.BASE_URL}img/instalaciones/${f.src}`} target="_blank" rel="noopener noreferrer">
                  <img src={`${import.meta.env.BASE_URL}img/instalaciones/${f.src}`} alt={f.alt || f.caption} loading="lazy" />
                </a>
                <figcaption>{f.caption} <span className="theory-figure-hint">· tocá la imagen para ampliarla</span></figcaption>
              </figure>
            ))}
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
