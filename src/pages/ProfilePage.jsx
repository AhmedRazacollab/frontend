import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../services/authService';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', location: user?.location || '', skills: user?.skills || [], interests: user?.interests || [] });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name, location: user.location || '', skills: user.skills || [], interests: user.interests || [] });
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleList = (field, value) => setForm({ ...form, [field]: value.split(',').map(item => item.trim()).filter(Boolean) });

  const handleSave = async e => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      setStatus('Profile updated successfully.');
    } catch (err) {
      setStatus('Unable to update profile.');
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Profile</h1>
        <p className="mt-2 text-slate-400">Manage your account, skills and community contributions.</p>
        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <div>
            <label className="block text-sm text-slate-300">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="mt-2 w-full px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="mt-2 w-full px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Skills</label>
            <input value={form.skills.join(', ')} onChange={e => handleList('skills', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="React, UX, mentoring" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Interests</label>
            <input value={form.interests.join(', ')} onChange={e => handleList('interests', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="Community, career development" />
          </div>
          <button type="submit" className="rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Save changes</button>
          {status && <p className="text-slate-300">{status}</p>}
        </form>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Role</p>
            <p className="mt-3 text-xl text-white">{user?.role}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trust score</p>
            <p className="mt-3 text-xl text-white">{user?.trustScore ?? 0}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
