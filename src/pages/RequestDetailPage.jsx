import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchRequestById, applyToHelp, completeRequest, requestAISuggestions } from '../services/requestService';

export default function RequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchRequestById(id);
      setRequest(data);
    };
    load();
  }, [id]);

  const handleApply = async () => {
    try {
      await applyToHelp(id);
      setStatus('You have applied to help this request.');
      const updated = await fetchRequestById(id);
      setRequest(updated);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not apply to help.');
    }
  };

  const handleComplete = async () => {
    try {
      await completeRequest(id);
      setStatus('Request marked as completed.');
      const updated = await fetchRequestById(id);
      setRequest(updated);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Unable to complete request.');
    }
  };

  const getAISuggestions = async () => {
    setLoadingAI(true);
    try {
      const suggestions = await requestAISuggestions({
        title: request.title,
        description: request.description,
        category: request.category,
        urgency: request.urgency,
        tags: request.tags
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      setAiSuggestions({ error: 'Unable to get AI suggestions at this time.' });
    } finally {
      setLoadingAI(false);
    }
  };

  if (!request) return <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">Loading request...</div>;

  const isOwner = user?._id === request.createdBy?._id;
  const alreadyHelping = request.helpers.some(helper => helper._id === user?._id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">{request.title}</h1>
            <p className="mt-3 text-slate-400">Posted by {request.createdBy?.name} • {request.category} • {request.urgency}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {request.status === 'OPEN' && !alreadyHelping && <button onClick={handleApply} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">I can help</button>}
            {alreadyHelping && <span className="rounded-full bg-slate-800 px-5 py-3 text-sm text-slate-300">Already helping</span>}
            {isOwner && request.status !== 'COMPLETED' && <button onClick={handleComplete} className="rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm text-slate-100 transition hover:border-brand-500">Mark solved</button>}
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Request overview</h2>
              <p className="mt-4 text-slate-300 whitespace-pre-line">{request.description}</p>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">AI summary</h2>
              <p className="mt-4 text-slate-300">{request.ai?.summary || 'No summary available.'}</p>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">AI Help Suggestions</h2>
                <button
                  onClick={getAISuggestions}
                  disabled={loadingAI}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <span>🤖</span> {loadingAI ? 'Getting AI help...' : 'Get AI Help'}
                </button>
              </div>
              <div className="mt-4">
                {aiSuggestions ? (
                  aiSuggestions.error ? (
                    <p className="text-red-400">{aiSuggestions.error}</p>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-white">Suggested Response:</h3>
                        <p className="mt-2 text-slate-300">{aiSuggestions.rewrite}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Helpful Tips:</h3>
                        <ul className="mt-2 list-disc list-inside text-slate-300 space-y-1">
                          {aiSuggestions.tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-slate-400">Click "Get AI Help" to get personalized suggestions for helping with this request.</p>
                )}
              </div>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Helpers</h2>
              <div className="mt-4 space-y-3">
                {request.helpers.length ? request.helpers.map(helper => (
                  <div key={helper._id} className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="font-semibold text-white">{helper.name}</p>
                    <p className="text-sm text-slate-400">{helper.role} • {helper.trustScore} trust</p>
                  </div>
                )) : <p className="text-slate-400">No helpers yet. Be the first one!</p>}
              </div>
            </section>
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Request details</h2>
              <div className="mt-4 space-y-3 text-slate-300">
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Category:</strong> {request.category}</p>
                <p><strong>Urgency:</strong> {request.urgency}</p>
                <p><strong>Posted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <h2 className="text-xl font-semibold text-white">Tags</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {request.tags.map(tag => (<span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{tag}</span>))}
              </div>
            </div>
          </aside>
        </div>
        {status && <p className="mt-6 text-slate-200">{status}</p>}
      </div>
    </main>
  );
}
