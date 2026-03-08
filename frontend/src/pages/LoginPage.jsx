import LoginIcon from "@mui/icons-material/Login";
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { roleToDefaultRoute } from "../utils/roles";

// Inject custom styles once
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes lineDraw {
    from { width: 0; }
    to   { width: 48px; }
  }
  @keyframes subtlePulse {
    0%, 100% { opacity: .55; }
    50%       { opacity: .85; }
  }

  .login-root {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: #0c0e13;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Ambient orbs */
  .login-root::before,
  .login-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    animation: subtlePulse 8s ease-in-out infinite;
  }
  .login-root::before {
    width: 520px; height: 520px;
    top: -160px; left: -160px;
    background: radial-gradient(circle, rgba(59,130,246,.22) 0%, transparent 70%);
  }
  .login-root::after {
    width: 400px; height: 400px;
    bottom: -120px; right: -80px;
    background: radial-gradient(circle, rgba(99,102,241,.16) 0%, transparent 70%);
    animation-delay: 4s;
  }

  /* Grid texture overlay */
  .login-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .login-card {
    position: relative;
    width: 460px;
    background: linear-gradient(145deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.02) 100%);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 20px;
    padding: 52px 48px 48px;
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,.04) inset,
      0 32px 80px rgba(0,0,0,.55),
      0 8px 24px rgba(0,0,0,.3);
    animation: fadeUp .7s cubic-bezier(.16,1,.3,1) both;
  }

  /* Top accent line */
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 48px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #93c5fd, #3b82f6);
    background-size: 200% auto;
    animation: lineDraw .9s .3s cubic-bezier(.16,1,.3,1) both, shimmer 4s 1.2s linear infinite;
    border-radius: 0 0 2px 2px;
  }

  .login-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #60a5fa;
    margin-bottom: 12px;
    opacity: 0;
    animation: fadeUp .5s .2s ease both;
  }

  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 300;
    line-height: 1.1;
    color: #f0ece4;
    letter-spacing: -.01em;
    margin: 0 0 8px;
    opacity: 0;
    animation: fadeUp .6s .3s ease both;
  }

  .login-title strong {
    font-weight: 600;
    background: linear-gradient(135deg, #93c5fd 0%, #3b82f6 50%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .login-subtitle {
    font-size: 13px;
    color: rgba(240,236,228,.38);
    margin: 0 0 40px;
    font-weight: 300;
    opacity: 0;
    animation: fadeUp .6s .4s ease both;
  }

  .login-divider {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp .5s .45s ease both;
  }
  .login-divider span {
    font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
    color: rgba(96,165,250,.6);
  }
  .login-divider::before,
  .login-divider::after {
    content: ''; flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,.3), transparent);
  }

  /* Field wrappers */
  .field-wrap {
    position: relative;
    opacity: 0;
    animation: fadeUp .5s ease both;
  }
  .field-wrap:nth-child(1) { animation-delay: .5s; }
  .field-wrap:nth-child(2) { animation-delay: .58s; }

  .field-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(96,165,250,.8);
    margin-bottom: 8px;
    display: block;
  }

  .field-input {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px;
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #f0ece4;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .field-input::placeholder { color: rgba(240,236,228,.2); }
  .field-input:focus {
    border-color: rgba(59,130,246,.65);
    background: rgba(255,255,255,.06);
    box-shadow: 0 0 0 3px rgba(59,130,246,.12), 0 4px 16px rgba(0,0,0,.2);
  }

  .login-btn {
    width: 100%;
    padding: 15px 24px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform .15s, box-shadow .15s, opacity .15s;
    box-shadow: 0 4px 20px rgba(59,130,246,.35), 0 1px 4px rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    opacity: 0;
    animation: fadeUp .5s .66s ease both;
  }
  .login-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(59,130,246,.45), 0 2px 8px rgba(0,0,0,.4);
  }
  .login-btn:active:not(:disabled) { transform: translateY(0); }
  .login-btn:disabled { opacity: .55; cursor: not-allowed; }

  .login-alert {
    background: rgba(220,60,60,.12) !important;
    border: 1px solid rgba(220,60,60,.25) !important;
    border-radius: 10px !important;
    color: #f08080 !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important;
    margin-bottom: 24px;
    animation: fadeUp .3s ease both;
  }

  .login-footer {
    text-align: center;
    margin-top: 28px;
    font-size: 11px;
    color: rgba(240,236,228,.18);
    letter-spacing: .06em;
    opacity: 0;
    animation: fadeUp .5s .75s ease both;
  }
`;
if (!document.head.querySelector("[data-login-style]")) {
  style.setAttribute("data-login-style", "1");
  document.head.appendChild(style);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authService.login(form);
      login(result);
      navigate(roleToDefaultRoute[result.role] || "/", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setError("Backend inaccessible. Vérifie http://127.0.0.1:5000");
      } else {
        setError(err?.response?.data?.message || "Échec de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-grid" />

      <div className="login-card">
        <p className="login-eyebrow">École d'ingénieur · Portail</p>
        <h1 className="login-title">Bon<br /><strong>retour.</strong></h1>
        <p className="login-subtitle">Connectez-vous pour accéder à votre espace de gestion</p>

        {error && (
          <div className="login-alert" role="alert" style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", marginBottom: 24,
            background: "rgba(220,60,60,.12)",
            border: "1px solid rgba(220,60,60,.25)",
            borderRadius: 10,
            color: "#f08080",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            animation: "fadeUp .3s ease both"
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#f08080" strokeWidth="1.2"/>
              <path d="M8 5v4M8 11v.5" stroke="#f08080" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <div className="login-divider"><span>Identification</span></div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="field-wrap">
            <label className="field-label" htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              className="field-input"
              type="text"
              placeholder="Votre identifiant"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
            />
          </div>

          <div className="field-wrap">
            <label className="field-label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                </svg>
                Connexion en cours…
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Se connecter
              </>
            )}
          </button>
        </form>

        <p className="login-footer">© {new Date().getFullYear()} — Système de gestion académique</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
