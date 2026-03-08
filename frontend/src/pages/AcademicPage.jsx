import { useState } from "react";
import api from "../services/api";

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
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .ac-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .ac-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    top: -200px; right: -200px;
    border-radius: 50%;
    filter: blur(140px);
    pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.16) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .ac-root::after {
    content: '';
    position: fixed;
    width: 400px; height: 400px;
    bottom: -100px; left: -100px;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }

  .ac-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .ac-inner {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── Page header ── */
  .ac-header {
    margin-bottom: 40px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .ac-header-eyebrow {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #60a5fa;
    margin: 0 0 10px;
  }
  .ac-header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 300;
    color: #f0ece4;
    margin: 0 0 6px;
    line-height: 1.1;
  }
  .ac-header-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ac-header-sub {
    font-size: 13px;
    color: rgba(240,236,228,.35);
    margin: 0;
    font-weight: 300;
  }

  /* ── Section cards ── */
  .ac-section {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 32px 36px 36px;
    backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,.035) inset,
      0 24px 60px rgba(0,0,0,.45),
      0 6px 16px rgba(0,0,0,.25);
    margin-bottom: 24px;
    overflow: hidden;
  }
  .ac-section::before {
    content: '';
    position: absolute;
    top: 0; left: 36px; right: 36px;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.6), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }

  .ac-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }
  .ac-section-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(59,130,246,.15);
    border: 1px solid rgba(59,130,246,.25);
    display: grid; place-items: center;
    flex-shrink: 0;
  }
  .ac-section-icon svg {
    color: #60a5fa;
  }
  .ac-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: #f0ece4;
    margin: 0;
    letter-spacing: .01em;
  }
  .ac-section-badge {
    margin-left: auto;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(96,165,250,.6);
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.18);
    border-radius: 6px;
    padding: 3px 10px;
  }

  /* ── Field grid ── */
  .ac-fields {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    margin-bottom: 24px;
  }

  .ac-field-wrap {}
  .ac-field-label {
    display: block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(96,165,250,.75);
    margin-bottom: 7px;
  }
  .ac-field-input {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 400;
    color: #f0ece4;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .ac-field-input::placeholder { color: rgba(240,236,228,.18); }
  .ac-field-input:focus {
    border-color: rgba(59,130,246,.6);
    background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 3px rgba(59,130,246,.1), 0 2px 12px rgba(0,0,0,.2);
  }

  /* ── Footer row ── */
  .ac-section-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .ac-section-hint {
    font-size: 11.5px;
    color: rgba(240,236,228,.22);
  }

  /* ── Submit button ── */
  .ac-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 22px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform .15s, box-shadow .15s, opacity .15s;
    box-shadow: 0 4px 16px rgba(59,130,246,.3), 0 1px 4px rgba(0,0,0,.3);
  }
  .ac-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59,130,246,.4), 0 2px 8px rgba(0,0,0,.35);
  }
  .ac-btn:active:not(:disabled) { transform: translateY(0); }
  .ac-btn:disabled { opacity: .5; cursor: not-allowed; }
  .ac-btn.success {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    box-shadow: 0 4px 16px rgba(34,197,94,.3);
  }

  /* ── Toast notification ── */
  .ac-toast {
    position: fixed;
    bottom: 28px; right: 28px;
    background: rgba(15,20,30,.95);
    border: 1px solid rgba(59,130,246,.3);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
    color: #f0ece4;
    font-size: 13px;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
    z-index: 9999;
    animation: fadeUp .3s ease both;
    backdrop-filter: blur(20px);
  }
  .ac-toast.error { border-color: rgba(239,68,68,.35); }
  .ac-toast-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
  .ac-toast.error .ac-toast-dot { background: #ef4444; }
`;

if (!document.head.querySelector("[data-ac-style]")) {
  style.setAttribute("data-ac-style", "1");
  document.head.appendChild(style);
}

// Icons
const icons = {
  filiere: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  classe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  semestre: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  matiere: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  save: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// Label formatter
const formatLabel = (key) =>
  key.replace(/_id$/, " ID").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function FormSection({ title, icon, badge, form, setForm, endpoint, delay = 0 }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post(endpoint, form);
      setSuccess(true);
      setForm(
        Object.fromEntries(
          Object.keys(form).map((k) => [k, ""])
        )
      );
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      // error handled by global interceptor or toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ac-section" style={{ animation: `fadeUp .6s ${delay}s cubic-bezier(.16,1,.3,1) both` }}>
      <div className="ac-section-header">
        <div className="ac-section-icon">{icon}</div>
        <h2 className="ac-section-title">{title}</h2>
        <span className="ac-section-badge">{badge}</span>
      </div>

      <div className="ac-fields">
        {Object.keys(form).map((key) => (
          <div className="ac-field-wrap" key={key}>
            <label className="ac-field-label">{formatLabel(key)}</label>
            <input
              className="ac-field-input"
              type={
                key.includes("date")
                  ? "date"
                  : key.endsWith("_id") || key === "coefficient" || key === "volume_horaire"
                    ? "number"
                    : "text"
              }
              placeholder={key.includes("date") ? "" : `ex. ${key}`}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="ac-section-footer">
        <span className="ac-section-hint">{Object.keys(form).length} champs · POST {endpoint}</span>
        <button
          className={`ac-btn${success ? " success" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
              </svg>
              Enregistrement…
            </>
          ) : success ? (
            <>{icons.check} Enregistré !</>
          ) : (
            <>{icons.save} Enregistrer</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AcademicPage() {
  const [filiere, setFiliere] = useState({ nom_filiere: "", description: "" });
  const [classe, setClasse] = useState({ nom_classe: "", filiere_id: "" });
  const [matiere, setMatiere] = useState({ ue_id: "", libelle: "", coefficient: "", volume_horaire: "" });

  const sections = [
    { title: "Filières", icon: icons.filiere, badge: "Référentiel", form: filiere, setForm: setFiliere, endpoint: "/filieres" },
    { title: "Classes", icon: icons.classe, badge: "Groupes",      form: classe,   setForm: setClasse,   endpoint: "/classes"  },
    { title: "Matières", icon: icons.matiere, badge: "Programme",   form: matiere,  setForm: setMatiere,  endpoint: "/matieres" },
  ];

  return (
    <div className="ac-root">
      <div className="ac-grid-bg" />
      <div className="ac-inner">
        <div className="ac-header">
          <p className="ac-header-eyebrow">Administration · Référentiels</p>
          <h1 className="ac-header-title">Gestion <strong>académique</strong></h1>
          <p className="ac-header-sub">Configurez les filières, classes, semestres et matières de votre établissement</p>
        </div>

        {sections.map((s, i) => (
          <FormSection key={s.endpoint} delay={i * 0.08} {...s} />
        ))}
      </div>
    </div>
  );
}
