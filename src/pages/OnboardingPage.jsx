import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { updateProfile } from '../services/authService';

export default function OnboardingPage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', location: user?.location || '', skills: user?.skills || [], interests: user?.interests || [] });
  const [suggestions, setSuggestions] = useState({ suggestedSkills: [], suggestedNeeds: [] });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await api.post('/ai/onboarding', { role: user?.role });
        setSuggestions(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadSuggestions();
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleListChange = (key, value) => setForm({ ...form, [key]: value.split(',').map(item => item.trim()).filter(Boolean) });

  const submit = async e => {
    e.preventDefault();
    const updated = await updateProfile(form);
    setMessage('Onboarding saved successfully.');
    setUser(updated);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Complete your profile</h1>
        <p className="mt-2 text-slate-400">Tell us what you can help with and what you need support on.</p>
        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-300">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="mt-2 w-full px-4 py-3" placeholder="Remote / City" />
            </div>
            <div>
              <label className="block text-sm text-slate-300">Skills (comma separated)</label>
              <input name="skills" value={form.skills.join(', ')} onChange={e => handleListChange('skills', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="React, mentoring" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-300">Interests (comma separated)</label>
            <input name="interests" value={form.interests.join(', ')} onChange={e => handleListChange('interests', e.target.value)} className="mt-2 w-full px-4 py-3" placeholder="Community building, career growth" />
          </div>
          {message && <p className="text-sm text-emerald-300">{message}</p>}
          <button type="submit" className="rounded-3xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
            Save profile
          </button>
        </form>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Skills to highlight</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200">
              {suggestions.suggestedSkills.map(skill => (<span key={skill} className="rounded-full bg-slate-800 px-3 py-1">{skill}</span>))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Help requests we recommend</h2>
            <div className="mt-4 space-y-2 text-slate-400">
              {suggestions.suggestedNeeds.map((need, index) => (<p key={index} className="rounded-2xl bg-slate-900/90 px-4 py-3">{need}</p>))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
