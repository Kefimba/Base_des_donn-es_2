import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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

  .tt-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .tt-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .tt-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .tt-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .tt-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  /* ── Header ── */
  .tt-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .tt-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .tt-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .tt-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .tt-subtitle {
    font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300;
  }

  /* ── Section card ── */
  .tt-card {
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
  .tt-card::before {
    content: '';
    position: absolute; top: 0; left: 36px; right: 36px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.6), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }
  .tt-card-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  }
  .tt-card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; flex-shrink: 0; color: #60a5fa;
  }
  .tt-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #f0ece4; margin: 0;
  }

  /* ── Form grid ── */
  .tt-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .tt-field-label {
    display: block; font-size: 10px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: rgba(96,165,250,.75); margin-bottom: 7px;
  }
  .tt-input, .tt-select {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 400; color: #f0ece4;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    appearance: none; -webkit-appearance: none;
  }
  .tt-input::placeholder { color: rgba(240,236,228,.2); }
  .tt-input:focus, .tt-select:focus {
    border-color: rgba(59,130,246,.6);
    background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }
  .tt-select option {
    background: #161b27; color: #f0ece4;
  }
  .tt-select-wrap {
    position: relative;
  }
  .tt-select-wrap::after {
    content: '';
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid rgba(96,165,250,.6);
    pointer-events: none;
  }

  /* ── Alert ── */
  .tt-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: 12px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px;
    animation: fadeUp .3s ease both;
  }
  .tt-alert.success {
    background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #86efac;
  }
  .tt-alert.error {
    background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.25); color: #fca5a5;
  }

  /* ── Footer row ── */
  .tt-form-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .tt-form-hint {
    font-size: 11.5px; color: rgba(240,236,228,.22);
  }

  /* ── Button ── */
  .tt-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 4px 16px rgba(59,130,246,.3), 0 1px 4px rgba(0,0,0,.3);
  }
  .tt-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59,130,246,.4);
  }
  .tt-btn:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Table ── */
  .tt-table-wrap {
    overflow-x: auto;
  }
  .tt-table {
    width: 100%; border-collapse: collapse;
  }
  .tt-table thead tr {
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .tt-table th {
    font-size: 10px; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(96,165,250,.65);
    padding: 0 16px 14px; text-align: left; white-space: nowrap;
  }
  .tt-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .15s;
  }
  .tt-table tbody tr:hover { background: rgba(59,130,246,.05); }
  .tt-table td {
    padding: 13px 16px; font-size: 13px; color: rgba(240,236,228,.8);
    white-space: nowrap;
  }
  .tt-table tbody tr:last-child { border-bottom: none; }

  /* Chips */
  .tt-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 500;
  }
  .tt-chip.day {
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    color: #93c5fd;
  }
  .tt-chip.time {
    background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.2);
    color: #a5b4fc; font-variant-numeric: tabular-nums;
  }
  .tt-chip.room {
    background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.2);
    color: #86efac;
  }

  .tt-empty {
    text-align: center; padding: 48px 0;
    color: rgba(240,236,228,.2); font-size: 13px;
  }
  .tt-empty svg { margin-bottom: 12px; opacity: .2; }
`;
if (!document.head.querySelector("[data-tt-style]")) {
  style.setAttribute("data-tt-style", "1");
  document.head.appendChild(style);
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const IcoCalendar = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoList = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IcoSave = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="tt-field-label">{label}</label>
      <div className="tt-select-wrap">
        <select className="tt-select" value={value} onChange={onChange}>
          <option value="">{placeholder || `— ${label} —`}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [items, setItems]           = useState([]);
  const [classes, setClasses]       = useState([]);
  const [matieres, setMatieres]     = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [message, setMessage]       = useState({ text: "", type: "" });
  const [creating, setCreating]     = useState(false);
  const [form, setForm] = useState({
    classe_id: "", matiere_id: "", enseignant_id: "",
    jour: "", heure_debut: "08:00", heure_fin: "10:00", salle: "",
  });

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    api.get("/timetable").then(({ data }) => setItems(data)).catch(() => {});
    if (isAdmin) {
      api.get("/classes").then(({ data }) => setClasses(data || [])).catch(() => {});
      api.get("/matieres").then(({ data }) => setMatieres(data || [])).catch(() => {});
      api.get("/teachers").then(({ data }) => setEnseignants(data || [])).catch(() => {});
    }
  }, [isAdmin]);

  const create = async () => {
    setCreating(true);
    try {
      await api.post("/timetable", form);
      setMessage({ text: "Cours planifié avec succès", type: "success" });
      const { data } = await api.get("/timetable");
      setItems(data);
      setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    } catch (err) {
      setMessage({ text: "Erreur lors de la planification : " + (err.message || "inconnue"), type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="tt-root">
      <div className="tt-grid-bg" />
      <div className="tt-inner">

        {/* Header */}
        <div className="tt-header">
          <p className="tt-eyebrow">Administration · Planification</p>
          <h1 className="tt-title">Emploi du <strong>temps</strong></h1>
          <p className="tt-subtitle">Planifiez et visualisez les créneaux horaires par classe, matière et enseignant</p>
        </div>

        {/* Alert */}
        {message.text && (
          <div className={`tt-alert ${message.type}`}>
            {message.type === "success"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {message.text}
          </div>
        )}

        {/* Form card */}
        {isAdmin && <div className="tt-card" style={{ animationDelay: ".1s" }}>
          <div className="tt-card-header">
            <div className="tt-card-icon">{IcoCalendar}</div>
            <h2 className="tt-card-title">Planifier un cours</h2>
          </div>

          <div className="tt-form-grid">
            <SelectField label="Classe" value={form.classe_id} onChange={f("classe_id")}
              options={classes.map((c) => ({ value: c.id_classe, label: c.nom_classe }))} />

            <SelectField label="Matière" value={form.matiere_id} onChange={f("matiere_id")}
              options={matieres.map((m) => ({ value: m.id_matiere, label: m.libelle }))} />

            <SelectField label="Enseignant" value={form.enseignant_id} onChange={f("enseignant_id")}
              options={enseignants.map((e) => ({ value: e.id_enseignant, label: `${e.prenom} ${e.nom}` }))} />

            <SelectField label="Jour" value={form.jour} onChange={f("jour")}
              options={JOURS.map((j) => ({ value: j, label: j }))} />

            <div>
              <label className="tt-field-label">Heure de début</label>
              <input className="tt-input" type="time" value={form.heure_debut} onChange={f("heure_debut")} />
            </div>

            <div>
              <label className="tt-field-label">Heure de fin</label>
              <input className="tt-input" type="time" value={form.heure_fin} onChange={f("heure_fin")} />
            </div>

            <div>
              <label className="tt-field-label">Salle</label>
              <input className="tt-input" type="text" placeholder="ex. Amphi A" value={form.salle} onChange={f("salle")} />
            </div>
          </div>

          <div className="tt-form-footer">
            <span className="tt-form-hint">7 champs · POST /timetable</span>
            <button className="tt-btn" onClick={create} disabled={creating}>
              {creating
                ? <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                  </svg> Planification…</>
                : <>{IcoSave} Planifier</>
              }
            </button>
          </div>
        </div>}

        {/* Table card */}
        <div className="tt-card" style={{ animationDelay: ".2s" }}>
          <div className="tt-card-header">
            <div className="tt-card-icon">{IcoList}</div>
            <h2 className="tt-card-title">Créneaux planifiés</h2>
            <span style={{
              marginLeft: "auto", fontSize: 11, fontWeight: 500, letterSpacing: ".12em",
              textTransform: "uppercase", color: "rgba(96,165,250,.6)",
              background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.18)",
              borderRadius: 6, padding: "3px 10px"
            }}>{items.length} créneau{items.length !== 1 ? "x" : ""}</span>
          </div>

          <div className="tt-table-wrap">
            {items.length === 0 ? (
              <div className="tt-empty">
                <div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                Aucun créneau planifié pour le moment
              </div>
            ) : (
              <table className="tt-table">
                <thead>
                  <tr>
                    {["Jour", "Horaire", "Classe", "Matière", "Enseignant", "Salle"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((x) => (
                    <tr key={x.id}>
                      <td><span className="tt-chip day">{x.jour}</span></td>
                      <td><span className="tt-chip time">{x.heure_debut} – {x.heure_fin}</span></td>
                      <td style={{ color: "#f0ece4" }}>{x.classe}</td>
                      <td>{x.matiere}</td>
                      <td>{x.enseignant}</td>
                      <td><span className="tt-chip room">{x.salle}</span></td>
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
