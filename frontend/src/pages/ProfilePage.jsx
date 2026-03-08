import { useAuth } from "../context/AuthContext";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes subtlePulse {
    0%, 100% { opacity: .55; }
    50%       { opacity: .85; }
  }
  @keyframes avatarReveal {
    from { opacity: 0; transform: scale(.8); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .pp-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .pp-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .pp-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .pp-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .pp-inner {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
  }

  /* ── Header ── */
  .pp-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .pp-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .pp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .pp-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .pp-subtitle { font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300; }

  /* ── Hero card ── */
  .pp-hero {
    position: relative;
    background: linear-gradient(145deg, rgba(59,130,246,.1) 0%, rgba(59,130,246,.03) 60%, rgba(99,102,241,.06) 100%);
    border: 1px solid rgba(59,130,246,.2);
    border-radius: 20px; padding: 40px 36px;
    backdrop-filter: blur(20px); overflow: hidden;
    box-shadow: 0 0 0 1px rgba(59,130,246,.06) inset, 0 24px 60px rgba(0,0,0,.45);
    margin-bottom: 20px;
    animation: fadeUp .6s .1s cubic-bezier(.16,1,.3,1) both;
    display: flex; align-items: center; gap: 32px;
    flex-wrap: wrap;
  }
  .pp-hero::before {
    content: '';
    position: absolute; top: 0; left: 36px; right: 36px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.6), rgba(147,197,253,.75), rgba(59,130,246,.6), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }

  /* Avatar */
  .pp-avatar-wrap {
    position: relative; flex-shrink: 0;
    animation: avatarReveal .7s .2s cubic-bezier(.16,1,.3,1) both;
  }
  .pp-avatar-ring {
    position: absolute; inset: -6px; border-radius: 50%;
    border: 1.5px solid transparent;
    background: linear-gradient(135deg, rgba(59,130,246,.4), rgba(147,197,253,.3), rgba(99,102,241,.4)) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    animation: ringRotate 8s linear infinite;
  }
  .pp-avatar {
    width: 88px; height: 88px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(59,130,246,.3) 0%, rgba(99,102,241,.3) 100%);
    border: 2px solid rgba(59,130,246,.3);
    display: grid; place-items: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 400; color: #93c5fd;
    user-select: none;
  }

  .pp-hero-info { flex: 1; min-width: 0; }
  .pp-hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 400; color: #f0ece4;
    margin: 0 0 8px; line-height: 1.1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pp-hero-username {
    font-size: 13px; color: rgba(240,236,228,.4); margin: 0 0 16px;
  }
  .pp-role-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 14px; border-radius: 8px;
    font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase;
  }
  .pp-role-badge .pp-role-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  }

  /* ── Info card ── */
  .pp-card {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px; padding: 32px 36px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 20px 52px rgba(0,0,0,.4);
    overflow: hidden;
    animation: fadeUp .6s .2s cubic-bezier(.16,1,.3,1) both;
  }
  .pp-card::before {
    content: '';
    position: absolute; top: 0; left: 36px; right: 36px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.4), rgba(147,197,253,.55), rgba(59,130,246,.4), transparent);
    background-size: 200% auto;
    animation: shimmer 6s linear infinite;
  }
  .pp-card-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
  }
  .pp-card-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; color: #60a5fa; flex-shrink: 0;
  }
  .pp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f0ece4; margin: 0;
  }

  /* ── Field rows ── */
  .pp-fields { display: flex; flex-direction: column; gap: 0; }
  .pp-field {
    display: flex; align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .pp-field:last-child { border-bottom: none; }
  .pp-field-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    display: grid; place-items: center; color: rgba(96,165,250,.5);
    flex-shrink: 0; margin-right: 16px;
  }
  .pp-field-label {
    font-size: 10px; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(96,165,250,.55);
    margin: 0 0 3px;
  }
  .pp-field-value {
    font-size: 14px; color: rgba(240,236,228,.85); margin: 0;
    font-weight: 400;
  }
  .pp-field-value.empty { color: rgba(240,236,228,.25); font-style: italic; font-size: 13px; }
  .pp-field-body { flex: 1; min-width: 0; }
`;
if (!document.head.querySelector("[data-pp-style]")) {
  style.setAttribute("data-pp-style", "1");
  document.head.appendChild(style);
}

const IcoUser   = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoMail   = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoShield = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoId     = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IcoInfo   = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;

const roleConfig = {
  admin:      { label: "Administrateur", bg: "rgba(239,68,68,.1)",   border: "rgba(239,68,68,.25)",   color: "#fca5a5",  dot: "#ef4444"  },
  enseignant: { label: "Enseignant",     bg: "rgba(59,130,246,.1)",  border: "rgba(59,130,246,.25)",  color: "#93c5fd",  dot: "#3b82f6"  },
  etudiant:   { label: "Étudiant",       bg: "rgba(34,197,94,.1)",   border: "rgba(34,197,94,.25)",   color: "#86efac",  dot: "#22c55e"  },
  default:    { label: "Utilisateur",    bg: "rgba(99,102,241,.1)",  border: "rgba(99,102,241,.25)",  color: "#a5b4fc",  dot: "#6366f1"  },
};

const initials = (username, email) => {
  if (username) return username.slice(0, 2).toUpperCase();
  if (email)    return email.slice(0, 2).toUpperCase();
  return "?";
};

export default function ProfilePage() {
  const { user } = useAuth();
  const rc = roleConfig[user?.role] ?? roleConfig.default;

  const fields = [
    { icon: IcoUser,   label: "Nom d'utilisateur", value: user?.username   },
    { icon: IcoMail,   label: "Adresse e-mail",     value: user?.email     },
    { icon: IcoShield, label: "Rôle",               value: rc.label        },
    { icon: IcoId,     label: "Identifiant système", value: user?.id || user?.student_id || user?._id },
  ].filter((f) => f.value);

  return (
    <div className="pp-root">
      <div className="pp-grid-bg" />
      <div className="pp-inner">

        {/* Header */}
        <div className="pp-header">
          <p className="pp-eyebrow">Compte · Informations personnelles</p>
          <h1 className="pp-title">Mon <strong>profil</strong></h1>
          <p className="pp-subtitle">Vos informations de compte et vos accès à la plateforme</p>
        </div>

        {/* Hero card */}
        <div className="pp-hero">
          <div className="pp-avatar-wrap">
            <div className="pp-avatar-ring" />
            <div className="pp-avatar">
              {initials(user?.username, user?.email)}
            </div>
          </div>

          <div className="pp-hero-info">
            <h2 className="pp-hero-name">{user?.username || "Utilisateur"}</h2>
            <p className="pp-hero-username">{user?.email || "Aucun email renseigné"}</p>
            <span className="pp-role-badge" style={{
              background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color
            }}>
              <span className="pp-role-dot" style={{ background: rc.dot }} />
              {rc.label}
            </span>
          </div>
        </div>

        {/* Details card */}
        <div className="pp-card">
          <div className="pp-card-header">
            <div className="pp-card-icon">{IcoInfo}</div>
            <h2 className="pp-card-title">Détails du compte</h2>
          </div>

          <div className="pp-fields">
            {fields.map(({ icon, label, value }) => (
              <div className="pp-field" key={label}>
                <div className="pp-field-icon">{icon}</div>
                <div className="pp-field-body">
                  <p className="pp-field-label">{label}</p>
                  <p className={`pp-field-value${!value ? " empty" : ""}`}>
                    {value || "Non renseigné"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}