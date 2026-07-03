import { useEffect, useState } from "react";
import { getQuiz } from "../api";

export default function QuizView({ subjectId, moduleId }) {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQuiz(null);
    setError(null);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    getQuiz(subjectId, moduleId)
      .then(setQuiz)
      .catch((e) => setError(e.message));
  }, [subjectId, moduleId]);

  if (error) return <div className="empty-state">No pude cargar el quiz de este módulo todavía. ({error})</div>;
  if (!quiz) return <div className="empty-state">Cargando quiz…</div>;
  if (quiz.length === 0) return <div className="empty-state">Este módulo todavía no tiene preguntas de quiz.</div>;

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / quiz.length) * 100);
    return (
      <div className="quiz-result">
        <h2>Resultado: {score} / {quiz.length}</h2>
        <p>{pct}% correctas</p>
        <button onClick={restart}>Repetir quiz</button>
      </div>
    );
  }

  const q = quiz[index];

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= quiz.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="quiz-view">
      <div className="flashcard-toolbar">
        <span>
          Pregunta {index + 1} / {quiz.length} · puntaje: {score}
        </span>
      </div>
      <h3 className="quiz-question">{q.question}</h3>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (i === q.answerIndex) cls += " correct";
            else if (i === selected) cls += " incorrect";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={selected !== null}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="quiz-explanation">
          <p>{q.explanation}</p>
          <button onClick={next}>{index + 1 >= quiz.length ? "Ver resultado" : "Siguiente pregunta →"}</button>
        </div>
      )}
    </div>
  );
}
