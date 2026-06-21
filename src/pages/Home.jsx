import React from "react";
import { Link, useNavigate } from "react-router-dom";

function LibraryBookLogo({ size = 110 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Bottom Book */}
      <g transform="translate(18,130) rotate(8 90 22)">
        <rect x="18" y="8" rx="18" ry="18" width="150" height="40" fill="#173F7A" />
        <rect x="10" y="0" rx="18" ry="18" width="150" height="40" fill="#F6A313" />
        <path d="M20 12H145" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M20 20H140" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 28H132" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Middle Blue Book */}
      <g transform="translate(35,92) rotate(-8 75 20)">
        <rect x="18" y="8" rx="16" ry="16" width="128" height="36" fill="#173F7A" />
        <rect x="10" y="0" rx="16" ry="16" width="128" height="36" fill="#1C9AD6" />
        <path d="M20 10H122" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <path d="M20 18H118" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 26H112" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Thin Orange Book */}
      <g transform="translate(48,64) rotate(8 64 14)">
        <rect x="14" y="6" rx="12" ry="12" width="112" height="24" fill="#F6A313" />
        <rect x="8" y="0" rx="12" ry="12" width="112" height="24" fill="#FFD45E" opacity="0.25" />
      </g>

      {/* Top Dark Book */}
      <g transform="translate(52,24) rotate(-12 70 28)">
        <path d="M12 20L85 0L150 18L76 38L12 20Z" fill="#173F7A" />
        <path d="M22 24L78 36L143 18" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M18 18L76 32L137 16" stroke="#0F2D5C" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}

const navItems = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Catalog", icon: "📚" },
  { label: "Circulation", icon: "📋" },
  //{ label: "Reports", icon: "📊" },
  { label: "About", icon: "ℹ️" },
  { label: "Help",        icon: "❓" },
];


const hours = [
  { day: "Monday – Friday", time: "08:00 AM – 10:00 PM" },
  { day: "Saturday", time: "10:00 AM – 06:00 PM" },
  { day: "Sunday", time: "12:00 PM – 05:00 PM" },
];

export default function Home(props) {
  const { isLoggedIn = false, user = null, sidebarExtension = null, children = null, showNav = true,} = props;
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === "/";
  const unreadCount = parseInt(localStorage.getItem('unreadCount') || '0');

  const hover = (on, off) => ({
    onMouseEnter: (e) => e.target.style.backgroundColor = on,
    onMouseLeave: (e) => e.target.style.backgroundColor = off,
  });

  return (
    <div style={s.app}>
      {/* SIDEBAR */}
      {!isHomePage && (
        <aside style={s.sidebar}>
          <div>
            <div style={s.brandRow}>
              <div style={s.logoWrap}>
                <LibraryBookLogo size={80} />
              </div>
              <div style={s.brandTextWrap}>
                <h1 style={s.brandTitle}>Library Management</h1>
                <h2 style={s.brandSubtitle}>System</h2>
                <p style={s.brandTagline}>Institutional of Resource</p>
              </div>
            </div>
            
            {showNav && !isHomePage && (
              <nav style={s.nav}>
                {navItems.map((item) => {
                  let targetPath = `/${item.label.toLowerCase()}`;

                  if (item.label === "Dashboard") {
                    targetPath = isLoggedIn ? "/userdashboard" : "/";
                  }

                  if (item.label === "Help") {
                    targetPath = "/help";
                  }

                  const isActive = currentPath === targetPath;

                  return (
                    <div
                      key={item.label}
                      onClick={() => navigate(targetPath)}
                      style={{
                        ...s.navItem,
                        ...(isActive ? s.navItemActive : {}),
                        transition: "0.2s",
                        cursor: "pointer",
                      }}

                      // ✅ ADD HOVER EFFECT HERE
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#5b5b5b";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          isActive ? s.navItemActive.backgroundColor || "#626262" : "transparent";
                      }}
                    >
                      <span style={s.navIcon}>{item.icon}</span>
                      {item.label}
                    </div>
                  );
                })}
              </nav>
            )}
          </div>
          
          {/* BOTTOM UTILITY BLOCK */}
          <div style={s.flexCol}>
            {/* Injects dynamic layout items cleanly here */}
            {sidebarExtension}
          </div>
          
        </aside>
      )}
      {/* MAIN CONTENT WINDOW */}
      <main style={s.main}>
        {/* TOPBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          backgroundColor: "#000000",
          borderBottom: "1px solid #e5e5e5",
        }}
      >

        {/* LEFT SIDE: SHOW LOGO ONLY ON HOME */}
        {isHomePage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "black",
              padding: "10px 18px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <LibraryBookLogo size={90} />
            <div>
              <div style={{ fontWeight: "800", fontSize: "16px", color: "#ffffff"}}>
                Library Management 
              </div>
              <div style={{  alignItems: "center", fontWeight: "800", fontSize: "16px", color: "#ff0000"}}>
                System
              </div>
              <div style={{ fontSize: "12px", color: "#ffffff" }}>
                Institutional Resource Portal
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDE: LOGIN / USER */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "auto" }}>
          {isLoggedIn ? (
            <>
              {/* NOTIFICATION BELL */}
              <div
                onClick={() => navigate("/messages")}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                title="Messages"
              >
                🔔
                {unreadCount > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "10px",
                    backgroundColor: "#ef4444",
                    border: "2px solid #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: "700",
                    color: "#fff",
                    padding: "0 3px",
                  }}>
                    {unreadCount}
                  </div>
                )}
              </div>

              {/* PROFILE */}
              <div
                onClick={() => navigate("/profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  padding: "6px 10px",
                  borderRadius: "10px",
                  transition: "background-color 0.2s",
                  borderBottom: "1px solid #e5e5e5",
                  borderLeft: "1px solid #e5e5e5",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "600", color: "#fff" }}>
                    {user?.fullName || "User"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>
                    Library Member
                  </div>
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#6366f1,#818cf8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  {user?.fullName?.charAt(0) || "U"}
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/signin")}
              style={s.memberBtn}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "gray"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
            >
              Login or Sign Up
            </button>
          )}
        </div>
            </div>
        {/* CONDITIONALLY SWAP WORKSPACE LAYOUT VIEWS */}
        {children ? (
          <div style={{ flex: 1 }}>{children}</div>
        ) : (
          <>
            {/* HERO */}
            <section style={s.hero}>
              <div style={s.heroOverlay}>
                <p style={s.heroEyebrow}>Empowering Researchers Worldwide</p>
                <h1 style={s.heroTitle}>The Gateway to <span style={{ color: "#3b82f6" }}>Global</span> Knowledge</h1>
                <p style={s.heroText}>
                  Access millions of peer-reviewed journals, rare manuscripts, and modern digital archives
                  from our comprehensive global repository.
                </p>
              </div>
            </section>

            {/* CURATED COLLECTIONS */}
            <section style={s.section}>
              <h2 style={s.sectionTitle}>Curated Collections</h2>
              <p style={s.sectionSubtitle}>
                Deep dive into specialized repositories curated by leading academics and curators across multiple disciplines.
              </p>

              <div style={s.row}>
                <div style={{ ...s.card, flex: "2 1 400px", position: "relative", overflow: "hidden", padding: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ padding: "24px" }}>
                      <h3 style={s.cardTitle}>Natural Sciences & Physics</h3>
                      <p style={s.cardDesc}>From quantum mechanics to global ecosystems, explore our vast collection of peer-reviewed journals and datasets.</p>
                      <button
                        onClick={() => navigate("/catalog")}
                        style={{
                          border: "none",
                          background: "transparent",
                          fontWeight: "700",
                          cursor: "pointer",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(128,128,128,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Explore STEM →
                    </button>
                    </div>
                    <img src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" style={s.cardImg} />
                  </div>
                </div>

                <div
                style={{
                  ...s.card,
                  flex: "1 1 240px",
                  backgroundColor: "#000",
                  color: "#fff",
                  ...s.flexCol,
                  justifyContent: "space-between",
                }}
              >
                <div style={s.darkIconCircle}>𝔸</div>

                <div>
                  <h3 style={{ ...s.cardTitle, color: "#fff" }}>
                    Historical Archives
                  </h3>

                  <p style={{ ...s.cardDesc, color: "#ccc" }}>
                    Ancient manuscripts and documented heritage spanning three millennia of human history.
                  </p>
                </div>

                <a
                  href="https://www.worldhistory.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: "700",
                    marginTop: "12px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    display: "inline-block",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(128,128,128,0.4)";
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  View Archives →
                </a>
              </div>
              </div>

            </section>

            {/* NEW ARRIVALS */}
            <section style={{ ...s.section, backgroundColor: "#eef1f5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
              </div>
            </section>

            {/* PLAN YOUR VISIT */}
            <section style={s.section}>
              <h2 style={s.sectionTitle}>Plan Your Visit</h2>
              <p style={s.sectionSubtitle}>
                Located at the heart of the Academic Square, our facilities offer quiet study zones, collaborative hubs, and full access to our physical collections.
              </p>

              <div style={s.row}>
                <div style={{ ...s.card, flex: "1 1 280px" }}>
                  {hours.map((h) => (
                    <div key={h.day} style={s.hourRow}>
                      <span style={{ fontWeight: "700" }}>{h.day}</span>
                      <span style={{ color: "#888" }}>{h.time}</span>
                    </div>
                  ))}
                  <p style={s.holidayNote}>⚠ Special hours apply during academic holidays.</p>
                </div>

                <div style={{ flex: "1 1 320px", ...s.flexCol, gap: "16px" }}>
                  <div style={{ ...s.card, backgroundColor: "#eaf0ff" }}>
                    <span style={s.openPill}>● Currently Open</span>
                    <p style={{ fontSize: "13px", color: "#666" }}>Occupancy Level 42% (Normal)</p>
                    <iframe
                      title="Library Location Map"
                      src="https://maps.google.com/maps?q=11.5695774,104.8897746&z=16&output=embed"
                      style={s.mapEmbed}
                      loading="lazy"
                    />
                    <a href="https://maps.app.goo.gl/vk1mq4ThSpyqChtJ9" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <button style={s.mapBtn} {...hover('#808080', '#000')}>Open in Maps ↗</button>
                    </a>
                  </div>
                  <div style={{ ...s.card, display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={s.addressIcon}>📍</div>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0" }}>Main Campus Library</h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>STEM Building, Royal University of Phnom Penh, Cambodia</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer style={s.footer}>
          <div>
            <div style={{ fontWeight: "800", fontSize: "16px" }}>Data_Science Library</div>
            <p style={{ fontSize: "12px", color: "#aaa" }}>©Library Management System. Licensed Public Portal.</p>
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: "13px", flexWrap: "wrap" }}>
            <span>Privacy Policy</span><span>Terms of Use</span><span>Library Accessibility</span><span>Contact Librarian</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

const card = { borderRadius: "16px", padding: "24px", backgroundColor: "#fff", border: "1px solid #e5e5e5" };
const pillBtn = { borderRadius: "25px", padding: "12px 28px", fontWeight: "700", fontSize: "14px", cursor: "pointer", border: "none", transition: "background-color .2s" };
const flexCol = { display: "flex", flexDirection: "column" };

const s = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif", backgroundColor: "#f5f6f8" },
  flexCol,
  sidebar: { ...flexCol, justifyContent: "space-between", width: "220px", backgroundColor: "#000", color: "#fff", padding: "24px 16px", position: "sticky", top: 0, height: "100vh" },
  nav: { ...flexCol, gap: "4px" },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", fontSize: "14px", color: "#ccc", cursor: "pointer" },
  navItemActive: { backgroundColor: "#1a1a1a", color: "#fff", fontWeight: "600" },
  navIcon: { fontSize: "16px", width: "20px", textAlign: "center" },
  main: { flex: 1, ...flexCol },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", backgroundColor: "#fff", borderBottom: "1px solid #e5e5e5" },
  searchInput: { flex: 1, maxWidth: "400px", padding: "10px 16px", borderRadius: "20px", border: "1px solid #ddd", outline: "none", fontSize: "13px" },
  memberBtn: { ...pillBtn, backgroundColor: "#ffffff", color: "#000000", boxShadow: "0 4px 12px rgba(74, 72, 72, 0.08)",},
  hero: { backgroundImage: "url('https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200')", backgroundSize: "cover", backgroundPosition: "center", minHeight: "420px", display: "flex", alignItems: "center", justifyContent: "center" },
  heroOverlay: { backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", textAlign: "center", padding: "60px 40px", maxWidth: "700px", borderRadius: "16px" },
  heroEyebrow: { fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#ccc", marginBottom: "12px" },
  heroTitle: { fontSize: "40px", fontWeight: "800", margin: "0 0 16px 0", lineHeight: "1.2" },
  heroText: { fontSize: "14px", color: "#ddd", lineHeight: "1.7", marginBottom: "30px" },
  heroBtnRow: { display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" },
  heroPrimaryBtn: { ...pillBtn, backgroundColor: "#fff", color: "#000", margin: 0 },
  heroSecondaryBtn: { ...pillBtn, border: "1px solid #fff", color: "#fff", margin: 0 },
  section: { padding: "20px 40px" },
  sectionTitle: { fontSize: "26px", fontWeight: "800", margin: "0 0 8px 0" },
  sectionSubtitle: { fontSize: "14px", color: "#666", maxWidth: "600px", lineHeight: "1.6" },
  row: { display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" },
  card,
  cardTitle: { fontSize: "20px", fontWeight: "800", margin: "0 0 10px 0" },
  cardDesc: { fontSize: "13px", color: "#666", lineHeight: "1.6", marginBottom: "12px" },
  cardCta: { fontSize: "13px", fontWeight: "700", margin: 0 },
  cardImg: { width: "180px", objectFit: "cover", borderRadius: "0 16px 16px 0" },
  tagPill: { position: "absolute", top: "16px", left: "16px", backgroundColor: "#f0f0f0", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "12px", color: "#555", zIndex: 1 },
  darkIconCircle: { width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" },
  langPill: { backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "6px", padding: "4px 8px", fontSize: "11px", fontWeight: "700" },
  hubGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "16px", fontSize: "12px", color: "#666" },
  cloudIcon: { width: "100px", height: "100px", backgroundColor: "#eaf0ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", color: "#aaa" },
  arrowBtn: { width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "#fff" },
  arrivalImg: { width: "100%", height: "180px", objectFit: "cover", borderRadius: "12px" },
  hourRow: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee", fontSize: "13px" },
  holidayNote: { fontSize: "12px", color: "#cc4444", backgroundColor: "#fdecec", padding: "10px", borderRadius: "8px", marginTop: "12px" },
  openPill: { fontSize: "12px", fontWeight: "700", color: "#2a9d4a" },
  mapEmbed: { width: "100%", height: "180px", border: "none", borderRadius: "12px", margin: "12px 0" },
  mapBtn: { ...pillBtn, backgroundColor: "#000", color: "#fff", width: "100%" },
  addressIcon: { fontSize: "24px" },
  footer: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", backgroundColor: "#000", color: "#fff", padding: "30px 40px" },
  logoWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px'},
  brandTextWrap: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  brandTitle: { fontSize: '18px', fontWeight: '700', margin: '0', color: '#ffffff', lineHeight: '1.2' },
  brandSubtitle: { fontSize: '15px', color: '#ff3b30', margin: '4px 0 8px 0', lineHeight: '1.2' },
  brandTagline: { fontSize: '13px', color: '#d7e3f1', margin: 0 },
};