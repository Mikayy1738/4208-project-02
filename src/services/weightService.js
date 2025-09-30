const STORAGE_KEY = 'weightEntries';

function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  emitChange();
}

function emitChange() {
  try {
    const event = new CustomEvent('weightEntriesChanged');
    window.dispatchEvent(event);
  } catch {}
}

export function getEntries() {
  const entries = readAll();
  return entries.slice().sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
}

export function addEntry({ date, weight }) {
  const entries = readAll();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date,
    weight: typeof weight === 'number' ? weight : parseFloat(weight)
  };
  entries.push(entry);
  writeAll(entries);
  return entry;
}

export function updateEntry(id, patch) {
  const entries = readAll();
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) return null;
  const next = { ...entries[idx], ...patch };
  if (next.weight != null) next.weight = typeof next.weight === 'number' ? next.weight : parseFloat(next.weight);
  entries[idx] = next;
  writeAll(entries);
  return next;
}

export function removeEntry(id) {
  const entries = readAll();
  const next = entries.filter(e => e.id !== id);
  writeAll(next);
}

export function clearEntries() {
  writeAll([]);
}


