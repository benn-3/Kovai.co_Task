import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ user }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  /* Colored initials avatar — first letter of name or email */
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <a href="/dashboard" className="navbar-brand" aria-label="TaskTrac home">
          <div className="navbar-brand-mark" aria-hidden="true">
            <CheckSquare size={15} strokeWidth={2.5} />
          </div>
          TaskTrac
        </a>

        {/* Right side */}
        <div className="navbar-right">
          <ThemeToggle />

          {user && (
            <div className="user-chip" aria-label={`Signed in as ${user.email}`}>
              <div className="user-avatar" aria-hidden="true">
                {user.picture
                  ? <img src={user.picture} alt="" referrerPolicy="no-referrer" />
                  : initials
                }
              </div>
              <span className="user-email">{user.name || user.email}</span>
            </div>
          )}

          {/* Thin vertical divider */}
          <div className="navbar-divider" aria-hidden="true" />

          <button
            id="logout-btn"
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
            aria-label="Sign out"
          >
            <LogOut size={13} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
