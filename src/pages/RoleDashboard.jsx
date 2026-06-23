import React from "react";
import { useLocation } from "react-router-dom";
import { getSession, getRoleLabel, ROLES } from "../utils/auth";

const ROLE_CONTENT = {
  [ROLES.SUPER_ADMIN]: {
    title: "Super Admin Dashboard",
    subtitle: "Full system oversight, admin management, and optimization.",
    metrics: [
      { label: "Total Users", value: "1,215", trend: "+10.3%" },
      { label: "Active Admins", value: "12", trend: "+2" },
      { label: "System Uptime", value: "99.9%", trend: "Stable" },
      { label: "Open Issues", value: "3", trend: "-1" },
    ],
    sections: [
      { title: "Admin Management", desc: "Create, update, and remove administrator accounts across the library system." },
      { title: "System Optimization", desc: "Review performance metrics and configure global system policies." },
    ],
  },
  [ROLES.ADMINISTRATOR]: {
    title: "Administrator Dashboard",
    subtitle: "Oversee policies, budget, reporting, and system optimization.",
    metrics: [
      { label: "Annual Budget", value: "$2.4M", trend: "On track" },
      { label: "Active Policies", value: "28", trend: "+3 new" },
      { label: "Monthly Reports", value: "14", trend: "Generated" },
      { label: "Member Growth", value: "+5.3%", trend: "This quarter" },
    ],
    sections: [
      { title: "Policy Management", desc: "Define borrowing rules, fine structures, and institutional policies." },
      { title: "Budget & Reporting", desc: "Track funding allocation, generate reports, and review system KPIs." },
      { title: "Requirements & Feedback", desc: "Collect stakeholder feedback to align the system with library needs." },
    ],
  },
  [ROLES.LIBRARIAN]: {
    title: "Librarian Dashboard",
    subtitle: "Daily operations — cataloging, issuing, returns, fines, and member accounts.",
    metrics: [
      { label: "Books Issued Today", value: "47", trend: "+12" },
      { label: "Returns Today", value: "39", trend: "Normal" },
      { label: "Active Members", value: "856", trend: "+24" },
      { label: "Outstanding Fines", value: "$340", trend: "12 accounts" },
    ],
    sections: [
      { title: "Cataloging", desc: "Add, edit, and classify books, journals, and digital resources." },
      { title: "Circulation Desk", desc: "Issue and return books, manage holds and renewals." },
      { title: "Member Accounts", desc: "Register patrons, update membership status, and manage accounts." },
    ],
  },
  [ROLES.IT_STAFF]: {
    title: "IT Staff Dashboard",
    subtitle: "Maintain hardware, software, database, backups, and security.",
    metrics: [
      { label: "Server Status", value: "Online", trend: "All green" },
      { label: "Last Backup", value: "2h ago", trend: "Successful" },
      { label: "Security Alerts", value: "0", trend: "Clear" },
      { label: "DB Size", value: "4.2 GB", trend: "+120 MB" },
    ],
    sections: [
      { title: "System Maintenance", desc: "Monitor servers, apply patches, and manage infrastructure." },
      { title: "Database & Backups", desc: "Schedule backups, verify restores, and optimize database performance." },
      { title: "Security", desc: "Manage access controls, audit logs, and security incident response." },
    ],
  },
  [ROLES.DEVELOPER]: {
    title: "Developer Dashboard",
    subtitle: "System updates, feature development, and troubleshooting support.",
    metrics: [
      { label: "App Version", value: "v2.4.1", trend: "Latest" },
      { label: "Open Tickets", value: "7", trend: "3 critical" },
      { label: "Deployments", value: "2", trend: "This week" },
      { label: "Bug Fixes", value: "15", trend: "This sprint" },
    ],
    sections: [
      { title: "System Updates", desc: "Deploy new features, patches, and performance improvements." },
      { title: "Troubleshooting", desc: "Investigate and resolve technical issues reported by staff." },
      { title: "Documentation", desc: "Maintain developer docs and API references for the LMS." },
    ],
  },
  [ROLES.BOOK_SUPPLIER]: {
    title: "Book Supplier Dashboard",
    subtitle: "Provide new books and e-books for renewing or expanding library resources.",
    metrics: [
      { label: "Pending Orders", value: "8", trend: "Awaiting review" },
      { label: "Delivered This Month", value: "142", trend: "+18" },
      { label: "E-Books Submitted", value: "56", trend: "+6" },
      { label: "Active Contracts", value: "3", trend: "Renewals due" },
    ],
    sections: [
      { title: "Submit Materials", desc: "Upload new book titles, ISBNs, and e-book files for library review." },
      { title: "Order Tracking", desc: "Monitor delivery status and fulfillment of purchase orders." },
    ],
  },
  [ROLES.INSTITUTION]: {
    title: "Institutional Dashboard",
    subtitle: "Educational institutions — funding oversight and operational standards.",
    metrics: [
      { label: "Funding Allocated", value: "$1.8M", trend: "FY 2026" },
      { label: "Compliance Score", value: "96%", trend: "Above target" },
      { label: "Partner Schools", value: "24", trend: "+2" },
      { label: "Audit Status", value: "Passed", trend: "Q1 2026" },
    ],
    sections: [
      { title: "Funding Management", desc: "Review budget allocation and funding requests from the library." },
      { title: "Standards Compliance", desc: "Ensure library operations meet required academic and public standards." },
      { title: "Institutional Reports", desc: "Access performance reports and accountability metrics." },
    ],
  },
  [ROLES.COMMUNITY]: {
    title: "Community Dashboard",
    subtitle: "Public access to library resources and community outreach programs.",
    metrics: [
      { label: "Public Events", value: "6", trend: "This month" },
      { label: "Open Resources", value: "320", trend: "Free access" },
      { label: "Community Members", value: "2,400", trend: "+85" },
      { label: "Outreach Programs", value: "4", trend: "Active" },
    ],
    sections: [
      { title: "Public Catalog", desc: "Browse freely available resources and community collections." },
      { title: "Community Programs", desc: "View workshops, reading groups, and public library events." },
    ],
  },
};

const PAGE_TITLES = {
  users: "User Management",
  admins: "Admin Management",
  books: "Book Management",
  notifications: "Notifications",
  policies: "Policy Management",
  budget: "Budget Overview",
  reports: "Reports",
  members: "Member Management",
  fines: "Fines Management",
  health: "System Health",
  backups: "Backup Management",
  security: "Security Center",
  updates: "System Updates",
  support: "Troubleshooting",
  logs: "System Logs",
  materials: "Submit Materials",
  orders: "Order Tracking",
  funding: "Funding Overview",
  standards: "Standards Compliance",
  outreach: "Community Outreach",
};

export default function RoleDashboard() {
  const session = getSession();
  const location = useLocation();
  const role = session?.role;
  const content = ROLE_CONTENT[role] || ROLE_CONTENT[ROLES.ADMINISTRATOR];

  const pageKey = location.pathname.split("/").pop();
  const isSubPage = PAGE_TITLES[pageKey];
  const pageTitle = isSubPage ? PAGE_TITLES[pageKey] : content.title;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "800" }}>{pageTitle}</h2>
        {!isSubPage && (
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{content.subtitle}</p>
        )}
      </div>

      {!isSubPage && (
        <>
          <div style={styles.metricsRow}>
            {content.metrics.map((m) => (
              <div key={m.label} style={styles.card}>
                <h5 style={styles.metricLabel}>{m.label}</h5>
                <h3 style={styles.metricValue}>{m.value}</h3>
                <span style={styles.up}>{m.trend}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "32px", display: "grid", gap: "16px" }}>
            {content.sections.map((section) => (
              <div key={section.title} style={styles.sectionCard}>
                <h4 style={{ margin: "0 0 8px" }}>{section.title}</h4>
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{section.desc}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {isSubPage && (
        <div style={styles.sectionCard}>
          <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
            {getRoleLabel(role)} workspace for <strong>{PAGE_TITLES[pageKey]}</strong>.
            This module supports the operational requirements defined for your role in the library management system.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  metricLabel: { margin: "0 0 8px", fontSize: "13px", color: "#64748b", fontWeight: "600" },
  metricValue: { margin: "0 0 6px", fontSize: "28px", fontWeight: "800" },
  up: { fontSize: "12px", color: "#10b981" },
  sectionCard: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
};
