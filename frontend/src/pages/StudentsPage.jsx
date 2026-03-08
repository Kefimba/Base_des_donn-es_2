import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { studentService } from "../services/studentService";
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
  @keyframes skeletonPulse {
    0%, 100% { opacity: .04; }
    50%       { opacity: .09; }
  }

  .sp-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .sp-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .sp-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .sp-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .sp-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  /* -- Header -- */
  .sp-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .sp-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .sp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .sp-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sp-subtitle { font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300; }

  /* -- Card -- */
  .sp-card {
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
  .sp-card::before {
    content: '';
    position: absolute; top: 0; left: 36px; right: 36px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.6), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }
  .sp-card-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  }
  .sp-card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; flex-shrink: 0; color: #60a5fa;
  }
  .sp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #f0ece4; margin: 0;
  }

  /* -- Form -- */
  .sp-form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px; margin-bottom: 24px;
  }
  .sp-field-label {
    display: block; font-size: 10px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: rgba(96,165,250,.75); margin-bottom: 7px;
  }
  .sp-input, .sp-select {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 10px; padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; color: #f0ece4; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    appearance: none; -webkit-appearance: none;
  }
  .sp-input::placeholder { color: rgba(240,236,228,.2); }
  .sp-input:focus, .sp-select:focus {
    border-color: rgba(59,130,246,.6);
    background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }
  .sp-select option { background: #161b27; color: #f0ece4; }
  .sp-select-wrap { position: relative; }
  .sp-select-wrap::after {
    content: ''; position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent; border-right: 4px solid transparent;
    border-top: 5px solid rgba(96,165,250,.6); pointer-events: none;
  }

  /* -- Alert -- */
  .sp-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: 12px;
    font-size: 13px; margin-bottom: 20px;
    animation: fadeUp .3s ease both;
  }
  .sp-alert.success { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #86efac; }
  .sp-alert.error   { background: rgba(239,68,68,.1);  border: 1px solid rgba(239,68,68,.25);  color: #fca5a5; }

  /* -- Form footer -- */
  .sp-form-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 20px; border-top: 1px solid rgba(255,255,255,.06);
  }
  .sp-form-hint { font-size: 11.5px; color: rgba(240,236,228,.22); }

  /* -- Buttons -- */
  .sp-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
    box-shadow: 0 4px 16px rgba(59,130,246,.3);
  }
  .sp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(59,130,246,.4); }
  .sp-btn:disabled { opacity: .5; cursor: not-allowed; }
  .sp-btn.ghost {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    box-shadow: none; color: rgba(240,236,228,.7);
  }
  .sp-btn.ghost:hover:not(:disabled) {
    background: rgba(255,255,255,.08); transform: none;
    box-shadow: none;
  }
  .sp-btn.danger {
    background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.2);
    color: #fca5a5; box-shadow: none;
    padding: 7px 14px; font-size: 11px;
  }
  .sp-btn.danger:hover:not(:disabled) {
    background: rgba(239,68,68,.18); transform: none; box-shadow: none;
  }

  /* -- Search bar -- */
  .sp-search-row {
    display: flex; gap: 10px; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap;
  }
  .sp-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .sp-search-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(96,165,250,.45); pointer-events: none;
  }
  .sp-search-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09);
    border-radius: 10px; padding: 11px 14px 11px 38px;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: #f0ece4; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .sp-search-input::placeholder { color: rgba(240,236,228,.2); }
  .sp-search-input:focus {
    border-color: rgba(59,130,246,.6); background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }

  /* -- Table -- */
  .sp-table-wrap { overflow-x: auto; }
  .sp-table { width: 100%; border-collapse: collapse; }
  .sp-table thead tr { border-bottom: 1px solid rgba(255,255,255,.07); }
  .sp-table th {
    font-size: 10px; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(96,165,250,.65);
    padding: 0 16px 14px; text-align: left; white-space: nowrap;
  }
  .sp-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .15s;
  }
  .sp-table tbody tr:hover { background: rgba(59,130,246,.05); }
  .sp-table tbody tr:last-child { border-bottom: none; }
  .sp-table td { padding: 12px 16px; font-size: 13px; color: rgba(240,236,228,.75); }

  /* Avatar */
  .sp-avatar-cell { display: flex; align-items: center; gap: 10px; }
  .sp-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(59,130,246,.25), rgba(99,102,241,.25));
    border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center;
    font-size: 11px; font-weight: 500; color: #93c5fd; flex-shrink: 0;
  }
  .sp-chip {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 500;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
    color: rgba(240,236,228,.5); font-variant-numeric: tabular-nums;
  }

  /* -- Pagination -- */
  .sp-pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 20px; border-top: 1px solid rgba(255,255,255,.06);
    flex-wrap: wrap; gap: 12px;
  }
  .sp-pagination-info {
    font-size: 12px; color: rgba(240,236,228,.3);
  }
  .sp-pagination-btns { display: flex; gap: 8px; align-items: center; }
  .sp-page-btn {
    width: 32px; height: 32px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
    color: rgba(240,236,228,.6); cursor: pointer; font-size: 12px;
    display: grid; place-items: center;
    transition: background .15s, border-color .15s, color .15s;
  }
  .sp-page-btn:hover:not(:disabled) {
    background: rgba(59,130,246,.12); border-color: rgba(59,130,246,.3); color: #93c5fd;
  }
  .sp-page-btn:disabled { opacity: .3; cursor: not-allowed; }
  .sp-page-label {
    font-size: 12px; color: rgba(240,236,228,.4);
    padding: 0 4px; white-space: nowrap;
  }

  /* skeleton rows */
  .sp-skel-row td { padding: 12px 16px; }
  .sp-skel-bar {
    height: 12px; border-radius: 6px;
    background: rgba(255,255,255,.06);
    animation: skeletonPulse 1.5s ease-in-out infinite;
  }

  .sp-empty {
    text-align: center; padding: 48px 0;
    color: rgba(240,236,228,.2); font-size: 13px;
  }
`;
if (!document.head.querySelector("[data-sp-style]")) {
  style.setAttribute("data-sp-style", "1");
  document.head.appendChild(style);
}

// Icons
const IcoAdd = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
const IcoList = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IcoSave = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IcoSearch = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoTrash = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IcoPrev = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IcoNext = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;

const initials = (prenom, nom) =>
  `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase() || "?";

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [list, setList]         = useState([]);
  const [meta, setMeta]         = useState({ page: 1, pages: 1, total: 0, per_page: 10 });
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("actif");
  const [message, setMessage]   = useState({ text: "", type: "" });
  const [loading, setLoading]   = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    matricule: "",
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
  });

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const notify = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const data = await studentService.getAll({ page, perPage: meta.per_page, search, status });
      setList(data.items || []);
      setMeta(data);
    } catch {
      notify("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [status]);

  const create = async () => {
    if (!isAdmin) return;
    setCreating(true);
    try {
      await studentService.create(form);
      notify("Étudiant créé avec succès");
      setForm({ username: "", password: "", matricule: "", nom: "", prenom: "", telephone: "", email: "" });
      load(meta.page);
    } catch (err) {
      notify("Erreur lors de la création : " + (err.message || "inconnue"), "error");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id) => {
    if (!isAdmin) return;
    try {
      await studentService.remove(id);
      notify("Étudiant supprimé");
      load(meta.page);
    } catch (err) {
      notify("Erreur lors de la suppression : " + (err.message || "inconnue"), "error");
    }
  };

  return (
    <div className="sp-root">
      <div className="sp-grid-bg" />
      <div className="sp-inner">

        {/* Header */}
        <div className="sp-header">
          <p className="sp-eyebrow">Administration · Scolarité</p>
          <h1 className="sp-title">Gestion des <strong>étudiants</strong></h1>
          <p className="sp-subtitle">Inscrivez, recherchez et gérez les étudiants de l'établissement</p>
        </div>

        {/* Alert */}
        {message.text && (
          <div className={`sp-alert ${message.type}`}>
            {message.type === "success"
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            }
            {message.text}
          </div>
        )}

        {/* Form card */}
        {isAdmin && <div className="sp-card" style={{ animationDelay: ".1s" }}>
          <div className="sp-card-header">
            <div className="sp-card-icon">{IcoAdd}</div>
            <h2 className="sp-card-title">Ajouter un étudiant</h2>
          </div>

          <div className="sp-form-grid">
            {[
              { key: "prenom",    label: "Prénom",      placeholder: "ex. Fatou", type: "text" },
              { key: "nom",       label: "Nom",         placeholder: "ex. Diop", type: "text" },
              { key: "matricule", label: "Matricule",   placeholder: "ex. ETU-0081", type: "text" },
              { key: "telephone", label: "Téléphone",   placeholder: "ex. 701111111", type: "text" },
              { key: "email",     label: "Email",       placeholder: "ex. fatou.diop@etu.sn", type: "email" },
              { key: "username",  label: "Identifiant", placeholder: "ex. etudiant001", type: "text" },
              { key: "password",  label: "Mot de passe",placeholder: "••••••••", type: "password" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="sp-field-label">{label}</label>
                <input className="sp-input" type={type} placeholder={placeholder}
                  value={form[key]} onChange={f(key)} />
              </div>
            ))}
          </div>

          <div className="sp-form-footer">
            <span className="sp-form-hint">7 champs · POST /students</span>
            <button className="sp-btn" onClick={create} disabled={creating}>
              {creating
                ? <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/></svg> Enregistrement…</>
                : <>{IcoSave} Enregistrer</>
              }
            </button>
          </div>
        </div>}

        {/* List card */}
        <div className="sp-card" style={{ animationDelay: ".2s" }}>
          <div className="sp-card-header">
            <div className="sp-card-icon">{IcoList}</div>
            <h2 className="sp-card-title">Liste des étudiants</h2>
            <span style={{
              marginLeft: "auto", fontSize: 11, fontWeight: 500, letterSpacing: ".12em",
              textTransform: "uppercase", color: "rgba(96,165,250,.6)",
              background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.18)",
              borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap"
            }}>{meta.total ?? list.length} étudiant{(meta.total ?? list.length) !== 1 ? "s" : ""}</span>
          </div>

          {/* Search */}
          <div className="sp-search-row">
            <div className="sp-search-wrap">
              <span className="sp-search-icon">{IcoSearch}</span>
              <input
                className="sp-search-input"
                type="text"
                placeholder="Rechercher par nom, prénom, matricule…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load(1)}
              />
            </div>
            <button className="sp-btn ghost" onClick={() => load(1)}>
              {IcoSearch} Filtrer
            </button>
            <select className="sp-select" style={{ width: 180 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
              <option value="tous">Tous</option>
            </select>
          </div>

          {/* Table */}
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  {(isAdmin
                    ? ["ID", "Étudiant", "Matricule", "Téléphone", "Email", "Statut", "Identifiant", "Action"]
                    : ["ID", "Étudiant", "Matricule", "Téléphone", "Email", "Statut", "Identifiant"]
                  ).map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="sp-skel-row">
                        <td><div className="sp-skel-bar" style={{ width: "30%", animationDelay: `${i * .1}s` }} /></td>
                        <td><div className="sp-skel-bar" style={{ width: "60%", animationDelay: `${i * .1 + .05}s` }} /></td>
                        <td><div className="sp-skel-bar" style={{ width: "40%", animationDelay: `${i * .1 + .1}s` }} /></td>
                        <td><div className="sp-skel-bar" style={{ width: "35%", animationDelay: `${i * .1 + .12}s` }} /></td>
                        <td><div className="sp-skel-bar" style={{ width: "55%", animationDelay: `${i * .1 + .15}s` }} /></td>
                        <td><div className="sp-skel-bar" style={{ width: "30%", animationDelay: `${i * .1 + .18}s` }} /></td>
                        <td><div className="sp-skel-bar" style={{ width: "45%", animationDelay: `${i * .1 + .2}s` }} /></td>
                        {isAdmin && <td><div className="sp-skel-bar" style={{ width: "20%", animationDelay: `${i * .1 + .22}s` }} /></td>}
                      </tr>
                    ))
                  : list.length === 0
                  ? <tr><td colSpan={isAdmin ? 8 : 7}><div className="sp-empty">Aucun étudiant trouvé</div></td></tr>
                  : list.map((row) => (
                      <tr key={row.id_etudiant}>
                        <td><span className="sp-chip">{row.id_etudiant}</span></td>
                        <td>
                          <div className="sp-avatar-cell">
                            <div className="sp-avatar">{initials(row.prenom, row.nom)}</div>
                            <span style={{ color: "#f0ece4" }}>{row.prenom} {row.nom}</span>
                          </div>
                        </td>
                        <td><span className="sp-chip">{row.matricule}</span></td>
                        <td>{row.telephone || "-"}</td>
                        <td>{row.email || "-"}</td>
                        <td>
                          <span className="sp-chip">{Number(row.est_actif) === 1 ? "Actif" : "Inactif"}</span>
                        </td>
                        <td>{row.username || "-"}</td>
                        {isAdmin && <td>
                          <button className="sp-btn danger" onClick={() => remove(row.id_etudiant)} disabled={Number(row.est_actif) !== 1}>
                            {IcoTrash} Supprimer
                          </button>
                        </td>}
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="sp-pagination">
            <span className="sp-pagination-info">
              Page <strong style={{ color: "rgba(240,236,228,.6)" }}>{meta.page}</strong> sur <strong style={{ color: "rgba(240,236,228,.6)" }}>{meta.pages}</strong>
              {meta.total ? ` · ${meta.total} résultats` : ""}
            </span>
            <div className="sp-pagination-btns">
              <button className="sp-page-btn" disabled={meta.page <= 1} onClick={() => load(meta.page - 1)} title="Page précédente">
                {IcoPrev}
              </button>
              {Array.from({ length: Math.min(meta.pages, 5) }, (_, i) => {
                const p = meta.pages <= 5 ? i + 1 : Math.max(1, meta.page - 2) + i;
                if (p > meta.pages) return null;
                return (
                  <button
                    key={p}
                    className="sp-page-btn"
                    onClick={() => load(p)}
                    style={p === meta.page ? {
                      background: "rgba(59,130,246,.2)", borderColor: "rgba(59,130,246,.4)", color: "#93c5fd"
                    } : {}}
                  >{p}</button>
                );
              })}
              <button className="sp-page-btn" disabled={meta.page >= meta.pages} onClick={() => load(meta.page + 1)} title="Page suivante">
                {IcoNext}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

