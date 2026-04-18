import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'NEED_HELP', label: 'Need Help' },
  { value: 'CAN_HELP', label: 'Can Help' },
  { value: 'BOTH', label: 'Both' }
];

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BOTH' });
  const [error, setError] = useState('');
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      const response = isSignup ? await register(form) : await login({ email: form.email, password: form.password });
      setAuth({ user: response, token: response.token });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to authenticate');
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{isSignup ? 'Create account' : 'Welcome back'}</h1>
            <p className="mt-2 text-slate-400">Secure access to the Helplytics community platform.</p>
          </div>
          <button onClick={() => setIsSignup(prev => !prev)} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-brand-500">
            {isSignup ? 'Login instead' : 'Create account'}
          </button>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm text-slate-300">Full name</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-2 w-full px-4 py-3" placeholder="Jane Doe" />
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-300">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-2 w-full px-4 py-3" placeholder="you@domain.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="mt-2 w-full px-4 py-3" placeholder="••••••••" />
          </div>
          {isSignup && (
            <div>
              <label className="block text-sm text-slate-300">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="mt-2 w-full px-4 py-3">
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          )}
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" className="w-full rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
            {isSignup ? 'Join Helplytics' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
