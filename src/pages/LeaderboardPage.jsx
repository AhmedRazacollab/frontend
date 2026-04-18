import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/authService';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setLeaders);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Leaderboard</h1>
          <p className="mt-2 text-slate-400">Top helpers ranked by trust score, badges and community impact.</p>
        </div>
        <div className="grid gap-4">
          {leaders.map((leader, index) => (
            <div key={leader._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">#{index + 1}</p>
                <h2 className="text-2xl font-semibold text-white">{leader.name}</h2>
                <p className="text-sm text-slate-400">{leader.role} • {leader.location || 'Remote'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-500/10 px-4 py-2 text-sm text-brand-300">{leader.trustScore} pts</span>
                {leader.badges?.map(badge => <span key={badge} className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-300">{badge}</span>)}
              </div>
            </div>
          ))}
          {!leaders.length && <p className="text-slate-400">Loading leaderboard...</p>}
        </div>
      </div>
    </main>
  );
}
