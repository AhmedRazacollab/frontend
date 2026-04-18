import { useEffect, useState } from 'react';

const trends = [
  'Urgent mentors needed for UX reviews',
  'Software debugging support rising',
  'Career coaching requests trending',
  'Project planning help in demand'
];

export default function AICenterPage() {
  const [insight, setInsight] = useState('');

  useEffect(() => {
    setInsight(trends[Math.floor(Math.random() * trends.length)]);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">AI Center</h1>
        <p className="mt-2 text-slate-400">Insights, trends and suggestions powered by smart request analysis.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Trending topics</h2>
            <p className="mt-4 text-slate-300">{insight}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">AI capabilities</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>• Auto-categorization of requests</li>
              <li>• Smart tag suggestions</li>
              <li>• Urgency detection with priority queueing</li>
              <li>• Request summarization to speed matching</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-xl font-semibold text-white">Community AI dashboard</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900/80 p-4">
              <p className="text-sm uppercase text-slate-500">Requests analyzed</p>
              <p className="mt-2 text-3xl font-semibold text-white">1.2k</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4">
              <p className="text-sm uppercase text-slate-500">Tags generated</p>
              <p className="mt-2 text-3xl font-semibold text-white">7.4k</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4">
              <p className="text-sm uppercase text-slate-500">Urgent matches</p>
              <p className="mt-2 text-3xl font-semibold text-white">320</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
