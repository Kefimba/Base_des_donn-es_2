import { useEffect, useState } from "react";

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
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .td-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .td-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .td-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .td-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .td-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
  }

  /* ── Header ── */
  .td-header {
    margin-bottom: 40px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .td-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .td-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .td-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .td-subtitle {
    font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300;
  }

  /* ── Stat grid ── */
  .td-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  @media (max-width: 768px) { .td-stats { grid-template-columns: 1fr; } }

  /* ── Stat card ── */
  .td-stat {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px;
    padding: 32px 32px 28px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 20px 56px rgba(0,0,0,.42);
    overflow: hidden;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
    transition: transform .2s, box-shadow .2s;
    cursor: default;
  }
  .td-stat:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.05) inset, 0 28px 64px rgba(0,0,0,.5), 0 0 40px rgba(59,130,246,.08);
  }
  .td-stat::before {
    content: '';
    position: absolute; top: 0; left: 24px; right: 24px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.55), rgba(147,197,253,.7), rgba(59,130,246,.55), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }

  /* Accent glow per card */
  .td-stat::after {
    content: '';
    position: absolute;
    width: 120px; height: 120px;
    border-radius: 50%;
    filter: blur(40px);
    pointer-events: none;
    bottom: -30px; right: -20px;
    opacity: .35;
    transition: opacity .3s;
  }
  .td-stat:hover::after { opacity: .55; }
  .td-stat[data-accent="blue"]::after   { background: #3b82f6; }
  .td-stat[data-accent="indigo"]::after { background: #6366f1; }
  .td-stat[data-accent="amber"]::after  { background: #f59e0b; }

  .td-stat-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 20px;
  }
  .td-stat-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: grid; place-items: center; flex-shrink: 0;
  }
  .td-stat-icon-wrap.blue   { background: rgba(59,130,246,.15);  border: 1px solid rgba(59,130,246,.25); color: #60a5fa; }
  .td-stat-icon-wrap.indigo { background: rgba(99,102,241,.15);  border: 1px solid rgba(99,102,241,.25); color: #a5b4fc; }
  .td-stat-icon-wrap.amber  { background: rgba(245,158,11,.12);  border: 1px solid rgba(245,158,11,.25); color: #fcd34d; }

  .td-stat-trend {
    font-size: 11px; font-weight: 500; letter-spacing: .04em;
    padding: 3px 8px; border-radius: 6px;
  }
  .td-stat-trend.up   { background: rgba(34,197,94,.1);  border: 1px solid rgba(34,197,94,.2);  color: #86efac; }
  .td-stat-trend.warn { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.2); color: #fcd34d; }
  .td-stat-trend.neu  { background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.2); color: #a5b4fc; }

  .td-stat-label {
    font-size: 10px; font-weight: 500; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(96,165,250,.65);
    margin: 0 0 8px;
  }
  .td-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px; font-weight: 300; color: #f0ece4;
    line-height: 1; margin: 0;
    animation: countUp .7s ease both;
  }
  .td-stat-desc {
    font-size: 12px; color: rgba(240,236,228,.3);
    margin: 8px 0 0; font-weight: 300;
  }
`;
if (!document.head.querySelector("[data-td-style]")) {
  style.setAttribute("data-td-style", "1");
  document.head.appendChild(style);
}

const IcoClasses = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IcoStudents = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoPending = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const stats = [
  {
    label: "Classes",
    value: "4",
    desc: "Groupes assignés ce semestre",
    icon: IcoClasses,
    iconClass: "blue",
    accent: "blue",
    trend: "+ 1 vs semestre dernier",
    trendClass: "up",
    delay: ".1s",
  },
  {
    label: "Étudiants",
    value: "126",
    desc: "Inscrits dans vos classes",
    icon: IcoStudents,
    iconClass: "indigo",
    accent: "indigo",
    trend: "Répartis sur 4 classes",
    trendClass: "neu",
    delay: ".18s",
  },
  {
    label: "Notes en attente",
    value: "18",
    desc: "À saisir avant la clôture",
    icon: IcoPending,
    iconClass: "amber",
    accent: "amber",
    trend: "Action requise",
    trendClass: "warn",
    delay: ".26s",
  },
];

export default function TeacherDashboardPage() {
  return (
    <div className="td-root">
      <div className="td-grid-bg" />
      <div className="td-inner">

        <div className="td-header">
          <p className="td-eyebrow">Espace enseignant · Vue d'ensemble</p>
          <h1 className="td-title">Dashboard <strong>enseignant</strong></h1>
          <p className="td-subtitle">Suivez vos classes, vos étudiants et les notes en attente de saisie</p>
        </div>

        <div className="td-stats">
          {stats.map((s) => (
            <div
              className="td-stat"
              key={s.label}
              data-accent={s.accent}
              style={{ animationDelay: s.delay }}
            >
              <div className="td-stat-top">
                <div className={`td-stat-icon-wrap ${s.iconClass}`}>{s.icon}</div>
                <span className={`td-stat-trend ${s.trendClass}`}>{s.trend}</span>
              </div>
              <p className="td-stat-label">{s.label}</p>
              <p className="td-stat-value">{s.value}</p>
              <p className="td-stat-desc">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}