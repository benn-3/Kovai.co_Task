import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

const CLIENT_RULES = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'),
  password: (v) => {
    if (v.length < 8) return 'At least 8 characters required.';
    if (!/[A-Za-z]/.test(v)) return 'Must contain at least one letter.';
    if (!/\d/.test(v)) return 'Must contain at least one number.';
    return '';
  },
  confirm_password: (v, form) => (v !== form.password ? 'Passwords do not match.' : ''),
  mobile_number: (v) => (/^\d{10,15}$/.test(v) ? '' : '10 digits only, no spaces or dashes.'),
};

const FIELDS = [
  { id: 'reg-email',   key: 'email',           type: 'email',    label: 'Email',            placeholder: 'you@example.com',              autoComplete: 'email' },
  { id: 'reg-pass',    key: 'password',         type: 'password', label: 'Password',         placeholder: 'Min 8 chars, 1 letter, 1 number', autoComplete: 'new-password' },
  { id: 'reg-confirm', key: 'confirm_password', type: 'password', label: 'Confirm password', placeholder: 'Repeat your password',          autoComplete: 'new-password' },
  { id: 'reg-mobile',  key: 'mobile_number',    type: 'tel',      label: 'Mobile number',    placeholder: '10–15 digits',                 autoComplete: 'tel' },
];

export default function Register() {
  const { login }    = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]               = useState({ email: '', password: '', confirm_password: '', mobile_number: '' });
  const [touched, setTouched]         = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading]         = useState(false);

  const getErr = (key, val) => CLIENT_RULES[key]?.(val, form) ?? '';
  const fieldErr = (key) => serverErrors[key] || (touched[key] ? getErr(key, form[key]) : '');
  const hasErrors = FIELDS.some(({ key }) => getErr(key, form[key]) !== '');

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setServerErrors((p) => ({ ...p, [key]: '' }));
    setGlobalError('');
  };
  const onBlur = (key) => () => setTouched((p) => ({ ...p, [key]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(FIELDS.map(({ key }) => [key, true])));
    if (hasErrors) return;
    setLoading(true); setGlobalError(''); setServerErrors({});
    try {
      const res = await registerUser(form);
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 422 && Array.isArray(data?.detail)) {
        const fe = {};
        data.detail.forEach((e) => {
          const f = e.loc?.[e.loc.length - 1];
          if (f) fe[f] = e.msg.replace('Value error, ', '');
        });
        setServerErrors(fe);
      } else {
        setGlobalError(data?.detail || 'Registration failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* ── Brand panel ───────────────────────────────────────────────────── */}
      <div className="auth-brand-panel" aria-hidden="true">
        <div className="brand-content">
          <div className="brand-logo-mark">✓</div>
          <h1 className="brand-app-name">TaskTrac</h1>
          <p className="brand-tagline">
            Manage your work with three statuses, zero noise, and a clean interface
            that stays out of your way.
          </p>
        </div>
      </div>

      {/* ── Form panel ────────────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <ThemeToggle />
        </div>

        <div className="auth-form-panel-inner">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-mark" aria-hidden="true">✓</div>
            <span className="auth-mobile-name">TaskTrac</span>
          </div>

          <div>
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-subtitle">Get started in seconds</p>
          </div>

          {globalError && <div className="alert alert-error" role="alert">{globalError}</div>}

          <form className="auth-fields" onSubmit={handleSubmit} noValidate>
            {FIELDS.map(({ id, key, type, label, placeholder, autoComplete }) => (
              <div className="form-group" key={key}>
                <label htmlFor={id} className="form-label">{label}</label>
                <input
                  id={id} type={type}
                  className={`form-input${fieldErr(key) ? ' input-error' : ''}`}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={onChange(key)}
                  onBlur={onBlur(key)}
                  autoComplete={autoComplete}
                />
                {fieldErr(key) && (
                  <p className="form-error" role="alert">{fieldErr(key)}</p>
                )}
              </div>
            ))}

            <button
              type="submit" id="register-submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '4px' }}
            >
              {loading ? <><span className="spinner" /> Creating account…</> : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" id="go-to-login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
