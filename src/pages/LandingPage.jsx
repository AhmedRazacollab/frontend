import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div>
          <span className="inline-flex rounded-full bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-300">Helplytics AI — Community support, powered by smart suggestions</span>
          <h1 className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Connect faster with people who can help you and reward helpers.</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400">Helplytics AI makes community support easier with AI-assisted requests, trust scoring, and smart recommendations for both seekers and helpers.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/auth" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">Start helping</Link>
            <Link to="/explore" className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:bg-slate-800">Explore requests</Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-950/60 p-6">
              <h2 className="text-xl font-semibold text-white">Why Helplytics works</h2>
              <p className="mt-3 text-slate-400">Smart auto-categorization, request summaries, and a reward system that keeps your community thriving.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatsCard title="Active requests" value="128" description="Live requests waiting for helpers." />
              <StatsCard title="Top helpers" value="24" description="Users with the highest trust scores." />
              <StatsCard title="AI suggestions" value="5" description="Smart tags and urgency detection." />
              <StatsCard title="Community growth" value="+32%" description="More requests completed weekly." />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
