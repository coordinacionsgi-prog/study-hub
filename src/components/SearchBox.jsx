import { useEffect, useRef, useState } from "react";
import { getTheory } from "../api";
import { normalize, buildSnippet } from "../utils/search";

export default function SearchBox({ subjectId, modules, onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const cacheRef = useRef({});
  const boxRef = useRef(null);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setOpen(false);
  }, [subjectId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function ensureCache() {
    if (!cacheRef.current[subjectId]) cacheRef.current[subjectId] = {};
    const cache = cacheRef.current[subjectId];
    const missing = (modules || []).filter((m) => !(m.id in cache));
    if (missing.length === 0) return cache;
    await Promise.all(
      missing.map((m) =>
        getTheory(subjectId, m.id)
          .then((data) => {
            cache[m.id] = data;
          })
          .catch(() => {
            cache[m.id] = null;
          })
      )
    );
    return cache;
  }

  async function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    const q = normalize(value.trim());
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const cache = await ensureCache();
    const matches = [];

    for (const m of modules || []) {
      const data = cache[m.id];
      if (!data) continue;
      data.sections?.forEach((s, i) => {
        const inHeading = normalize(s.h).includes(q);
        const inBody = normalize(`${s.p} ${s.easy || ""}`).includes(q);
        if (inHeading || inBody) {
          matches.push({
            moduleId: m.id,
            moduleTitle: m.title,
            sectionIndex: i,
            heading: s.h,
            snippet: buildSnippet(s.p, q),
            score: inHeading ? 0 : 1,
          });
        }
      });
    }

    matches.sort((a, b) => a.score - b.score);
    setResults(matches.slice(0, 8));
    setOpen(true);
  }

  function handleSelect(result) {
    onNavigate(result.moduleId, result.sectionIndex);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="search-box" ref={boxRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Buscar un tema…"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {open && (
        <div className="search-results">
          {results.length === 0 && <div className="search-empty">Sin resultados</div>}
          {results.map((r, i) => (
            <button key={`${r.moduleId}-${r.sectionIndex}-${i}`} className="search-result" onClick={() => handleSelect(r)}>
              <span className="search-result-module">{r.moduleTitle}</span>
              <span className="search-result-heading">{r.heading}</span>
              <span className="search-result-snippet">{r.snippet}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
