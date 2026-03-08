import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { reportService } from "../services/reportService";

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
  @keyframes successPop {
    0%   { transform: scale(.85); opacity: 0; }
    60%  { transform: scale(1.08); }
    100% { transform: scale(1);   opacity: 1; }
  }

  .rp-root {
    min-height: 100vh;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    padding: 40px 32px 64px;
    box-sizing: border-box;
  }
  .rp-root::before {
    content: '';
    position: fixed; width: 600px; height: 600px;
    top: -200px; right: -180px; border-radius: 50%;
    filter: blur(140px); pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,.15) 0%, transparent 70%);
    animation: subtlePulse 9s ease-in-out infinite;
  }
  .rp-root::after {
    content: '';
    position: fixed; width: 450px; height: 450px;
    bottom: -140px; left: -100px; border-radius: 50%;
    filter: blur(130px); pointer-events: none;
    background: radial-gradient(circle, rgba(99,102,241,.1) 0%, transparent 70%);
    animation: subtlePulse 7s 3s ease-in-out infinite;
  }
  .rp-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .rp-inner {
    position: relative; z-index: 1;
    max-width: 720px; margin: 0 auto;
  }

  /* ── Header ── */
  .rp-header {
    margin-bottom: 36px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  .rp-eyebrow {
    font-size: 10px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: #60a5fa; margin: 0 0 10px;
  }
  .rp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300; color: #f0ece4;
    margin: 0 0 6px; line-height: 1.1;
  }
  .rp-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 60%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .rp-subtitle { font-size: 13px; color: rgba(240,236,228,.35); margin: 0; font-weight: 300; }

  /* ── Card ── */
  .rp-card {
    position: relative;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.018) 100%);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px;
    padding: 36px 40px 40px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(255,255,255,.03) inset, 0 24px 60px rgba(0,0,0,.45);
    overflow: hidden;
    animation: fadeUp .6s .1s cubic-bezier(.16,1,.3,1) both;
  }
  .rp-card::before {
    content: '';
    position: absolute; top: 0; left: 40px; right: 40px; height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.5), rgba(147,197,253,.65), rgba(59,130,246,.5), transparent);
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
  }

  /* PDF illustration area */
  .rp-illustration {
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 32px;
  }
  .rp-pdf-preview {
    position: relative; width: 88px;
  }
  .rp-pdf-doc {
    width: 72px; height: 88px; border-radius: 10px;
    background: linear-gradient(145deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.03) 100%);
    border: 1px solid rgba(255,255,255,.1);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 5px; position: relative; overflow: hidden;
  }
  .rp-pdf-doc::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 20px; height: 20px;
    background: linear-gradient(225deg, rgba(239,68,68,.35) 50%, transparent 50%);
    border-radius: 0 10px 0 0;
  }
  .rp-pdf-line {
    height: 2px; border-radius: 2px;
    background: rgba(255,255,255,.12);
  }
  .rp-pdf-badge {
    position: absolute; bottom: -10px; right: -10px;
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border: 2px solid #0c0e13;
    display: grid; place-items: center;
    font-size: 9px; font-weight: 700; color: #fff; letter-spacing: .02em;
  }

  .rp-card-heading {
    text-align: center; margin-bottom: 32px;
  }
  .rp-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: #f0ece4; margin: 0 0 6px;
  }
  .rp-card-desc {
    font-size: 13px; color: rgba(240,236,228,.35); margin: 0;
  }

  /* ── Form area ── */
  .rp-form { display: flex; flex-direction: column; gap: 20px; }

  .rp-field-label {
    display: block; font-size: 10px; font-weight: 500;
    letter-spacing: .18em; text-transform: uppercase;
    color: rgba(96,165,250,.75); margin-bottom: 8px;
  }
  .rp-input-wrap { position: relative; }
  .rp-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(96,165,250,.4); pointer-events: none;
  }
  .rp-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 11px; padding: 13px 14px 13px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #f0ece4; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .rp-input::placeholder { color: rgba(240,236,228,.2); }
  .rp-input:focus {
    border-color: rgba(59,130,246,.6);
    background: rgba(59,130,246,.05);
    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  }
  .rp-input:disabled {
    opacity: .5; cursor: not-allowed;
    background: rgba(255,255,255,.02);
  }
  .rp-input-hint {
    font-size: 11px; color: rgba(240,236,228,.25); margin-top: 6px;
    display: flex; align-items: center; gap: 5px;
  }

  /* ── Download button ── */
  .rp-btn {
    width: 100%; padding: 15px 24px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; cursor: pointer;
    transition: transform .15s, box-shadow .15s, opacity .15s;
    box-shadow: 0 4px 20px rgba(59,130,246,.35), 0 1px 4px rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .rp-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(59,130,246,.45), 0 2px 8px rgba(0,0,0,.35);
  }
  .rp-btn:active:not(:disabled) { transform: translateY(0); }
  .rp-btn:disabled { opacity: .5; cursor: not-allowed; }
  .rp-btn.success {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    box-shadow: 0 4px 20px rgba(34,197,94,.35);
  }

  /* ── Info box ── */
  .rp-info {
    display: flex; gap: 12px;
    padding: 14px 18px; border-radius: 12px;
    background: rgba(59,130,246,.07); border: 1px solid rgba(59,130,246,.18);
    margin-top: 4px;
  }
  .rp-info-icon { color: #60a5fa; flex-shrink: 0; margin-top: 1px; }
  .rp-info-text { font-size: 12.5px; color: rgba(240,236,228,.45); line-height: 1.6; }
  .rp-info-text strong { color: rgba(240,236,228,.7); font-weight: 500; }

  /* ── Success toast ── */
  .rp-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: rgba(15,20,30,.95);
    border: 1px solid rgba(34,197,94,.3); border-radius: 12px;
    padding: 14px 20px; display: flex; align-items: center; gap: 10px;
    color: #86efac; font-size: 13px; z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
    backdrop-filter: blur(20px);
    animation: successPop .4s cubic-bezier(.16,1,.3,1) both;
  }
`;
if (!document.head.querySelector("[data-rp-style]")) {
  style.setAttribute("data-rp-style", "1");
  document.head.appendChild(style);
}

const IcoId = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const IcoDownload = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoCheck = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoInfo = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function ReportsPage() {
  const { user } = useAuth();
  const defaultStudentId = useMemo(() => user?.student_id || "", [user?.student_id]);
  const [studentId, setStudentId] = useState(defaultStudentId);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [toast, setToast]         = useState(false);
  const [error, setError]         = useState("");

  const isLocked = Boolean(defaultStudentId);
  const targetId = studentId || defaultStudentId;

  const download = async () => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    try {
      const blob = await reportService.downloadStudentReport(targetId);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `bulletin_${targetId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
      setToast(true);
      setTimeout(() => { setSuccess(false); setToast(false); }, 3500);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de generer le bulletin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-root">
      <div className="rp-grid-bg" />
      <div className="rp-inner">

        {/* Header */}
        <div className="rp-header">
          <p className="rp-eyebrow">Documents · Scolarité</p>
          <h1 className="rp-title">Bulletins <strong>PDF</strong></h1>
          <p className="rp-subtitle">Générez et téléchargez les bulletins de notes au format PDF</p>
        </div>

        {/* Card */}
        <div className="rp-card">

          {/* PDF illustration */}
          <div className="rp-illustration">
            <div className="rp-pdf-preview">
              <div className="rp-pdf-doc">
                <div className="rp-pdf-line" style={{ width: 36 }} />
                <div className="rp-pdf-line" style={{ width: 28 }} />
                <div className="rp-pdf-line" style={{ width: 36 }} />
                <div className="rp-pdf-line" style={{ width: 20 }} />
                <div className="rp-pdf-line" style={{ width: 32 }} />
              </div>
              <div className="rp-pdf-badge">PDF</div>
            </div>
          </div>

          <div className="rp-card-heading">
            <h2 className="rp-card-title">Générer un bulletin</h2>
            <p className="rp-card-desc">Le document sera téléchargé directement dans votre navigateur</p>
          </div>

          <div className="rp-form">
            {error && (
              <div style={{
                marginBottom: 4,
                background: "rgba(220,60,60,.12)",
                border: "1px solid rgba(220,60,60,.25)",
                borderRadius: 10,
                color: "#f08080",
                padding: "10px 12px",
                fontSize: 13
              }}>
                {error}
              </div>
            )}
            <div>
              <label className="rp-field-label">Identifiant étudiant</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">{IcoId}</span>
                <input
                  className="rp-input"
                  type="text"
                  placeholder="ex. ETU-0042"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isLocked}
                />
              </div>
              {isLocked && (
                <p className="rp-input-hint">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Prérempli depuis votre session — non modifiable
                </p>
              )}
            </div>

            <button
              className={`rp-btn${success ? " success" : ""}`}
              onClick={download}
              disabled={loading || !targetId}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                  </svg>
                  Génération en cours…
                </>
              ) : success ? (
                <>{IcoCheck} Bulletin téléchargé !</>
              ) : (
                <>{IcoDownload} Télécharger le bulletin</>
              )}
            </button>

            <div className="rp-info">
              <span className="rp-info-icon">{IcoInfo}</span>
              <p className="rp-info-text">
                Le bulletin inclut <strong>toutes les notes du semestre en cours</strong>, la moyenne générale et la mention. 
                Le fichier est généré au format <strong>PDF/A</strong> — compatible avec tous les lecteurs.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="rp-toast">
          {IcoCheck}
          Bulletin téléchargé avec succès
        </div>
      )}
    </div>
  );
}
