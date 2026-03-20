export function toInstagramUrl(handle) {
  if (!handle) return "";
  const trimmed = handle.trim().replace(/^@/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://instagram.com/${trimmed}`;
}

export function toTwitterUrl(handle) {
  if (!handle) return "";
  const trimmed = handle.trim().replace(/^@/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://x.com/${trimmed}`;
}

export function normalizeLinkedIn(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}
