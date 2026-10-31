import { useMemo, useState } from "react";
import { FIELDS, SECTIONS, type Employee } from "./fields";
import { downloadCsv, formatDate } from "./utils";

interface Props {
  employees: Employee[];
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
  onAdd: () => void;
}

export default function Listing({ employees, onEdit, onDelete, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [e.employeeId, e.fullName, e.department, e.designation, e.mobile, e.uan, e.esiNumber]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [employees, query]);

  if (employees.length === 0) {
    return (
      <div className="empty">
        <p>No entries yet</p>
        <button className="btn primary" onClick={onAdd}>
          Add the first entry
        </button>
      </div>
    );
  }

  const stats = [
    { label: "Total employees", value: employees.length },
    { label: "Active", value: employees.filter((e) => e.employmentStatus === "Active").length },
    { label: "ESI applicable", value: employees.filter((e) => e.esiApplicable === "Yes").length },
    { label: "PF KYC pending", value: employees.filter((e) => e.pfKycStatus === "Pending").length },
  ];

  return (
    <>
      <div className="stats">
        {stats.map((st) => (
          <div key={st.label} className="stat">
            <span className="stat-value">{st.value}</span>
            <span className="stat-label">{st.label}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by ID, name, department, UAN…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="count">
          {filtered.length} of {employees.length}
        </span>
        <button className="btn primary" onClick={() => downloadCsv(employees)}>
          Download CSV
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Joined</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e._id} onClick={() => setSelected(e)}>
                <td className="mono">{e.employeeId}</td>
                <td>{e.fullName}</td>
                <td>{e.department || "—"}</td>
                <td>{e.designation || "—"}</td>
                <td>{e.doj ? formatDate(e.doj) : "—"}</td>
                <td>
                  {e.employmentStatus ? (
                    <span className={`pill ${e.employmentStatus === "Active" ? "ok" : "muted"}`}>
                      {e.employmentStatus}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="row-actions" onClick={(ev) => ev.stopPropagation()}>
                  <button className="link" onClick={() => onEdit(e)}>
                    Edit
                  </button>
                  <button
                    className="link danger"
                    onClick={() => {
                      if (confirm(`Delete ${e.fullName} (${e.employeeId})?`)) onDelete(e);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="no-match">
                  No matches
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={(ev) => ev.stopPropagation()}>
            <header>
              <div>
                <h2>{selected.fullName}</h2>
                <span className="mono muted-text">{selected.employeeId}</span>
              </div>
              <button className="link" onClick={() => setSelected(null)}>
                Close
              </button>
            </header>
            <div className="drawer-body">
              {SECTIONS.map((s) => (
                <div key={s} className="dsec">
                  <h3>{s}</h3>
                  <dl>
                    {FIELDS.filter((f) => f.section === s).map((f) => {
                      const v = selected[f.key];
                      return (
                        <div key={f.key} className="row">
                          <dt>{f.label}</dt>
                          <dd>
                            {!v ? (
                              "—"
                            ) : f.type === "date" ? (
                              formatDate(v)
                            ) : f.type === "url" && /^https?:\/\//i.test(v) ? (
                              <a href={v} target="_blank" rel="noreferrer noopener">
                                {v}
                              </a>
                            ) : (
                              v
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              ))}
            </div>
            <footer>
              <button
                className="btn primary"
                onClick={() => {
                  onEdit(selected);
                  setSelected(null);
                }}
              >
                Edit
              </button>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
