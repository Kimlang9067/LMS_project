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

  return (
    <Home isLoggedIn={true} user={user}>
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f5f6f8",
          minHeight: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "8px",
          }}
        >
          About Library
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Learn about our mission, history, and staff.
        </p>

        {/* Mission */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #e5e5e5",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>📚 Our Mission</h2>

          <p style={{ color: "#555", lineHeight: "1.6" }}>
            We provide access to knowledge, books, journals,
            and digital resources for students, researchers,
            and lifelong learners.
          </p>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #e5e5e5",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h2>2.4M+</h2>
            <p>Books & Resources</p>
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #e5e5e5",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h2>150K+</h2>
            <p>Members</p>
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #e5e5e5",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h2>24/7</h2>
            <p>Digital Access</p>
          </div>
        </div>

        {/* History */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #e5e5e5",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>🏛 Library History</h2>

          <p>500 BC — Library Founded</p>
          <p>2030 — Expansion Wing Opened</p>
          <p>2050 — Digital Repository Launched</p>
        </div>

        {/* Staff */}
        <h2 style={{ marginBottom: "15px" }}>
          👥 Staffs Team
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {staff.map((member) => (
            <div
              key={member.name}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                padding: "20px",
              }}
            >
              <h3>{member.name}</h3>
              <p style={{ color: "#666" }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Home>
  );
}