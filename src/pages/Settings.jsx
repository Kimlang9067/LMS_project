import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home"; // Ensure this path matches your folder structure

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userAccount"));
  
  const [activeTab, setActiveTab] = useState("general");
  const [selectedTheme, setSelectedTheme] = useState("light");

  const [dueReminders, setDueReminders] = useState(true);
  const [holdNotif, setHoldNotif] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [history, setHistory] = useState(true);

  const hoverBg = (on, off) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = on),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = off),
  });

  // Replaced broken material fonts with universal standard Unicode Emojis
  const settingsTabs = [
    { id: "general", label: "General", icon: "⚙️" },
    //{ id: "account", label: "Edit Profile", icon: "👤" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    //{ id: "language", label: "Language & Region", icon: "🌐" },
  ];

  const sidebarStyles = {
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      cursor: "pointer",
      color: "#fff",
      fontSize: "14px",
      borderRadius: "8px",
      backgroundColor: "#1a1a1a", 
    },
    newEntryBtn: {
      width: "100%",
      padding: "10px 16px",
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "12px",
    }
  };

  const settingsSidebarExtension = (
    <>
      <div style={sidebarStyles.navItem}>
        <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>⚙️</span>
        <span style={{ fontWeight: "600" }}>Settings</span>
      </div>
    </>
  );

  return (
    <Home isLoggedIn={!!user} user={user} sidebarExtension={settingsSidebarExtension}>
      <div style={{ backgroundColor: "#f8f9ff", minHeight: "100vh", color: "#000" }}>
        {/* PAGE CONTAINER HEADER */}
        <section style={styles.pageHeader}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#041627", margin: "0 0 4px 0" }}>
            Member Settings
          </h2>
          <p style={{ color: "#44474c", fontSize: "14px", margin: 0 }}>
            Manage your personal preferences, security, and institutional identity.
          </p>
        </section>

        {/* CORE CANVAS SHELL */}
        <div style={{ display: "flex", minHeight: "calc(100vh - 150px)" }}>
          
          {/* SUB-SIDEBAR NAVIGATION */}
          <nav style={styles.subSubnav}>
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.subnavLink,
                    backgroundColor: isActive ? "#1a1a1a" : "transparent",
                    color: isActive ? "#ffffff" : "#44474c",
                    fontWeight: isActive ? "500" : "400",
                  }}
                  {...(!isActive ? hoverBg("#eaf0ff", "transparent") : {})}
                >
                  {/* Cleaned up wrapper and container layout styles */}
                  <span style={{ fontSize: "18px", width: "24px", display: "inline-block", textAlign: "center" }}>
                    {tab.icon}
                  </span>
                  <span style={{ fontSize: "14px" }}>{tab.label}</span>
                </div>
              );
            })}
          </nav>

          {/* WORKSPACE FORMS CANVAS */}
          <div style={{ flex: 1, padding: "40px", backgroundColor: "#f8f9ff", overflowY: "auto" }}>
            <div style={{ maxWidth: "768px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
              
              {activeTab === "general" && (
                <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Appearance</h3>
                    <p style={styles.sectionSubtitle}>Customize the visual interface of the library system.</p>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={() => setSelectedTheme("light")}
                        style={{ ...styles.themeCard, borderColor: selectedTheme === "light" ? "#041627" : "#c4c6cd" }}
                      >
                        <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ width: "100%", backgroundColor: "#e2e8f0", height: "8px", borderRadius: "4px" }}></div>
                          <div style={{ width: "75%", backgroundColor: "#e2e8f0", height: "8px", borderRadius: "4px" }}></div>
                        </div>
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: selectedTheme === "light" ? "700" : "400" }}>Light Mode</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={() => setSelectedTheme("dark")}
                        style={{ ...styles.themeCard, backgroundColor: "#0f172a", borderColor: selectedTheme === "dark" ? "#041627" : "#c4c6cd" }}
                      >
                        <div style={{ flex: 1, backgroundColor: "#1e293b", borderRadius: "8px", border: "1px solid #334155", padding: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ width: "100%", backgroundColor: "#334155", height: "8px", borderRadius: "4px" }}></div>
                          <div style={{ width: "75%", backgroundColor: "#334155", height: "8px", borderRadius: "4px" }}></div>
                        </div>
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: selectedTheme === "dark" ? "700" : "400" }}>Dark Mode</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={() => setSelectedTheme("system")}
                        style={{ ...styles.themeCard, position: "relative", overflow: "hidden", borderColor: selectedTheme === "system" ? "#041627" : "#c4c6cd" }}
                      >
                        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
                          <div style={{ width: "50%", backgroundColor: "#ffffff" }}></div>
                          <div style={{ width: "50%", backgroundColor: "#0f172a" }}></div>
                        </div>
                        <div style={{ position: "absolute", inset: "8px", backgroundColor: "rgba(248,249,255,0.2)", backdropFilter: "blur(4px)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }}></div>
                      </button>
                      <span style={{ fontSize: "12px", fontWeight: selectedTheme === "system" ? "700" : "400" }}>System Match</span>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "notifications" && (
                <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Email Preferences</h3>
                    <p style={styles.sectionSubtitle}>Manage which library activities trigger an email notification.</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={styles.toggleCardRow}>
                      <div>
                        <p style={styles.toggleRowTitle}>Due Date Reminders</p>
                        <p style={styles.toggleRowDesc}>Get notified 2 days before a book is due for return.</p>
                      </div>
                      <input type="checkbox" checked={dueReminders} onChange={(e) => setDueReminders(e.target.checked)} style={styles.nativeCheckbox} />
                    </div>

                    <div style={styles.toggleCardRow}>
                      <div>
                        <p style={styles.toggleRowTitle}>Hold Notifications</p>
                        <p style={styles.toggleRowDesc}>Alert me when a requested item is ready for pickup.</p>
                      </div>
                      <input type="checkbox" checked={holdNotif} onChange={(e) => setHoldNotif(e.target.checked)} style={styles.nativeCheckbox} />
                    </div>

                    <div style={styles.toggleCardRow}>
                      <div>
                        <p style={styles.toggleRowTitle}>Library Newsletter</p>
                        <p style={styles.toggleRowDesc}>Monthly highlights on new arrivals and academic events.</p>
                      </div>
                      <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} style={styles.nativeCheckbox} />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "privacy" && (
                <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Privacy</h3>
                    <p style={styles.sectionSubtitle}>Control who can see your activity and what data is stored.</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#fff", border: "1px solid #c4c6cd", borderRadius: "12px", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "24px", borderBottom: "1px solid #c4c6cd" }}>
                      <div>
                        <p style={styles.toggleRowTitle}>Profile Visibility</p>
                        <p style={styles.toggleRowDesc}>Make your curated booklists visible to other institutional members.</p>
                      </div>
                      <input type="checkbox" checked={visibility} onChange={(e) => setVisibility(e.target.checked)} style={styles.nativeCheckbox} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px" }}>
                      <div>
                        <p style={styles.toggleRowTitle}>Borrowing History</p>
                        <p style={styles.toggleRowDesc}>Keep a permanent log of all items you've checked out for research reference.</p>
                      </div>
                      <input type="checkbox" checked={history} onChange={(e) => setHistory(e.target.checked)} style={styles.nativeCheckbox} />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "language" && (
                <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Language & Region</h3>
                    <p style={styles.sectionSubtitle}>Set your preferred communication language and time zone.</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={styles.inputLabel}>Primary Language</label>
                      <select style={styles.selectDropdown}>
                        <option>English (United States)</option>
                        <option>English (United Kingdom)</option>
                        <option>French (Français)</option>
                        <option>Spanish (Español)</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={styles.inputLabel}>Time Zone</label>
                      <select style={styles.selectDropdown}>
                        <option>(UTC+07:00) Phnom Penh, Bangkok</option>
                        <option>(UTC+00:00) Greenwich Mean Time</option>
                        <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {/* ACTION FOOTER SAVE BAR */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", paddingTop: "24px", borderTop: "1px solid #c4c6cd", marginTop: "40px" }}>
                <button style={styles.btnSecondary} onClick={() => navigate("/userdashboard")} {...hoverBg("#e6eeff", "transparent")}>Discard Changes</button>
                <button style={styles.btnPrimary} onClick={() => navigate("/userdashboard")}>Save Preferences</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Home>
  );
}

const styles = {
  pageHeader: { padding: "24px 40px", backgroundColor: "#ffffff", borderBottom: "1px solid #c4c6cd" },
  subSubnav: { width: "260px", backgroundColor: "#ffffff", borderRight: "1px solid #c4c6cd", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px" },
  subnavLink: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", cursor: "pointer", transition: "all 0.15s ease" },
  sectionHeader: { borderBottom: "1px solid #c4c6cd", paddingBottom: "8px" },
  sectionTitle: { fontSize: "20px", fontWeight: "600", color: "#041627", margin: "0 0 4px 0" },
  sectionSubtitle: { fontSize: "14px", color: "#44474c", margin: 0 },
  themeCard: { width: "100%", aspectRatio: "4/3", borderRadius: "12px", border: "2px solid #c4c6cd", backgroundColor: "#ffffff", padding: "4px", display: "flex", flexDirection: "column", cursor: "pointer" },
  toggleCardRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", backgroundColor: "#ffffff", border: "1px solid #c4c6cd", borderRadius: "12px" },
  toggleRowTitle: { fontSize: "16px", fontWeight: "600", color: "#0d1c2e", margin: "0 0 2px 0" },
  toggleRowDesc: { fontSize: "14px", color: "#44474c", margin: 0 },
  inputLabel: { fontSize: "12px", fontWeight: "500", color: "#44474c", textTransform: "uppercase", letterSpacing: "0.05em" },
  selectDropdown: { width: "100%", backgroundColor: "#ffffff", border: "1px solid #c4c6cd", borderRadius: "8px", padding: "10px 16px", outline: "none", fontSize: "14px" },
  nativeCheckbox: { width: "20px", height: "20px", cursor: "pointer", accentColor: "#1a2b3c" },
  btnPrimary: { padding: "10px 24px", backgroundColor: "#041627", color: "#ffffff", fontWeight: "600", borderRadius: "8px", border: "none", cursor: "pointer" },
  btnSecondary: { padding: "10px 16px", backgroundColor: "transparent", color: "#041627", fontWeight: "600", borderRadius: "8px", border: "none", cursor: "pointer", transition: "background-color 0.15s" },
};