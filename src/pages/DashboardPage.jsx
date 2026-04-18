import { useEffect, useState } from 'react';
import { fetchProfile, fetchLeaderboard } from '../services/authService';
import { fetchRequests, getAISearchSuggestions } from '../services/requestService';
import StatsCard from '../components/StatsCard';
import RequestCard from '../components/RequestCard';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [recent, setRecent] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    fetchProfile().then(data => setProfile(data));
    fetchRequests({ status: 'OPEN', limit: 4 }).then(data => setRecent(data));
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  useEffect(() => {
    if (profile?.user) {
      getAIRecommendations();
    }
  }, [profile]);

  const getAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      // Generate AI search terms based on user profile
      const searchTerms = `${profile.user.role} ${profile.user.skills?.join(' ') || ''} help assistance`;
      const suggestions = await getAISearchSuggestions(searchTerms);
      if (suggestions.suggestions && suggestions.suggestions.length > 0) {
        // Use the first AI suggestion to search for relevant requests
        const aiSearchTerm = suggestions.suggestions[0];
        const recommendedRequests = await fetchRequests({
          search: aiSearchTerm,
          status: 'OPEN',
          limit: 3
        });
        setAiRecommendations(recommendedRequests);
      }
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
        <section className="space-y-8">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white">Welcome back, {profile?.user?.name || 'helper'}.</h1>
                <p className="mt-2 text-slate-400">Track your contributions, active requests, and AI-powered suggestions in one place.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 px-6 py-4 text-right">
                <p className="text-sm uppercase text-slate-400">Trust score</p>
                <p className="mt-2 text-4xl font-semibold text-white">{profile?.user?.trustScore ?? '--'}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <StatsCard title="Requests created" value={profile?.stats?.requestsCreated ?? '0'} description="Your active and completed asks." />
            <StatsCard title="Helps offered" value={profile?.stats?.requestsHelped ?? '0'} description="Requests you have contributed to." />
            <StatsCard title="Badges earned" value={profile?.stats?.badges?.length ?? '0'} description="Community rewards and milestones." />
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Recent open requests</h2>
                <p className="mt-2 text-slate-400">Fresh opportunities where your skills can make an impact.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">Latest</span>
            </div>
            <div className="mt-6 grid gap-4">
              {recent.length ? recent.map(request => <RequestCard key={request._id} request={request} />) : <p className="text-slate-400">No active requests yet.</p>}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">AI-Powered Recommendations</h2>
                <p className="mt-2 text-slate-400">Personalized request suggestions based on your skills and interests.</p>
              </div>
              <button
                onClick={getAIRecommendations}
                disabled={loadingAI}
                className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <span>🤖</span> {loadingAI ? 'Getting AI...' : 'Refresh AI'}
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              {aiRecommendations.length ? aiRecommendations.map(request => <RequestCard key={request._id} request={request} />) : <p className="text-slate-400">AI is analyzing your profile to find the best matches...</p>}
            </div>
          </div>
        </section>
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8">
            <h2 className="text-2xl font-semibold text-white">AI Insights</h2>
            <p className="mt-4 text-slate-400">Our AI makes it easier to categorize requests, suggest tags, and identify urgency as soon as you create a request.</p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <p>• Auto-tagging helps requests get matched faster.</p>
              <p>• Urgency detection boosts visibility for high-impact tasks.</p>
              <p>• The leaderboard promotes trusted community helpers.</p>
              <p>• AI search finds relevant requests using natural language.</p>
              <p>• Smart recommendations match your skills to opportunities.</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8">
            <h2 className="text-2xl font-semibold text-white">Top community helpers</h2>
            <div className="mt-6 space-y-3">
              {leaderboard.slice(0, 4).map((item, index) => (
                <div key={item._id} className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-sm text-brand-300">#{index + 1}</p>
                  <p className="mt-1 font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role} • {item.trustScore} pts</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
