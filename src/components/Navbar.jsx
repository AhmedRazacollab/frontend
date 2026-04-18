import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Explore', path: '/explore' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'AI Center', path: '/ai-center' },
  { label: 'Notifications', path: '/notifications' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-semibold text-xl text-white">Helplytics AI</Link>
        <nav className="hidden gap-4 md:flex">
          {user && navItems.map(item => (
            <Link key={item.path} to={item.path} className="text-slate-300 hover:text-white transition">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <button onClick={() => navigate('/auth')} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600">
              Login
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/profile')} className="text-slate-300 hover:text-white">{user.name}</button>
              <button onClick={() => { logout(); navigate('/'); }} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-900">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
