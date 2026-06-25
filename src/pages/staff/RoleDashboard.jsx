import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getSession, ROLES } from "../../utils/auth";
import { ROLE_MODULES, ACTION_STATUS, formatLabel } from "../../utils/roleFunctions";
import { PrimaryBtn, GhostBtn } from "../../components/shared/UI";

// ── Role dashboard overview data ─────────────────────────────────────────────
const ROLE_CONTENT = {
  [ROLES.SUPER_ADMIN]: {
    title: "Super Admin Dashboard",
    subtitle: "Full system oversight, admin management, and optimization.",
    metrics: [
      { label: "Total Users",    value: "1,215", trend: "+10.3%" },
      { label: "Active Admins",  value: "12",    trend: "+2" },
      { label: "System Uptime",  value: "99.9%", trend: "Stable" },
      { label: "Open Issues",    value: "3",     trend: "-1" },
    ],
    sections: [
      { title: "Admin Management",    desc: "Create, update, and remove administrator accounts across the library system." },
      { title: "System Optimization", desc: "Review performance metrics and configure global system policies." },
    ],
  },
  [ROLES.ADMINISTRATOR]: {
    title: "Administrator Dashboard",
    subtitle: "Oversee policies, budget, reporting, and system optimization.",
    metrics: [
      { label: "Annual Budget",    value: "$2.4M",  trend: "On track" },
      { label: "Active Policies",  value: "28",     trend: "+3 new" },
      { label: "Monthly Reports",  value: "14",     trend: "Generated" },
      { label: "Member Growth",    value: "+5.3%",  trend: "This quarter" },
    ],
    sections: [
      { title: "Policy Management",      desc: "Define borrowing rules, fine structures, and institutional policies." },
      { title: "Budget & Reporting",     desc: "Track funding allocation, generate reports, and review system KPIs." },
      { title: "Requirements & Feedback",desc: "Collect stakeholder feedback to align the system with library needs." },
    ],
  },
  [ROLES.LIBRARIAN]: {
    title: "Librarian Dashboard",
    subtitle: "Daily operations — cataloging, issuing, returns, fines, and member accounts.",
    metrics: [
      { label: "Books Issued Today",  value: "47",   trend: "+12" },
      { label: "Returns Today",       value: "39",   trend: "Normal" },
      { label: "Active Members",      value: "856",  trend: "+24" },
      { label: "Outstanding Fines",   value: "$340", trend: "12 accounts" },
    ],
    sections: [
      { title: "Cataloging",      desc: "Add, edit, and classify books, journals, and digital resources." },
      { title: "Circulation Desk",desc: "Issue and return books, manage holds and renewals." },
      { title: "Member Accounts", desc: "Register patrons, update membership status, and manage accounts." },
    ],
  },
};

// ── Status badge ─────────────────────────────────────────────────────────────
function statusStyle(status) {
  const s = (status || "").toLowerCase();
  if (["active","approved","verified","deployed","completed","published","resolved","paid",
       "activated","shipped","generated","restored","released","reopened"].includes(s))
    return { backgroundColor: "#dcfce7", color: "#166534" };
  if (["pending","under review","on hold","revised","running"].includes(s))
    return { backgroundColor: "#fef3c7", color: "#92400e" };
  if (["suspended","rejected","closed","retired","withdrawn"].includes(s))
    return { backgroundColor: "#fee2e2", color: "#991b1b" };
  return { backgroundColor: "#f1f5f9", color: "#475569" };
}

function StatusBadge({ status }) {
  return (
    <span style={{ ...statusStyle(status), fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", display: "inline-block", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// ── Action button color ───────────────────────────────────────────────────────
const POSITIVE = new Set(["Approve","Activate","Publish","Deploy","Verify","Resolve","Complete","Paid","Ship","Generate","Run Now","Resume","Restore","Release","Reopen"]);
const NEGATIVE  = new Set(["Archive","Reject","Suspend","Withdraw","Close","Retire","Delete"]);

function actionBtnStyle(action) {
  if (action === "Delete")         return { bg: "#fee2e2", color: "#991b1b" };
  if (action === "Edit")           return { bg: "#dbeafe", color: "#1d4ed8" };
  if (POSITIVE.has(action))        return { bg: "#dcfce7", color: "#166534" };
  if (NEGATIVE.has(action))        return { bg: "#fee2e2", color: "#991b1b" };
  return                                  { bg: "#f1f5f9", color: "#475569" };
}

// ── Full CRUD module page ─────────────────────────────────────────────────────
function ModulePage({ moduleKey }) {
  const mod = ROLE_MODULES[moduleKey];
  if (!mod) return <p style={{ color: "#64748b" }}>Module not found.</p>;

  const [records, setRecords]   = useState(mod.initialRecords || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({});
  const [editId, setEditId]     = useState(null);

  const openAdd = () => {
    setEditId(null);
    setForm({});
    setShowForm(true);
  };

  const openEdit = (record) => {
    const f = {};
    mod.fields.forEach(({ name }) => { f[name] = record[name] ?? ""; });
    setForm(f);
    setEditId(record.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (editId !== null) {
      setRecords(records.map(r => r.id === editId ? { ...r, ...form, updatedAt: "Just now" } : r));
    } else {
      setRecords([...records, { id: Date.now(), ...form, status: "Pending", updatedAt: "Just now" }]);
    }
    setForm({});
    setEditId(null);
    setShowForm(false);
  };

  const handleAction = (id, action) => {
    const newStatus = ACTION_STATUS[action] || action;
    setRecords(records.map(r => r.id === id ? { ...r, status: newStatus, updatedAt: "Just now" } : r));
  };

  const handleDelete = (id) => setRecords(records.filter(r => r.id !== id));

  const cancelForm = () => { setShowForm(false); setEditId(null); setForm({}); };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>{mod.title}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{mod.summary}</p>
        </div>
        {showForm && editId === null
          ? <GhostBtn onClick={cancelForm}>Cancel</GhostBtn>
          : <PrimaryBtn onClick={openAdd}>+ {mod.formTitle}</PrimaryBtn>
        }
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div style={S.formCard}>
          <h4 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
            {editId !== null ? "Edit Record" : mod.formTitle}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
            {mod.fields.map(({ name, label, placeholder }) => (
              <div key={name}>
                <label style={S.label}>{label}</label>
                <input
                  value={form[name] || ""}
                  onChange={e => setForm({ ...form, [name]: e.target.value })}
                  placeholder={placeholder}
                  style={S.input}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <PrimaryBtn onClick={handleSubmit}>
              {editId !== null ? "Save Changes" : "Add Record"}
            </PrimaryBtn>
            <GhostBtn onClick={cancelForm}>Cancel</GhostBtn>
          </div>
        </div>
      )}

      {/* Data table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <th style={S.th}>#</th>
              {mod.columns.map(col => <th key={col} style={S.th}>{formatLabel(col)}</th>)}
              <th style={S.th}>Status</th>
              <th style={S.th}>Updated</th>
              <th style={{ ...S.th, minWidth: "200px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={mod.columns.length + 4} style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                  No records yet. Click <strong>+ {mod.formTitle}</strong> to add one.
                </td>
              </tr>
            )}
            {records.map((record, idx) => (
              <tr key={record.id} style={{ borderTop: "1px solid #f1f5f9", backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ ...S.td, color: "#94a3b8", fontSize: "12px" }}>{idx + 1}</td>
                {mod.columns.map(col => (
                  <td key={col} style={S.td}>{record[col] ?? "—"}</td>
                ))}
                <td style={S.td}><StatusBadge status={record.status} /></td>
                <td style={{ ...S.td, color: "#94a3b8", fontSize: "12px" }}>{record.updatedAt}</td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {mod.actions.map(action => {
                      const { bg, color } = actionBtnStyle(action);
                      return (
                        <button
                          key={action}
                          style={{ ...S.actionBtn, backgroundColor: bg, color }}
                          onClick={() => handleAction(record.id, action)}
                        >
                          {action}
                        </button>
                      );
                    })}
                    <button style={{ ...S.actionBtn, backgroundColor: "#dbeafe", color: "#1d4ed8" }} onClick={() => openEdit(record)}>Edit</button>
                    <button style={{ ...S.actionBtn, backgroundColor: "#fee2e2", color: "#991b1b" }} onClick={() => handleDelete(record.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Root dashboard overview ───────────────────────────────────────────────────
function DashboardOverview({ role }) {
  const content = ROLE_CONTENT[role] || ROLE_CONTENT[ROLES.ADMINISTRATOR];
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{content.title}</h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{content.subtitle}</p>
      </div>

      <div style={S.metricsRow}>
        {content.metrics.map(m => (
          <div key={m.label} style={S.metricCard}>
            <p style={S.metricLabel}>{m.label}</p>
            <h3 style={S.metricValue}>{m.value}</h3>
            <span style={S.trend}>{m.trend}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "32px", display: "grid", gap: "14px" }}>
        {content.sections.map(sec => (
          <div key={sec.title} style={S.sectionCard}>
            <h4 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "700" }}>{sec.title}</h4>
            <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6, fontSize: "14px" }}>{sec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────
export default function RoleDashboard() {
  const session  = getSession();
  const location = useLocation();
  const pageKey  = location.pathname.split("/").pop();
  const isModule = Boolean(ROLE_MODULES[pageKey]);

  if (isModule) return <ModulePage moduleKey={pageKey} />;
  return <DashboardOverview role={session?.role} />;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  formCard: {
    backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px",
    padding: "20px", marginBottom: "24px",
  },
  label: { display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" },
  input: {
    width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1",
    borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box",
  },
  tableWrap: {
    backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0",
    overflow: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700",
    color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
  },
  td: { padding: "12px 16px", color: "#334155", verticalAlign: "middle" },
  actionBtn: {
    border: "none", padding: "4px 10px", borderRadius: "6px",
    fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap",
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  metricCard: {
    padding: "20px", backgroundColor: "#fff",
    borderRadius: "10px", border: "1px solid #e2e8f0",
  },
  metricLabel: { margin: "0 0 8px", fontSize: "13px", color: "#64748b", fontWeight: "600" },
  metricValue: { margin: "0 0 6px", fontSize: "28px", fontWeight: "800", color: "#0f172a" },
  trend: { fontSize: "12px", color: "#10b981", fontWeight: "600" },
  sectionCard: {
    padding: "20px", backgroundColor: "#fff",
    borderRadius: "10px", border: "1px solid #e2e8f0",
  },
};
