import { useState } from "react";
import {
  FIELDS,
  SECTIONS,
  emptyData,
  type EmployeeData,
  type Field,
} from "./fields";

interface Props {
  initial?: EmployeeData;
  existingIds: string[];
  editing: boolean;
  onSubmit: (data: EmployeeData) => void;
  onCancel: () => void;
}

type Errors = Record<string, string>;

function validate(data: EmployeeData, existingIds: string[]): Errors {
  const e: Errors = {};
  const id = data.employeeId.trim();
  if (!id) e.employeeId = "Required";
  else if (existingIds.some((x) => x.toLowerCase() === id.toLowerCase()))
    e.employeeId = "This ID already exists";
  if (!data.fullName.trim()) e.fullName = "Required";

  for (const k of ["mobile", "emergencyMobile"]) {
    const v = data[k].trim();
    if (v && !/^\d{10}$/.test(v.replace(/[\s-]/g, "").replace(/^\+?91/, "")))
      e[k] = "Enter a 10-digit number";
  }
  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    e.email = "Invalid email";
  if (data.pan.trim() && !/^[A-Z]{5}\d{4}[A-Z]$/.test(data.pan.trim()))
    e.pan = "Format: ABCDE1234F";
  if (data.doe && data.doj && data.doe < data.doj)
    e.doe = "Exit is before joining";
  return e;
}

export default function EntryForm({
  initial,
  existingIds,
  editing,
  onSubmit,
  onCancel,
}: Props) {
  const [data, setData] = useState<EmployeeData>(initial ?? emptyData());
  const [errors, setErrors] = useState<Errors>({});

  const set = (f: Field, value: string) => {
    setData((d) => ({ ...d, [f.key]: f.uppercase ? value.toUpperCase() : value }));
    if (errors[f.key]) setErrors((e) => ({ ...e, [f.key]: "" }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate(data, existingIds);
    setErrors(errs);
    const firstKey = FIELDS.find((f) => errs[f.key])?.key;
    if (firstKey) {
      document.getElementById(`f-${firstKey}`)?.focus();
      return;
    }
    const clean: EmployeeData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v.trim()]),
    );
    if (!clean.employeeNameRef) clean.employeeNameRef = clean.fullName;
    onSubmit(clean);
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      {SECTIONS.map((section) => (
        <section key={section} className="card sec">
          <h2>{section}</h2>
          <div className="grid">
            {FIELDS.filter((f) => f.section === section).map((f) => (
              <label
                key={f.key}
                className={`field${f.wide ? " wide" : ""}${errors[f.key] ? " invalid" : ""}`}
              >
                <span className="label">
                  {f.label}
                  {f.required && <em>*</em>}
                </span>
                {f.type === "select" ? (
                  <select
                    id={`f-${f.key}`}
                    value={data[f.key]}
                    onChange={(e) => set(f, e.target.value)}
                  >
                    <option value="">Select…</option>
                    {f.options!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    id={`f-${f.key}`}
                    rows={2}
                    value={data[f.key]}
                    onChange={(e) => set(f, e.target.value)}
                  />
                ) : (
                  <input
                    id={`f-${f.key}`}
                    type={f.type}
                    value={data[f.key]}
                    min={f.type === "number" ? 0 : undefined}
                    placeholder={
                      f.key === "employeeNameRef"
                        ? data.fullName || undefined
                        : f.placeholder
                    }
                    onChange={(e) => set(f, e.target.value)}
                  />
                )}
                {errors[f.key] ? (
                  <small className="error">{errors[f.key]}</small>
                ) : (
                  f.hint && <small>{f.hint}</small>
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="actions">
        <button type="button" className="btn ghost" onClick={onCancel}>
          {editing ? "Cancel" : "Clear"}
        </button>
        <button type="submit" className="btn primary">
          {editing ? "Update entry" : "Save entry"}
        </button>
      </div>
    </form>
  );
}
