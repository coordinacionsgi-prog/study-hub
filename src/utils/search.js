export function normalize(text) {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function buildSnippet(text, normalizedQuery, radius = 60) {
  const raw = text || "";
  const idx = normalize(raw).indexOf(normalizedQuery);
  if (idx === -1) {
    return raw.length > radius * 2 ? raw.slice(0, radius * 2) + "…" : raw;
  }
  const start = Math.max(0, idx - radius);
  const end = Math.min(raw.length, idx + normalizedQuery.length + radius);
  let snippet = raw.slice(start, end);
  if (start > 0) snippet = "…" + snippet;
  if (end < raw.length) snippet = snippet + "…";
  return snippet;
}
