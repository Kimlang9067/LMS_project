import React, { useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import Home from "./Home";
import { getEnrichedResources } from "../data/bookMeta";

function CatalogGrid() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredResources = getEnrichedResources().filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
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
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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

            <div style={{ marginTop: "15px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#15803d",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Available
              </span>
              {book.requiresPayment && (
                <span
                  style={{
                    backgroundColor: "#fef3c7",
                    color: "#b45309",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={() => navigate(`/catalog/${book.id}`)}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "gray";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "black";
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Catalog() {
  const user = JSON.parse(localStorage.getItem("userAccount"));
  const { id } = useParams();
  const isDetailView = Boolean(id);

  return (
    <Home isLoggedIn={true} user={user}>
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f5f6f8",
          minHeight: "100%",
        }}
      >
        {!isDetailView && (
          <>
            <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
              Library Catalog
            </h1>
            <p style={{ color: "#666", marginBottom: "25px" }}>
              Browse books, journals, magazines, and digital resources.
            </p>
          </>
        )}

        <Outlet context={{ isDetailView }} />
      </div>
    </Home>
  );
}

export { CatalogGrid };
