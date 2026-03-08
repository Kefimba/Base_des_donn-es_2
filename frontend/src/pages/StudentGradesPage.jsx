import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { gradeService } from "../services/gradeService";

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
  @keyframes skeletonPulse {
    0%, 100% { opacity: .04; }
    50%       { opacity: .09; }
  }
  @keyframes scoreReveal {
    from { opacity: 0; transform: scale(.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .sg-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .sg-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .sg-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .sg-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .sg-inner {
    position: relative; z-index: 1;
    max-width: 1000px; margin: 0 auto;
  }

  /* ── Header ── */
  .sg-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .sg-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .sg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .sg-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sg-subtitle { font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300; }

  /* ── Summary row ── */
  .sg-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  @media (max-width: 600px) { .sg-summary { grid-template-columns: 1fr; } }

  .sg-summary-card {
    position: relative;
    border-radius: 18px; padding: 28px 32px;
    backdrop-filter: blur(20px); overflow: hidden;
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 20px 52px rgba(0,0,0,.4);
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .sg-summary-card::before {
    content: '';
    position: absolute; top: 0; left: 24px; right: 24px; height: 1.5px;
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }
  .sg-summary-card.moyenne {
    background: linear-gradient(145deg, rgba(59,130,246,.1) 0%, rgba(59,130,246,.04) 100%);
    border: 1px solid rgba(59,130,246,.2);
  }
  .sg-summary-card.moyenne::before {
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.6), rgba(147,197,253,.7), rgba(59,130,246,.6), transparent);
  }
  .sg-summary-card.mention {
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
  }
  .sg-summary-card.mention::before {
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.4), rgba(147,197,253,.5), rgba(59,130,246,.4), transparent);
  }

  .sg-summary-label {
    font-size: 10px; font-weight: 500; letter-spacing: .18em;
    text-transform: uppercase; margin: 0 0 10px;
  }
  .sg-summary-card.moyenne .sg-summary-label { color: rgba(96,165,250,.7); }
  .sg-summary-card.mention .sg-summary-label { color: rgba(96,165,250,.6); }

  .sg-moyenne-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 56px; font-weight: 300; line-height: 1;
    margin: 0; color: #f0ece4;
    animation: scoreReveal .7s .3s cubic-bezier(.16,1,.3,1) both;
  }
  .sg-moyenne-val span { font-size: 24px; color: rgba(240,236,228,.35); margin-left: 2px; }

  .sg-mention-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 18px; border-radius: 10px;
    font-size: 15px; font-weight: 500;
    animation: scoreReveal .7s .4s cubic-bezier(.16,1,.3,1) both;
  }

  .sg-summary-sub {
    font-size: 12px; color: rgba(240,236,228,.3); margin: 10px 0 0;
  }

  /* ── Main card ── */
  .sg-card {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px; padding: 32px 36px 36px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 24px 60px rgba(0,0,0,.45);
    overflow: hidden;
    animation: fadeUp .6s .2s cubic-bezier(.16,1,.3,1) both;
  }
  .sg-card::before {
    content: '';
    position: absolute; top: 0; left: 36px; right: 36px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.6), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }
  .sg-card-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  }
  .sg-card-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; flex-shrink: 0; color: #60a5fa;
  }
  .sg-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: #f0ece4; margin: 0;
  }

  /* ── Table ── */
  .sg-table-wrap { overflow-x: auto; }
  .sg-table { width: 100%; border-collapse: collapse; }
  .sg-table thead tr { border-bottom: 1px solid rgba(255,255,255,.07); }
  .sg-table th {
    font-size: 10px; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(96,165,250,.65);
    padding: 0 16px 14px; text-align: left; white-space: nowrap;
  }
  .sg-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .15s;
  }
  .sg-table tbody tr:hover { background: rgba(59,130,246,.05); }
  .sg-table tbody tr:last-child { border-bottom: none; }
  .sg-table td { padding: 13px 16px; font-size: 13px; color: rgba(240,236,228,.75); }

  /* Note badge */
  .sg-note {
    display: inline-flex; align-items: center; justify-content: center;
    width: 44px; height: 28px; border-radius: 7px;
    font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums;
  }
  .sg-note.excellent { background: rgba(34,197,94,.12);  border: 1px solid rgba(34,197,94,.25);  color: #86efac; }
  .sg-note.bien      { background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.25); color: #93c5fd; }
  .sg-note.passable  { background: rgba(245,158,11,.1);  border: 1px solid rgba(245,158,11,.2);  color: #fcd34d; }
  .sg-note.insuffisant { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.2);   color: #fca5a5; }

  /* Type chip */
  .sg-type {
    display: inline-flex; padding: 3px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 500; letter-spacing: .04em;
    background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.2); color: #a5b4fc;
  }

  /* Skeleton */
  .sg-skel-bar {
    height: 12px; border-radius: 6px;
    background: rgba(255,255,255,.06);
    animation: skeletonPulse 1.5s ease-in-out infinite;
  }
  .sg-empty {
    text-align: center; padding: 48px 0;
    color: rgba(240,236,228,.2); font-size: 13px;
  }
`;
if (!document.head.querySelector("[data-sg-style]")) {
  style.setAttribute("data-sg-style", "1");
  document.head.appendChild(style);
}

const IcoNotes = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const noteClass = (val) => {
  const n = parseFloat(val);
  if (n >= 16) return "excellent";
  if (n >= 12) return "bien";
  if (n >= 10) return "passable";
  return "insuffisant";
};

const mentionStyle = (mention) => {
  const m = (mention || "").toLowerCase();
  if (m.includes("très bien") || m.includes("excellent"))
    return { bg: "rgba(34,197,94,.12)", border: "rgba(34,197,94,.25)", color: "#86efac", dot: "#22c55e" };
  if (m.includes("bien"))
    return { bg: "rgba(59,130,246,.12)", border: "rgba(59,130,246,.25)", color: "#93c5fd", dot: "#3b82f6" };
  if (m.includes("assez") || m.includes("passable"))
    return { bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.2)", color: "#fcd34d", dot: "#f59e0b" };
  return { bg: "rgba(255,255,255,.06)", border: "rgba(255,255,255,.1)", color: "rgba(240,236,228,.5)", dot: "rgba(240,236,228,.3)" };
};

export default function StudentGradesPage() {
  const { user } = useAuth();
  const [data, setData]     = useState({ grades: [], moyenne: 0, mention: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = user?.student_id || user?.id;
    if (!id) { setLoading(false); return; }
    gradeService.byStudent(id)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.student_id, user?.id]);

  const ms = mentionStyle(data.mention);

  return (
    <div className="sg-root">
      <div className="sg-grid-bg" />
      <div className="sg-inner">

        {/* Header */}
        <div className="sg-header">
          <p className="sg-eyebrow">Espace étudiant · Résultats</p>
          <h1 className="sg-title">Mes <strong>notes</strong></h1>
          <p className="sg-subtitle">Consultez vos résultats académiques et votre moyenne générale</p>
        </div>

        {/* Summary */}
        <div className="sg-summary">
          <div className="sg-summary-card moyenne" style={{ animationDelay: ".1s" }}>
            <p className="sg-summary-label">Moyenne générale</p>
            <p className="sg-moyenne-val">
              {loading ? "—" : (parseFloat(data.moyenne) || 0).toFixed(2)}
              <span>/ 20</span>
            </p>
            <p className="sg-summary-sub">{data.grades.length} évaluation{data.grades.length !== 1 ? "s" : ""} enregistrée{data.grades.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="sg-summary-card mention" style={{ animationDelay: ".18s" }}>
            <p className="sg-summary-label">Mention</p>
            {loading ? (
              <div className="sg-skel-bar" style={{ width: "50%", height: 28, marginTop: 8 }} />
            ) : data.mention ? (
              <div className="sg-mention-badge" style={{
                background: ms.bg, border: `1px solid ${ms.border}`, color: ms.color
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: ms.dot, flexShrink: 0, display: "inline-block" }} />
                {data.mention}
              </div>
            ) : (
              <p style={{ color: "rgba(240,236,228,.25)", fontSize: 14, margin: "10px 0 0" }}>Non déterminée</p>
            )}
            <p className="sg-summary-sub">Résultat de la période en cours</p>
          </div>
        </div>

        {/* Table card */}
        <div className="sg-card">
          <div className="sg-card-header">
            <div className="sg-card-icon">{IcoNotes}</div>
            <h2 className="sg-card-title">Détail des notes</h2>
            <span style={{
              marginLeft: "auto", fontSize: 11, fontWeight: 500, letterSpacing: ".12em",
              textTransform: "uppercase", color: "rgba(96,165,250,.6)",
              background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.18)",
              borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap"
            }}>{data.grades.length} note{data.grades.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="sg-table-wrap">
            <table className="sg-table">
              <thead>
                <tr>
                  {["Matière", "Type d'évaluation", "Note"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [1,2,3,4].map((i) => (
                      <tr key={i}>
                        <td><div className="sg-skel-bar" style={{ width: "55%", animationDelay: `${i*.1}s` }} /></td>
                        <td><div className="sg-skel-bar" style={{ width: "35%", animationDelay: `${i*.1+.05}s` }} /></td>
                        <td><div className="sg-skel-bar" style={{ width: "20%", animationDelay: `${i*.1+.1}s` }} /></td>
                      </tr>
                    ))
                  : data.grades.length === 0
                  ? <tr><td colSpan={3}><div className="sg-empty">Aucune note disponible pour le moment</div></td></tr>
                  : data.grades.map((g) => (
                      <tr key={g.id}>
                        <td style={{ color: "#f0ece4", fontWeight: 500 }}>{g.matiere}</td>
                        <td><span className="sg-type">{g.type_evaluation}</span></td>
                        <td>
                          <span className={`sg-note ${noteClass(g.valeur)}`}>
                            {g.valeur}
                          </span>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}