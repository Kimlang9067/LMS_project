import React, { useState, useRef } from "react";
import { getSession, setSession, getRoleLabel } from "../../utils/auth";
import LibraryBookLogo from "../../components/shared/LibraryBookLogo";
import { PrimaryBtn, GhostBtn } from "../../components/shared/UI";

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ width: "140px", flexShrink: 0, fontSize: "13px", fontWeight: "600", color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: "14px", color: "#0f172a", fontWeight: "500" }}>{value || "—"}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={S.input}
        onFocus={e  => (e.target.style.borderColor = "#3b82f6")}
        onBlur={e   => (e.target.style.borderColor = "#cbd5e1")}
      />
    </div>
  );
}

export default function StaffProfile() {
  const session = getSession();
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
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSession({ ...session, ...form });
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleCancel = () => {
    setForm({ fullName: session.fullName, email: session.email, phone: session.phone || "" });
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: "720px", fontFamily: "system-ui, sans-serif" }}>

      {/* Success banner */}
      {saved && <div style={S.savedBanner}>Profile updated successfully.</div>}

      {/* Top card */}
      <div style={S.topCard}>
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
              : <span style={{ fontSize: "28px" }}>👤</span>
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
          <p style={{ margin: "10px 0 0", fontSize: "11px", color: "#4b5563" }}>Click photo to change picture</p>
        </div>
      </div>

      {/* Account info card */}
      <div style={S.detailCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Account Information</h3>
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
            <InfoRow label="Full Name" value={session.fullName} />
            <InfoRow label="Email"     value={session.email} />
            <InfoRow label="Phone"     value={session.phone} />
            <InfoRow label="Role"      value={getRoleLabel(session.role)} />
            <InfoRow label="User ID"   value={session.userId || session.id} />
            <InfoRow label="Status"    value={session.status || "Active"} />
          </div>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <Field label="Full Name" value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} />
            <Field label="Email"     value={form.email}    onChange={v => setForm({ ...form, email: v })}    type="email" />
            <Field label="Phone"     value={form.phone}    onChange={v => setForm({ ...form, phone: v })}    type="tel" />
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <PrimaryBtn onClick={handleSave}>Save Changes</PrimaryBtn>
              <GhostBtn onClick={handleCancel}>Cancel</GhostBtn>
            </div>
          </div>
        )}
      </div>

      {/* System info card */}
      <div style={S.detailCard}>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>System Info</h3>
        <InfoRow label="User ID"    value={session.userId || session.id} />
        <InfoRow label="Role"       value={getRoleLabel(session.role)} />
        <InfoRow label="Last Login" value={session.loginAt ? new Date(session.loginAt).toLocaleString() : "—"} />
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
