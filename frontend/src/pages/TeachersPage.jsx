import { useEffect, useState } from "react";
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
  @keyframes spin { to { transform: rotate(360deg); } }

  .tp-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .tp-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .tp-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .tp-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .tp-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  /* ── Header ── */
  .tp-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .tp-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .tp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .tp-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .tp-subtitle {
    font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300;
  }

  /* ── Card ── */
  .tp-card {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 32px 36px 36px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 24px 60px rgba(0,0,0,.45);
    overflow: hidden;
    margin-bottom: 24px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .tp-card::before {
    content: '';
    position: absolute; top: 0; left: 36px; right: 36px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.6), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }
  .tp-card-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  }
  .tp-card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; flex-shrink: 0; color: #60a5fa;
  }
  .tp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #f0ece4; margin: 0;
  }

  /* ── Form ── */
  .tp-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .tp-field-label {
    display: block; font-size: 10px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: rgba(96,165,250,.75); margin-bottom: 7px;
  }
  .tp-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; color: #f0ece4;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .tp-input::placeholder { color: rgba(240,236,228,.2); }
  .tp-input:focus {
    border-color: rgba(59,130,246,.6);
    background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }

  /* ── Alert ── */
  .tp-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: 12px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px;
    animation: fadeUp .3s ease both;
  }
  .tp-alert.success {
    background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #86efac;
  }
  .tp-alert.error {
    background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25); color: #fca5a5;
  }

  /* ── Footer ── */
  .tp-form-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .tp-form-hint { font-size: 11.5px; color: rgba(240,236,228,.22); }

  /* ── Button ── */
  .tp-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 4px 16px rgba(59,130,246,.3);
  }
  .tp-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59,130,246,.4);
  }
  .tp-btn:disabled { opacity: .5; cursor: not-allowed; }
  .tp-btn.danger {
    background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.2);
    color: #fca5a5;
    box-shadow: none;
    padding: 7px 14px;
    font-size: 11px;
  }
  .tp-btn.danger:hover:not(:disabled) {
    background: rgba(239,68,68,.18);
    transform: none;
    box-shadow: none;
  }

  /* ── Table ── */
  .tp-table-wrap { overflow-x: auto; }
  .tp-table { width: 100%; border-collapse: collapse; }
  .tp-table thead tr { border-bottom: 1px solid rgba(255,255,255,.07); }
  .tp-table th {
    font-size: 10px; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(96,165,250,.65);
    padding: 0 16px 14px; text-align: left; white-space: nowrap;
  }
  .tp-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .15s;
  }
  .tp-table tbody tr:hover { background: rgba(59,130,246,.05); }
  .tp-table tbody tr:last-child { border-bottom: none; }
  .tp-table td {
    padding: 13px 16px; font-size: 13px;
    color: rgba(240,236,228,.75); white-space: nowrap;
  }

  /* Avatar + name cell */
  .tp-avatar-cell { display: flex; align-items: center; gap: 10px; }
  .tp-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(59,130,246,.3), rgba(99,102,241,.3));
    border: 1px solid rgba(59,130,246,.25);
    display: grid; place-items: center;
    font-size: 12px; font-weight: 500; color: #93c5fd;
    flex-shrink: 0; font-family: 'DM Sans', sans-serif;
  }

  /* Chips */
  .tp-chip {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 500;
  }
  .tp-chip.mat {
    background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.22); color: #93c5fd;
  }
  .tp-chip.id {
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
    color: rgba(240,236,228,.5); font-variant-numeric: tabular-nums; letter-spacing: .04em;
  }

  .tp-empty {
    text-align: center; padding: 48px 0;
    color: rgba(240,236,228,.2); font-size: 13px;
  }
`;
if (!document.head.querySelector("[data-tp-style]")) {
  style.setAttribute("data-tp-style", "1");
  document.head.appendChild(style);
}

const IcoUser = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcoList = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IcoSave = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IcoTrash = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const FIELDS = [
  { key: "prenom",    label: "Prénom",      placeholder: "ex. Amadou",   type: "text"     },
  { key: "nom",       label: "Nom",         placeholder: "ex. Diallo",   type: "text"     },
  { key: "telephone", label: "Téléphone",   placeholder: "ex. 771234567", type: "text"     },
  { key: "email",     label: "Email",       placeholder: "ex. prof@univ.edu.sn", type: "email" },
  { key: "username",  label: "Identifiant", placeholder: "ex. a.diallo", type: "text"     },
  { key: "password",  label: "Mot de passe",placeholder: "••••••••",    type: "password"  },
];

const initials = (prenom, nom) =>
  `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage]   = useState({ text: "", type: "" });
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState("actif");
  const [form, setForm] = useState({
    username: "", password: "", nom: "", prenom: "", telephone: "", email: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get("/teachers", { params: { status } });
      setTeachers(data);
    } catch (err) {
      setMessage({ text: "Erreur chargement enseignants : " + (err?.response?.data?.message || err.message), type: "error" });
    }
  };

  useEffect(() => { load(); }, [status]);

  const create = async () => {
    setCreating(true);
    try {
      await api.post("/teachers", form);
      setMessage({ text: "Enseignant créé avec succès", type: "success" });
      setForm({ username: "", password: "", nom: "", prenom: "", telephone: "", email: "" });
      load();
      setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    } catch (err) {
      setMessage({ text: "Erreur lors de la création : " + (err.message || "inconnue"), type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
      setMessage({ text: "Enseignant desactive", type: "success" });
      load();
      setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    } catch (err) {
      setMessage({ text: "Erreur suppression enseignant : " + (err?.response?.data?.message || err.message), type: "error" });
    }
  };

  return (
    <div className="tp-root">
      <div className="tp-grid-bg" />
      <div className="tp-inner">

        {/* Header */}
        <div className="tp-header">
          <p className="tp-eyebrow">Administration · Ressources humaines</p>
          <h1 className="tp-title">Gestion des <strong>enseignants</strong></h1>
          <p className="tp-subtitle">Créez et consultez les comptes enseignants de l'établissement</p>
        </div>

        {/* Alert */}
        {message.text && (
          <div className={`tp-alert ${message.type}`}>
            {message.type === "success"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {message.text}
          </div>
        )}

        {/* Form card */}
        <div className="tp-card" style={{ animationDelay: ".1s" }}>
          <div className="tp-card-header">
            <div className="tp-card-icon">{IcoUser}</div>
            <h2 className="tp-card-title">Nouvel enseignant</h2>
          </div>

          <div className="tp-form-grid">
            {FIELDS.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="tp-field-label">{label}</label>
                <input
                  className="tp-input"
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="tp-form-footer">
            <span className="tp-form-hint">6 champs · POST /teachers</span>
            <button className="tp-btn" onClick={create} disabled={creating}>
              {creating
                ? <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                    </svg>
                    Enregistrement…
                  </>
                : <>{IcoSave} Enregistrer</>
              }
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="tp-card" style={{ animationDelay: ".2s" }}>
          <div className="tp-card-header">
            <div className="tp-card-icon">{IcoList}</div>
            <h2 className="tp-card-title">Corps enseignant</h2>
            <select className="tp-input" style={{ width: 170, marginLeft: "auto", marginRight: 12 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
              <option value="tous">Tous</option>
            </select>
            <span style={{
              fontSize: 11, fontWeight: 500, letterSpacing: ".12em",
              textTransform: "uppercase", color: "rgba(96,165,250,.6)",
              background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.18)",
              borderRadius: 6, padding: "3px 10px"
            }}>{teachers.length} enseignant{teachers.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="tp-table-wrap">
            {teachers.length === 0 ? (
              <div className="tp-empty">Aucun enseignant enregistré pour le moment</div>
            ) : (
              <table className="tp-table">
                <thead>
                  <tr>
                    {["ID", "Enseignant", "Téléphone", "Email", "Statut", "Identifiant", "Action"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.id_enseignant}>
                      <td><span className="tp-chip id">{t.id_enseignant}</span></td>
                      <td>
                        <div className="tp-avatar-cell">
                          <div className="tp-avatar">{initials(t.prenom, t.nom)}</div>
                          <span style={{ color: "#f0ece4" }}>{t.prenom} {t.nom}</span>
                        </div>
                      </td>
                      <td>{t.telephone || "-"}</td>
                      <td>{t.email || "-"}</td>
                      <td>
                        <span className="tp-chip mat">{Number(t.est_actif) === 1 ? "Actif" : "Inactif"}</span>
                      </td>
                      <td style={{ color: "rgba(240,236,228,.45)", fontSize: 12 }}>{t.username}</td>
                      <td>
                        <button className="tp-btn danger" onClick={() => remove(t.id_enseignant)} disabled={Number(t.est_actif) !== 1}>
                          {IcoTrash} Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
