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
            {s.statement && (
              <div className="callout callout-info theory-statement">
                <span className="theory-label">Enunciado</span>
                <p>{s.statement}</p>
              </div>
            )}
            {s.easy && (
              <div className="theory-easy">
                <span className="theory-label">En criollo</span>
                <p>{s.easy}</p>
              </div>
            )}
            {s.figures?.map((f, j) => {
              const src = `${import.meta.env.BASE_URL}img/${f.dir || "instalaciones"}/${f.src}`;
              return (
                <figure key={j} className="theory-figure">
                  <a href={src} target="_blank" rel="noopener noreferrer">
                    <img src={src} alt={f.alt || f.caption} loading="lazy" />
                  </a>
                  <figcaption>{f.caption} <span className="theory-figure-hint">· tocá la imagen para ampliarla</span></figcaption>
                </figure>
              );
            })}
            {s.p && <p>{s.p}</p>}
            {s.steps?.length > 0 && (
              <ol className="theory-steps">
                {s.steps.map((st, j) => (
                  <li key={j}>{st}</li>
                ))}
              </ol>
            )}
            {s.tables?.map((t, j) => (
              <div key={j} className="theory-table-block">
                {t.title && <div className="theory-table-title">{t.title}</div>}
                <div className="theory-table-wrap">
                  <table className="theory-table">
                    {t.head && (
                      <thead>
                        <tr>
                          {t.head.map((h, k) => (
                            <th key={k}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {t.rows.map((r, k) => (
                        <tr key={k} className={t.strong?.includes(k) ? "is-strong" : undefined}>
                          {r.map((c, m) => (
                            <td key={m} className={m > 0 && /^[−\-–(]?\$?\s?[\d.,]+%?\)?$|^—$/.test(String(c).trim()) ? "num" : undefined}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {t.note && <p className="theory-table-note">{t.note}</p>}
              </div>
            ))}
            {s.after && <p className="theory-after">{s.after}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
