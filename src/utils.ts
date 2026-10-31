import { FIELDS, type Employee } from "./fields";
import { sampleEmployees } from "./samples";

const STORAGE_KEY = "gkm.employees.v1";
const SEEDED_KEY = "gkm.samples.seeded";

function seenSampleIds(): Set<string> {
  const v = localStorage.getItem(SEEDED_KEY);
  if (!v) return new Set();
  if (v === "1") return new Set(["sample-1", "sample-2", "sample-3", "sample-4"]); // legacy flag
  try {
    return new Set(JSON.parse(v) as string[]);
  } catch {
    return new Set();
  }
}

export function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Employee[]) : [];
    // Add any example rows that were never offered before. Deleted examples
    // stay deleted. (Pure read: the "seen" list is written in saveEmployees,
    // so this is safe under React StrictMode's double initialisation.)
    const seen = seenSampleIds();
    const fresh = sampleEmployees().filter((s) => !seen.has(s._id));
    return [...stored, ...fresh];
  } catch {
    return [];
  }
}

export function saveEmployees(list: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  localStorage.setItem(
    SEEDED_KEY,
    JSON.stringify(sampleEmployees().map((s) => s._id)),
  );
}

export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : iso;
}

function displayValue(type: string, value: string): string {
  return type === "date" ? formatDate(value) : value;
}

function csvCell(value: string): string {
  let v = value;
  // Guard against spreadsheet formula injection.
  if (/^[=+@\t\r]/.test(v) || (/^-/.test(v) && Number.isNaN(Number(v)))) {
    v = `'${v}`;
  }
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function toCsv(list: Employee[]): string {
  const header = FIELDS.map((f) => csvCell(f.label)).join(",");
  const rows = list.map((e) =>
    FIELDS.map((f) => csvCell(displayValue(f.type, e[f.key] ?? ""))).join(","),
  );
  return [header, ...rows].join("\r\n");
}

export function downloadCsv(list: Employee[]) {
  // BOM so Excel reads UTF-8 (₹) correctly.
  const blob = new Blob(["\ufeff", toCsv(list)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `employees-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
