import { useEffect, useState } from "react";
import EntryForm from "./EntryForm";
import Listing from "./Listing";
import type { Employee, EmployeeData } from "./fields";
import { loadEmployees, saveEmployees, uid } from "./utils";

type Tab = "add" | "list";

export default function App() {
  const [tab, setTab] = useState<Tab>("add");
  const [employees, setEmployees] = useState<Employee[]>(loadEmployees);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => saveEmployees(employees), [employees]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const resetForm = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  const handleSubmit = (data: EmployeeData) => {
    if (editing) {
      setEmployees((list) =>
        list.map((e) => (e._id === editing._id ? { ...e, ...data } : e)),
      );
      setToast("Entry updated");
      resetForm();
      setTab("list");
    } else {
      setEmployees((list) => [
        { ...data, _id: uid(), _createdAt: new Date().toISOString() },
        ...list,
      ]);
      setToast("Entry saved");
      resetForm();
    }
  };

  const startEdit = (e: Employee) => {
    setEditing(e);
    setFormKey((k) => k + 1);
    setTab("add");
  };

  const existingIds = employees
    .filter((e) => e._id !== editing?._id)
    .map((e) => e.employeeId);

  return (
    <div className="app">
      <header className="brand">
        <img src="/gkm-header.jpg" alt="GKM College of Engineering and Technology" />
      </header>
      <div className="bar">
        <div className="bar-title">
          <h1>Employee Statutory Records</h1>
          <p>PF &amp; ESI compliance register</p>
        </div>
        <nav className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "add"}
            className={tab === "add" ? "active" : ""}
            onClick={() => setTab("add")}
          >
            {editing ? "Edit Entry" : "Add Entry"}
          </button>
          <button
            role="tab"
            aria-selected={tab === "list"}
            className={tab === "list" ? "active" : ""}
            onClick={() => setTab("list")}
          >
            Entries
            <span className="badge">{employees.length}</span>
          </button>
        </nav>
      </div>

      <main className="page">
        {tab === "add" ? (
          <EntryForm
            key={formKey}
            initial={editing ?? undefined}
            existingIds={existingIds}
            editing={!!editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              resetForm();
              if (editing) setTab("list");
            }}
          />
        ) : (
          <Listing
            employees={employees}
            onEdit={startEdit}
            onDelete={(e) => setEmployees((l) => l.filter((x) => x._id !== e._id))}
            onAdd={() => setTab("add")}
          />
        )}
      </main>

      <footer className="foot">
        © {new Date().getFullYear()} GKM College of Engineering and Technology
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
