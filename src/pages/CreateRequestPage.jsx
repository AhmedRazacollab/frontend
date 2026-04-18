import { useMemo, useState } from 'react';
import { createRequest, requestAISuggestions } from '../services/requestService';
import { useNavigate } from 'react-router-dom';

const defaultForm = { title: '', description: '', category: '', urgency: '', tags: '' };

export default function CreateRequestPage() {
  const [form, setForm] = useState(defaultForm);
  const [ai, setAi] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const suggestAI = async () => {
    const response = await requestAISuggestions({ title: form.title, description: form.description });
    setAi(response);
    setForm(prev => ({
      ...prev,
      category: response.category || prev.category,
      urgency: response.urgency || prev.urgency,
      tags: response.tags.join(', ')
    }));
  };

  const submit = async e => {
    e.preventDefault();
    setStatus('Saving request...');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        urgency: form.urgency,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      const { request } = await createRequest(payload);
      setStatus('Request created! Redirecting...');
      navigate(`/requests/${request._id}`);
    } catch (err) {
      setStatus('Unable to create request. Please try again.');
    }
  };

  const tagList = useMemo(() => form.tags.split(',').map(tag => tag.trim()).filter(Boolean), [form.tags]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Create a new help request</h1>
        <p className="mt-2 text-slate-400">Use AI suggestions to improve clarity and make your request discoverable.</p>
        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm text-slate-300">Request title</label>
            <input name="title" value={form.title} onChange={handleChange} className="mt-2 w-full px-4 py-3" placeholder="Need help refining my UX case study" />
          </div>
          <div>
            <label className="block text-sm text-slate-300">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="6" className="mt-2 w-full px-4 py-3" placeholder="Describe the issue in detail..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="px-4 py-3" />
            <input name="urgency" value={form.urgency} onChange={handleChange} placeholder="Urgency" className="px-4 py-3" />
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags, separated" className="px-4 py-3" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={suggestAI} className="rounded-3xl bg-slate-800 px-5 py-3 text-sm text-slate-100 transition hover:bg-slate-700">AI Suggest</button>
            <button type="submit" className="rounded-3xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Create request</button>
          </div>
          {status && <p className="text-sm text-slate-300">{status}</p>}
        </form>
        {ai && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
            <h2 className="text-xl font-semibold text-white">AI improvements</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <h3 className="text-sm uppercase text-slate-400">Suggested category</h3>
                <p className="mt-2 text-white">{ai.category}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <h3 className="text-sm uppercase text-slate-400">Urgency</h3>
                <p className="mt-2 text-white">{ai.urgency}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <h3 className="text-sm uppercase text-slate-400">Tag suggestions</h3>
                <p className="mt-2 text-white">{ai.tags.join(', ') || 'No suggestions'}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <h3 className="text-sm uppercase text-slate-400">Summary</h3>
                <p className="mt-2 text-slate-300">{ai.summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
