import React, { useState } from "react";
import Home from "./Home";
import { resources } from "../data/Resources";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("userAccount"));

  const filteredResources = resources.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

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
          Library 
          
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Browse books, journals, magazines, and digital resources.
        </p>

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "12px 18px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            marginBottom: "30px",
            outline: "none",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredResources.map((book) => (
            <div
              key={book.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                padding: "20px",
              }}
            >
              <h3>{book.title}</h3>

              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#eef2ff",
                  color: "#3b82f6",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  marginBottom: "12px",
                }}
              >
                {book.type}
              </span>

              <div style={{ marginTop: "15px" }}>
                <span
                  style={{
                    backgroundColor:
                      book.status === "Available"
                        ? "#dcfce7"
                        : "#fee2e2",
                    color:
                      book.status === "Available"
                        ? "#15803d"
                        : "#dc2626",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {book.status}
                </span>
              </div>

              <button
                onClick={() => window.open(book.link, '_blank')}
                style={{
                  marginTop: "18px",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#000",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </Home>
  );
}