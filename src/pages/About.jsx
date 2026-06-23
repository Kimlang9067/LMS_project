import React from "react";
import Home from "./Home";

export default function About() {
  const user = JSON.parse(localStorage.getItem("userAccount"));

  const staff = [
    { name: "Ph.D. Nguon Nuongswayumphou", role: "FrontEnd Development" },
    { name: "Ph.D. Cheat Kimlang", role: "Document Writer" },
    { name: "Ph.D. Phoeut Visot", role: "BackEnd Development" },
    { name: "Ph.D. Chen Fouchea", role: "Testing" },
    { name: "Ph.D. Cheat Kimly", role: "Testing" },
  ];

  const directStakeholders = [
    {
      title: "Administrators",
      icon: "🏛️",
      description:
        "Administrators oversee policies, budget, reporting, and system optimization of the library management system. They provide requirements and feedback throughout the development process to ensure the system aligns with institutional needs.",
    },
    {
      title: "Librarians",
      icon: "📋",
      description:
        "Librarians manage cataloging, book issuing and returning, fines, and member accounts. They rely on the system for daily operations and efficiency in serving patrons.",
    },
    {
      title: "Members / Patrons",
      icon: "👥",
      description:
        "Members include students, researchers, teachers, and public users who borrow library resources. They use the online web-based interface to register, search, reserve, or renew items.",
    },
    {
      title: "IT Staff / System Administrators",
      icon: "🖥️",
      description:
        "IT staff maintain the system's hardware, software, database, backups, and security. They handle technical issues and system updates to keep the platform running reliably.",
    },
    {
      title: "Developers",
      icon: "💻",
      description:
        "Developers are the creators of the Library Management System. They provide updates, new features, and troubleshooting to support the system over time.",
    },
    {
      title: "Book Suppliers",
      icon: "📦",
      description:
        "Book suppliers provide new materials such as books and e-books for renewing or expanding the library's collection and digital resources.",
    },
  ];

  const institutionalStakeholders = [
    {
      title: "Educational Institutions",
      icon: "🎓",
      description:
        "Schools, universities, and government bodies provide funding for the library. They ensure library operations meet required academic and public service standards.",
    },
  ];

  const indirectStakeholders = [
    {
      title: "Community Members",
      icon: "🌍",
      description:
        "The system provides benefits to individuals in the wider community through shared knowledge, public access programs, and outreach services.",
    },
  ];

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e5e5",
    padding: "20px",
  };

  return (
    <Home isLoggedIn={true} user={user}>
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f5f6f8",
          minHeight: "100%",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
          About Library
        </h1>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Learn about our mission, history, stakeholders, and staff.
        </p>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2>📚 Our Mission</h2>
          <p style={{ color: "#555", lineHeight: "1.6" }}>
            We provide access to knowledge, books, journals, and digital resources
            for students, researchers, and lifelong learners.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <h2>2.4M+</h2>
            <p>Books & Resources</p>
          </div>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <h2>150K+</h2>
            <p>Members</p>
          </div>
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <h2>24/7</h2>
            <p>Digital Access</p>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2>🏛 Library History</h2>
          <p>500 BC — Library Founded</p>
          <p>2030 — Expansion Wing Opened</p>
          <p>2050 — Digital Repository Launched</p>
        </div>

        <h2 style={{ marginBottom: "15px" }}>🤝 Direct Stakeholders</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {directStakeholders.map((s) => (
            <div key={s.title} style={cardStyle}>
              <h3 style={{ marginBottom: "8px" }}>
                {s.icon} {s.title}
              </h3>
              <p style={{ color: "#555", lineHeight: "1.6", fontSize: "14px" }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: "15px" }}>🏫 Institutional Stakeholders</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {institutionalStakeholders.map((s) => (
            <div key={s.title} style={cardStyle}>
              <h3 style={{ marginBottom: "8px" }}>
                {s.icon} {s.title}
              </h3>
              <p style={{ color: "#555", lineHeight: "1.6", fontSize: "14px" }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: "15px" }}>🌐 Indirect Stakeholders</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {indirectStakeholders.map((s) => (
            <div key={s.title} style={cardStyle}>
              <h3 style={{ marginBottom: "8px" }}>
                {s.icon} {s.title}
              </h3>
              <p style={{ color: "#555", lineHeight: "1.6", fontSize: "14px" }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: "15px" }}>👥 Staff Team</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {staff.map((member) => (
            <div key={member.name} style={cardStyle}>
              <h3>{member.name}</h3>
              <p style={{ color: "#666" }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </Home>
  );
}
