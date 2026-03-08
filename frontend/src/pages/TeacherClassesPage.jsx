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

  .tcl-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .tcl-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .tcl-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .tcl-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .tcl-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  /* ── Header ── */
  .tcl-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .tcl-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .tcl-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .tcl-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .tcl-subtitle {
    font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300;
  }

  /* ── Classes grid ── */
  .tcl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  /* ── Class card ── */
  .tcl-card {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 28px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 20px 52px rgba(0,0,0,.4);
    overflow: hidden;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
    transition: transform .2s, box-shadow .2s, border-color .2s;
    cursor: default;
  }
  .tcl-card:hover {
    transform: translateY(-3px);
    border-color: rgba(59,130,246,.25);
    box-shadow: 0 0 0 1px rgba(59,130,246,.1) inset, 0 28px 64px rgba(0,0,0,.5), 0 0 48px rgba(59,130,246,.07);
  }
  .tcl-card::before {
    content: '';
    position: absolute; top: 0; left: 24px; right: 24px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.65), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }

  /* Card glow */
  .tcl-card::after {
    content: '';
    position: absolute; bottom: -40px; right: -20px;
    width: 130px; height: 130px; border-radius: 50%;
    filter: blur(45px); pointer-events: none;
    background: rgba(59,130,246,.2); opacity: 0;
    transition: opacity .3s;
  }
  .tcl-card:hover::after { opacity: 1; }

  .tcl-card-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 20px;
  }
  .tcl-card-icon {
    width: 46px; height: 46px; border-radius: 13px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; color: #60a5fa; flex-shrink: 0;
  }
  .tcl-badge {
    font-size: 10px; font-weight: 500; letter-spacing: .12em;
    text-transform: uppercase; padding: 4px 10px; border-radius: 6px;
    background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.2);
    color: rgba(96,165,250,.8);
  }

  .tcl-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: #f0ece4;
    margin: 0 0 4px; line-height: 1.2;
  }
  .tcl-card-sub {
    font-size: 12px; color: rgba(240,236,228,.35); margin: 0 0 20px;
  }

  .tcl-card-divider {
    height: 1px; background: rgba(255,255,255,.06); margin-bottom: 16px;
  }

  .tcl-card-meta {
    display: flex; gap: 16px; flex-wrap: wrap;
  }
  .tcl-meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: rgba(240,236,228,.45);
  }
  .tcl-meta-item svg { color: rgba(96,165,250,.5); flex-shrink: 0; }
  .tcl-meta-item strong { color: rgba(240,236,228,.75); font-weight: 500; }

  /* ── Loading skeleton ── */
  @keyframes skeletonPulse {
    0%, 100% { opacity: .04; }
    50%       { opacity: .09; }
  }
  .tcl-skeleton {
    background: rgba(255,255,255,.06);
    border-radius: 18px; height: 180px;
    animation: skeletonPulse 1.5s ease-in-out infinite;
  }
  .tcl-skeleton:nth-child(2) { animation-delay: .15s; }
  .tcl-skeleton:nth-child(3) { animation-delay: .3s; }

  /* ── Empty state ── */
  .tcl-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 72px 24px; text-align: center;
    background: linear-gradient(145deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.01) 100%);
    border: 1px solid rgba(255,255,255,.06); border-radius: 18px;
  }
  .tcl-empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
    display: grid; place-items: center; color: rgba(96,165,250,.4);
    margin-bottom: 16px;
  }
  .tcl-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: rgba(240,236,228,.4);
    margin: 0 0 6px;
  }
  .tcl-empty-desc {
    font-size: 13px; color: rgba(240,236,228,.2); margin: 0;
  }
`;
if (!document.head.querySelector("[data-tcl-style]")) {
  style.setAttribute("data-tcl-style", "1");
  document.head.appendChild(style);
}

const IcoClass = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IcoStudents = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoLevel = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IcoFiliere = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);

// Palette de couleurs cycliques pour les cards
const ACCENTS = [
  { icon: "rgba(59,130,246,.12)", border: "rgba(59,130,246,.22)", text: "#60a5fa" },
  { icon: "rgba(99,102,241,.12)", border: "rgba(99,102,241,.22)", text: "#a5b4fc" },
  { icon: "rgba(6,182,212,.12)",  border: "rgba(6,182,212,.22)",  text: "#67e8f9" },
  { icon: "rgba(34,197,94,.1)",   border: "rgba(34,197,94,.2)",   text: "#86efac" },
];

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/classes")
      .then(({ data }) => setClasses(data))
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="tcl-root">
      <div className="tcl-grid-bg" />
      <div className="tcl-inner">

        {/* Header */}
        <div className="tcl-header">
          <p className="tcl-eyebrow">Espace enseignant · Affectations</p>
          <h1 className="tcl-title">Mes <strong>classes</strong></h1>
          <p className="tcl-subtitle">Consultez les groupes qui vous sont affectés pour ce semestre</p>
        </div>

        {/* Grid */}
        <div className="tcl-grid">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="tcl-skeleton" />)
          ) : classes.length === 0 ? (
            <div className="tcl-empty">
              <div className="tcl-empty-icon">{IcoClass}</div>
              <p className="tcl-empty-title">Aucune classe affectée</p>
              <p className="tcl-empty-desc">Vos affectations apparaîtront ici une fois assignées par l'administration</p>
            </div>
          ) : (
            classes.map((cls, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <div
                  className="tcl-card"
                  key={cls.id_classe ?? cls._id ?? i}
                  style={{ animationDelay: `${.08 * i}s` }}
                >
                  <div className="tcl-card-top">
                    <div className="tcl-card-icon" style={{
                      background: accent.icon, borderColor: accent.border, color: accent.text
                    }}>
                      {IcoClass}
                    </div>
                    <span className="tcl-badge" style={{
                      background: accent.icon, borderColor: accent.border, color: accent.text
                    }}>
                      Classe
                    </span>
                  </div>

                  <p className="tcl-card-name">{cls.nom_classe ?? cls.nom ?? "—"}</p>
                  <p className="tcl-card-sub">
                    {cls.filiere?.nom ?? cls.filiere_nom ?? cls.filiere ?? "Filière non renseignée"}
                  </p>

                  <div className="tcl-card-divider" />

                  <div className="tcl-card-meta">
                    {(cls.niveau || cls.niveau_classe) && (
                      <span className="tcl-meta-item">
                        {IcoLevel}
                        <span>Niveau <strong>{cls.niveau ?? cls.niveau_classe}</strong></span>
                      </span>
                    )}
                    {cls.effectif != null && (
                      <span className="tcl-meta-item">
                        {IcoStudents}
                        <strong>{cls.effectif}</strong>&nbsp;<span>étudiants</span>
                      </span>
                    )}
                    {(cls.filiere_code ?? cls.code_filiere) && (
                      <span className="tcl-meta-item">
                        {IcoFiliere}
                        <span>Code <strong>{cls.filiere_code ?? cls.code_filiere}</strong></span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}