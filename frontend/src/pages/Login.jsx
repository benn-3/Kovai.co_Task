import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { googleSignIn, loginUser } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function Login() {
  const { login }         = useAuth();
  const { isDark }        = useTheme();
  const navigate          = useNavigate();
  const googleBtnRef      = useRef(null);

  const [form, setForm]               = useState({ email: '', password: '' });
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const init = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogle });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: isDark ? 'filled_black' : 'outline',
          size: 'large', width: 340,
          text: 'continue_with', shape: 'rectangular',
        });
      }
    };
    if (window.google) { init(); }
    else {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true; s.defer = true; s.onload = init;
      document.head.appendChild(s);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  const handleGoogle = async (response) => {
    setGoogleLoading(true); setError('');
    try {
      const res = await googleSignIn(response.credential);
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Google sign-in failed. Please try again.');
    } finally { setGoogleLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.email || !form.password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Sign-in failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* ── Brand panel (left, desktop only) ─────────────────────────────── */}
      <div className="auth-brand-panel" aria-hidden="true">
        <div className="brand-content">
          <div className="brand-logo-mark">✓</div>
          <h1 className="brand-app-name">TaskTrac</h1>
          <p className="brand-tagline">
            A focused task management tool built for engineers who prefer
            clarity over ceremony.
          </p>
        </div>
      </div>

      {/* ── Form panel (right) ────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        {/* Theme toggle — top right corner */}
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <ThemeToggle />
        </div>

        <div className="auth-form-panel-inner">
          {/* Mobile-only logo (brand panel is hidden on mobile) */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-mark" aria-hidden="true">✓</div>
            <span className="auth-mobile-name">TaskTrac</span>
          </div>

          <div>
            <h2 className="auth-form-title">Sign in</h2>
            <p className="auth-form-subtitle">Welcome back</p>
          </div>

          {/* Google */}
          {GOOGLE_CLIENT_ID ? (
            googleLoading ? (
              <button className="btn-google" disabled>
                <span className="spinner" /> Signing in…
              </button>
            ) : (
              <div ref={googleBtnRef} style={{ width: '100%', minHeight: '44px' }} />
            )
          ) : (
            <div className="alert alert-error" role="alert">
              Google Sign-In not configured — set VITE_GOOGLE_CLIENT_ID.
            </div>
          )}

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="auth-divider">or continue with email</div>

          <form className="auth-fields" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email</label>
              <input
                id="login-email" type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password" type="password" className="form-input"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" id="login-submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            No account?{' '}
            <Link to="/register" id="go-to-register" className="auth-link">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
