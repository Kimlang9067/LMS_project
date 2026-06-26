import React, { useState, useRef } from "react";
import { getSession, setSession, getRoleLabel } from "../../utils/auth";
import { useTheme } from "../../utils/theme";
import LibraryBookLogo from "../../components/shared/LibraryBookLogo";
import { PrimaryBtn, GhostBtn } from "../../components/shared/UI";

function InfoRow({ label, value, isDark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${isDark ? "#334155" : "#f1f5f9"}` }}>
      <span style={{ width: "140px", flexShrink: 0, fontSize: "13px", fontWeight: "600", color: isDark ? "#94a3b8" : "#64748b" }}>{label}</span>
      <span style={{ fontSize: "14px", color: isDark ? "#f1f5f9" : "#0f172a", fontWeight: "500" }}>{value || "—"}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", isDark }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: isDark ? "#94a3b8" : "#475569", marginBottom: "6px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...S.input, backgroundColor: isDark ? "#1F2937" : "#fff", color: isDark ? "#f1f5f9" : "#334155", borderColor: isDark ? "#334155" : "#cbd5e1" }}
        onFocus={e  => (e.target.style.borderColor = "#3b82f6")}
        onBlur={e   => (e.target.style.borderColor = isDark ? "#334155" : "#cbd5e1")}
      />
    </div>
  );
}

export default function StaffProfile() {
  const session = getSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!session) return null;

  const avatarKey = `staffAvatar_${session.id}`;

  const [avatar,    setAvatar]    = useState(() => localStorage.getItem(avatarKey));
  const [isEditing, setIsEditing] = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [form, setForm] = useState({
    fullName: session.fullName || "",
    email:    session.email    || "",
    phone:    session.phone    || "",
  });

  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result;
      localStorage.setItem(avatarKey, b64);
      setAvatar(b64);
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSession({ ...session, ...form });
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3500);
    // Notify layout to refresh display name and avatar
    window.dispatchEvent(new CustomEvent('profileUpdated'));
  };

  const handleCancel = () => {
    setForm({ fullName: session.fullName, email: session.email, phone: session.phone || "" });
    setIsEditing(false);
  };

  const detailCard = {
    ...S.detailCard,
    backgroundColor: isDark ? '#1e293b' : '#fff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
  };

  return (
    <div style={{ maxWidth: "720px", fontFamily: "system-ui, sans-serif" }}>

      {/* Success banner */}
      {saved && <div style={S.savedBanner}>Profile updated successfully.</div>}

      {/* Top card with gradient banner */}
      <div style={{ ...S.topCard, padding: 0, overflow: 'hidden', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
        {/* Banner */}
        <div style={{ height: '90px', background: 'linear-gradient(135deg, #000000 0%, #1e3a5f 50%, #312e81 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.2)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.15)' }} />
        </div>
        {/* Content row overlapping banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '0 32px 28px', marginTop: '-36px' }}>
        <LibraryBookLogo size={84} />

        {/* Clickable avatar with camera overlay */}
        <div
          style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}
          onClick={() => fileRef.current?.click()}
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
          title="Click to upload photo"
        >
          <div style={S.avatar}>
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "800", fontSize: "22px", userSelect: "none" }}>
                  {(session.fullName || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("")}
                </div>
              )
            }
          </div>
          {/* Camera overlay on hover */}
          <div style={{
            ...S.cameraOverlay,
            opacity: avatarHover ? 1 : 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>

        {/* Hidden file input */}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

        {/* Name + role */}
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800", color: "#ffffff" }}>
            {session.fullName}
          </h2>
          <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#94a3b8" }}>
            {getRoleLabel(session.role)}
          </p>
          <span style={S.statusBadge}>{session.status || "Active"}</span>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#4b5563" }}>Click photo to change picture</p>
            {avatar && (
              <button
                onClick={() => {
                  localStorage.removeItem(avatarKey);
                  setAvatar(null);
                  window.dispatchEvent(new CustomEvent('avatarUpdated'));
                }}
                style={{ fontSize: "11px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: "600" }}
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
        </div>{/* end content row */}
      </div>

      {/* Account info card */}
      <div style={detailCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: isDark ? "#f1f5f9" : "#0f172a" }}>Account Information</h3>
          {!isEditing && (
            <GhostBtn onClick={() => setIsEditing(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "13px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </GhostBtn>
          )}
        </div>

        {!isEditing ? (
          <div style={{ marginTop: "8px" }}>
            <InfoRow label="Full Name" value={session.fullName} isDark={isDark} />
            <InfoRow label="Email"     value={session.email} isDark={isDark} />
            <InfoRow label="Phone"     value={session.phone} isDark={isDark} />
            <InfoRow label="Role"      value={getRoleLabel(session.role)} isDark={isDark} />
            <InfoRow label="User ID"   value={session.userId || session.id} isDark={isDark} />
            <InfoRow label="Status"    value={session.status || "Active"} isDark={isDark} />
          </div>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <Field label="Full Name" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} isDark={isDark} />
            <Field label="Email"     value={form.email}    onChange={v => setForm({ ...form, email: v })}    type="email" isDark={isDark} />
            <Field label="Phone"     value={form.phone}    onChange={v => setForm({ ...form, phone: v })}    type="tel" isDark={isDark} />
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <PrimaryBtn onClick={handleSave}>Save Changes</PrimaryBtn>
              <GhostBtn onClick={handleCancel}>Cancel</GhostBtn>
            </div>
          </div>
        )}
      </div>

      {/* System info card */}
      <div style={detailCard}>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: isDark ? "#f1f5f9" : "#0f172a" }}>System Info</h3>
        <InfoRow label="User ID"    value={session.userId || session.id} isDark={isDark} />
        <InfoRow label="Role"       value={getRoleLabel(session.role)} isDark={isDark} />
        <InfoRow label="Last Login" value={session.loginAt ? new Date(session.loginAt).toLocaleString() : "—"} isDark={isDark} />
      </div>
    </div>
  );
}

const S = {
  savedBanner: {
    backgroundColor: "#dcfce7", color: "#166534", borderRadius: "8px",
    padding: "12px 16px", fontSize: "14px", fontWeight: "600",
    marginBottom: "20px", border: "1px solid #bbf7d0",
  },
  topCard: {
    backgroundColor: "#000000",
    borderRadius: "12px",
    padding: "28px 32px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    border: "2px solid rgba(255,255,255,0.15)",
    transition: "border-color 0.2s",
  },
  cameraOverlay: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#dcfce7", color: "#166534",
    fontSize: "11px", fontWeight: "700",
    padding: "3px 10px", borderRadius: "20px",
  },
  detailCard: {
    backgroundColor: "#fff", borderRadius: "12px",
    border: "1px solid #e2e8f0", padding: "24px",
    marginBottom: "16px",
  },
  input: {
    width: "100%", padding: "10px 14px",
    border: "1px solid #cbd5e1", borderRadius: "8px",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
};
