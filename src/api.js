const BASE = import.meta.env.BASE_URL + "data";

async function jsonOrThrow(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getSubjects() {
  return jsonOrThrow(await fetch(`${BASE}/subjects.json`));
}

export async function getModules(subjectId) {
  return jsonOrThrow(await fetch(`${BASE}/${subjectId}/modules.json`));
}

export async function getFlashcards(subjectId, moduleId) {
  return jsonOrThrow(await fetch(`${BASE}/${subjectId}/flashcards/${moduleId}.json`));
}

export async function getQuiz(subjectId, moduleId) {
  return jsonOrThrow(await fetch(`${BASE}/${subjectId}/quiz/${moduleId}.json`));
}

export async function getTheory(subjectId, moduleId) {
  return jsonOrThrow(await fetch(`${BASE}/${subjectId}/theory/${moduleId}.json`));
}

export async function getConceptMap(subjectId) {
  return jsonOrThrow(await fetch(`${BASE}/${subjectId}/conceptmap.json`));
}
