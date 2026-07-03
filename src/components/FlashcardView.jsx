import { useEffect, useState } from "react";
import { getFlashcards } from "../api";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardView({ subjectId, moduleId }) {
  const [cards, setCards] = useState(null);
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    setCards(null);
    setError(null);
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
    getFlashcards(subjectId, moduleId)
      .then((data) => {
        setCards(data);
        setOrder(data.map((_, i) => i));
      })
      .catch((e) => setError(e.message));
  }, [subjectId, moduleId]);

  const current = cards && order.length ? cards[order[index]] : null;
  const progress = cards ? Math.round(((index + 1) / order.length) * 100) : 0;

  const markKnown = (isKnown) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (isKnown) next.add(order[index]);
      else next.delete(order[index]);
      return next;
    });
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, order.length - 1));
  };
  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  };
  const doShuffle = () => {
    setOrder(shuffle(cards.map((_, i) => i)));
    setIndex(0);
    setFlipped(false);
  };

  if (error) return <div className="empty-state">No pude cargar las flashcards de este módulo todavía. ({error})</div>;
  if (!cards) return <div className="empty-state">Cargando flashcards…</div>;
  if (cards.length === 0) return <div className="empty-state">Este módulo todavía no tiene flashcards.</div>;

  return (
    <div className="flashcard-view">
      <div className="flashcard-toolbar">
        <span>
          {index + 1} / {order.length} · sabidas: {known.size}
        </span>
        <button onClick={doShuffle}>Mezclar</button>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className={`flip-card ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped((f) => !f)}>
        <div className="flip-card-inner">
          <div className="flip-card-face flip-card-front">
            <span className="flip-card-label">Pregunta</span>
            <p>{current.front}</p>
          </div>
          <div className="flip-card-face flip-card-back">
            <span className="flip-card-label">Respuesta</span>
            <p>{current.back}</p>
          </div>
        </div>
      </div>
      <p className="flip-hint">Tocá la tarjeta para dar vuelta</p>

      <div className="flashcard-actions">
        <button onClick={goPrev} disabled={index === 0}>
          ← Anterior
        </button>
        <button className="btn-bad" onClick={() => markKnown(false)}>
          No la sé
        </button>
        <button className="btn-good" onClick={() => markKnown(true)}>
          La sé ✓
        </button>
        <button onClick={goNext} disabled={index === order.length - 1}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
