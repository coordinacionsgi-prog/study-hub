import { useEffect, useState } from "react";
import { getSubjects, getModules } from "./api";
import FlashcardView from "./components/FlashcardView";
import QuizView from "./components/QuizView";
import TheoryView from "./components/TheoryView";
import ConceptMapView from "./components/ConceptMapView";
import DiagramsView from "./components/DiagramsView";
import "./index.css";

const TABS = [
  { id: "teoria", label: "Teoría" },
  { id: "flashcards", label: "Flashcards" },
  { id: "quiz", label: "Quiz" },
];

export default function App() {
  const [subjects, setSubjects] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [modules, setModules] = useState(null);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState(null); // "map" | "diagrams" | null
  const [tab, setTab] = useState("teoria");

  useEffect(() => {
    getSubjects().then(setSubjects).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    setModules(null);
    setSelectedId(null);
    setView(null);
    getModules(subjectId).then(setModules).catch((e) => setError(e.message));
  }, [subjectId]);

  const subject = subjects?.find((s) => s.id === subjectId) || null;
  const selected = modules?.find((m) => m.id === selectedId) || null;

  if (error) {
    return (
      <div className="empty-state" style={{ margin: 40 }}>
        Algo falló cargando los datos. ({error})
      </div>
    );
  }

  if (!subjectId) {
    return (
      <div className="app-shell">
        <main className="main-content" style={{ width: "100%" }}>
          <div className="home-view">
            <h2>¿Qué materia querés estudiar?</h2>
            <p>Elegí una materia para ver su mapa conceptual, diagramas, teoría, flashcards y quizzes.</p>
            <div className="home-grid">
              {subjects?.map((s) => (
                <button key={s.id} className="home-card" onClick={() => setSubjectId(s.id)}>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </button>
              ))}
              {!subjects && <p className="empty-state">Cargando materias…</p>}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="back-link" onClick={() => setSubjectId(null)}>
          ← Cambiar de materia
        </button>
        <h1 className="app-title">{subject?.title}</h1>
        <p className="app-subtitle">Repaso de la materia</p>

        <div className="subject-views">
          <button
            className={`module-item map-item ${view === "map" ? "active" : ""}`}
            onClick={() => {
              setView("map");
              setSelectedId(null);
            }}
          >
            <span className="module-item-title">🗺 Mapa conceptual</span>
            <span className="module-item-unidad">Toda la materia</span>
          </button>
          <button
            className={`module-item map-item ${view === "diagrams" ? "active" : ""}`}
            onClick={() => {
              setView("diagrams");
              setSelectedId(null);
            }}
          >
            <span className="module-item-title">🧭 Diagramas</span>
            <span className="module-item-unidad">Procesos paso a paso</span>
          </button>
        </div>

        <nav className="module-nav">
          {modules?.map((m) => (
            <button
              key={m.id}
              className={`module-item ${!view && m.id === selectedId ? "active" : ""}`}
              onClick={() => {
                setSelectedId(m.id);
                setView(null);
                setTab("teoria");
              }}
            >
              <span className="module-item-title">{m.title}</span>
              <span className="module-item-unidad">{m.unidad}</span>
            </button>
          ))}
          {!modules && <p className="empty-state">Cargando módulos…</p>}
        </nav>
      </aside>

      <main className="main-content">
        {view === "map" && (
          <div className="content-body">
            <ConceptMapView subjectId={subjectId} />
          </div>
        )}

        {view === "diagrams" && (
          <div className="content-body">
            <DiagramsView subjectId={subjectId} />
          </div>
        )}

        {!view && !selected && (
          <div className="home-view">
            <h2>¡Bienvenido!</h2>
            <p>Elegí un módulo de la izquierda para estudiar la teoría, o repasar con flashcards y quizzes.</p>
            <div className="home-grid">
              {modules?.map((m) => (
                <button key={m.id} className="home-card" onClick={() => setSelectedId(m.id)}>
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {!view && selected && (
          <>
            <header className="content-header">
              <div>
                <h2>{selected.title}</h2>
                <p className="content-description">{selected.description}</p>
              </div>
              <div className="tab-bar">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    className={`tab-button ${tab === t.id ? "active" : ""}`}
                    onClick={() => setTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </header>

            <div className="content-body">
              {tab === "teoria" && <TheoryView subjectId={subjectId} moduleId={selected.id} />}
              {tab === "flashcards" && <FlashcardView subjectId={subjectId} moduleId={selected.id} />}
              {tab === "quiz" && <QuizView subjectId={subjectId} moduleId={selected.id} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
