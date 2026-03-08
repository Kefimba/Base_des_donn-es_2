import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import StatCard from "../components/StatCard";
import { dashboardService } from "../services/dashboardService";

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
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .dash-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .dash-root::before {
    content: '';
    position: fixed;
    width: 700px; height: 700px;
    top: -250px; right: -200px;
    border-radius: 50%;
    filter: blur(150px);
    pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.14) 0%, transparent 70%);
    animation: subtlePulse 10s ease-in-out infinite;
  }
  .dash-root::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px;
    bottom: -150px; left: -100px;
    border-radius: 50%;
    filter: blur(130px);
    pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 8s 4s ease-in-out infinite;
  }
  .dash-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .dash-inner {
    position: relative; z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* -- Header -- */
  .dash-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .dash-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .dash-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .dash-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .dash-subtitle {
    font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300;
  }

  /* -- Stat cards row -- */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  @media (max-width: 768px) { .dash-stats { grid-template-columns: 1fr; } }

  .dash-stat {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px;
    padding: 24px 28px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 16px 48px rgba(0,0,0,.4);
    overflow: hidden;
    animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both;
  }
  .dash-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.45), transparent);
  }
  .dash-stat-label {
    font-size: 10px; font-weight: 500; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(96,165,250,.65); margin: 0 0 10px;
  }
  .dash-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px; font-weight: 300; color: #f0ece4;
    line-height: 1; margin: 0;
    animation: countUp .6s ease both;
  }
  .dash-stat-value span {
    font-size: 22px; color: rgba(240,236,228,.45); margin-left: 2px;
  }
  .dash-stat-icon {
    position: absolute; bottom: 16px; right: 20px;
    opacity: .1; color: #3b82f6;
  }

  /* -- Chart grid -- */
  .dash-charts-row {
    display: grid;
    gap: 20px;
    margin-bottom: 20px;
  }
  .dash-charts-row.two-col { grid-template-columns: 1fr 1fr; }
  .dash-charts-row.one-col { grid-template-columns: 1fr; }
  @media (max-width: 900px) { .dash-charts-row.two-col { grid-template-columns: 1fr; } }

  /* -- Chart card -- */
  .dash-card {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 28px 32px 32px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 24px 60px rgba(0,0,0,.45);
    overflow: hidden;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .dash-card::before {
    content: '';
    position: absolute;
    top: 0; left: 32px; right: 32px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.6), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }
  .dash-card-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
  }
  .dash-card-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(59,130,246,.12); border: 1px solid rgba(59,130,246,.22);
    display: grid; place-items: center; flex-shrink: 0; color: #60a5fa;
  }
  .dash-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: #f0ece4; margin: 0;
  }

  /* Recharts overrides */
  .recharts-cartesian-grid line { stroke: rgba(255,255,255,.06); }
  .recharts-text { fill: rgba(240,236,228,.4) !important; font-family: 'DM Sans', sans-serif !important; font-size: 11px !important; }
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: rgba(15,20,35,.95) !important;
    border: 1px solid rgba(59,130,246,.25) !important;
    border-radius: 10px !important;
    backdrop-filter: blur(20px);
  }
  .recharts-tooltip-label { color: #f0ece4 !important; font-family: 'DM Sans', sans-serif !important; font-size: 12px !important; }
  .recharts-tooltip-item { color: #93c5fd !important; font-family: 'DM Sans', sans-serif !important; font-size: 12px !important; }
  .recharts-legend-item-text { color: rgba(240,236,228,.5) !important; font-family: 'DM Sans', sans-serif !important; }
  .recharts-pie-label-text { fill: rgba(240,236,228,.6) !important; font-size: 11px !important; font-family: 'DM Sans', sans-serif !important; }
`;
if (!document.head.querySelector("[data-dash-style]")) {
  style.setAttribute("data-dash-style", "1");
  document.head.appendChild(style);
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

const ChartCard = ({ title, icon, children, delay = 0 }) => (
  <div className="dash-card" style={{ animationDelay: `${delay}s` }}>
    <div className="dash-card-header">
      <div className="dash-card-icon">{icon}</div>
      <h3 className="dash-card-title">{title}</h3>
    </div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,20,35,.95)", border: "1px solid rgba(59,130,246,.25)",
      borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(20px)"
    }}>
      <p style={{ margin: "0 0 4px", color: "#f0ece4", fontSize: 12, fontFamily: "'DM Sans'" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: "#93c5fd", fontSize: 12, fontFamily: "'DM Sans'" }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// Icons
const IcoPie  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const IcoBar  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>;
const IcoLine = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoRate = <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z"/></svg>;
const IcoFil  = <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IcoMat  = <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

export default function AdminDashboardPage() {
  const [error, setError] = useState("");
  const [data, setData] = useState({
    students_by_filiere: [],
    avg_by_matiere: [],
    success_rate: 0,
    results_evolution: [],
  });

  useEffect(() => {
    dashboardService
      .adminStats()
      .then(setData)
      .catch((err) => setError(err?.response?.data?.message || err.message || "Erreur chargement dashboard"));
  }, []);

  const stats = [
    { label: "Taux de réussite", value: data.success_rate, suffix: "%", icon: IcoRate, delay: ".1s" },
    { label: "Filières",         value: data.students_by_filiere.length, icon: IcoFil, delay: ".18s" },
    { label: "Matières",         value: data.avg_by_matiere.length, icon: IcoMat, delay: ".26s" },
  ];

  return (
    <div className="dash-root">
      <div className="dash-grid-bg" />
      <div className="dash-inner">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Header */}
        <div className="dash-header">
          <p className="dash-eyebrow">Administration · Vue d'ensemble</p>
          <h1 className="dash-title">Dashboard <strong>administrateur</strong></h1>
          <p className="dash-subtitle">Suivi des performances et statistiques académiques en temps réel</p>
        </div>

        {/* Stat cards */}
        <div className="dash-stats">
          {stats.map((s) => (
            <div className="dash-stat" key={s.label} style={{ animationDelay: s.delay }}>
              <p className="dash-stat-label">{s.label}</p>
              <p className="dash-stat-value">{s.value}{s.suffix && <span>{s.suffix}</span>}</p>
              <div className="dash-stat-icon">{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Pie + Bar */}
        <div className="dash-charts-row two-col">
          <ChartCard title="Répartition par filière" icon={IcoPie} delay={0.3}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.students_by_filiere} dataKey="value" nameKey="name"
                  outerRadius={110} innerRadius={50} paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "rgba(255,255,255,.2)" }}>
                  {data.students_by_filiere.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Moyenne par matière" icon={IcoBar} delay={0.38}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.avg_by_matiere} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "rgba(240,236,228,.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 20]} tick={{ fill: "rgba(240,236,228,.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.avg_by_matiere.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Line chart */}
        <div className="dash-charts-row one-col">
          <ChartCard title="Évolution des résultats" icon={IcoLine} delay={0.46}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.results_evolution}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="semestre" tick={{ fill: "rgba(240,236,228,.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 20]} tick={{ fill: "rgba(240,236,228,.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="moyenne" stroke="url(#lineGrad)"
                  strokeWidth={3} dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#0c0e13" }}
                  activeDot={{ r: 7, fill: "#93c5fd", stroke: "#0c0e13", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    </div>
  );
}


