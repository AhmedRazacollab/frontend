import { useEffect, useState } from 'react';
import RequestCard from '../components/RequestCard';
import { fetchRequests, getAISearchSuggestions } from '../services/requestService';
import { useAuth } from '../context/AuthContext';

const categories = ['General', 'Tech', 'Design', 'Career', 'Education', 'Wellness', 'Logistics'];
const urgencies = ['LOW', 'MEDIUM', 'HIGH'];

export default function ExplorePage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ category: '', urgency: '', search: '' });
  const [requests, setRequests] = useState([]);
  const [isAISearch, setIsAISearch] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const params = { ...filters };
      if (isAISearch && filters.search) {
        params.ai = 'true';
      }
      const data = await fetchRequests(params);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests:', error);
      setAiError('Failed to load requests. Please try again.');
    }
  };

  const applyFilters = async e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = async e => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    console.log('Search value:', value, 'User authenticated:', !!user);

    if (value.length > 0) {
      if (!user) {
        setAiError('Please login to use AI search suggestions');
        setAiSuggestions(null);
        setShowSuggestions(false);
        return;
      }

      try {
        setAiError(null);
        console.log('Calling AI search suggestions...');
        const suggestions = await getAISearchSuggestions(value);
        console.log('AI suggestions received:', suggestions);
        setAiSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to get AI suggestions:', error);
        setAiError('AI suggestions unavailable. Please try again.');
        setAiSuggestions(null);
        setShowSuggestions(false);
      }
    } else {
      setAiSuggestions(null);
      setShowSuggestions(false);
      setAiError(null);
    }
  };

  const applyAISuggestion = (suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
    setIsAISearch(true);
  };

  const applyAISearch = () => {
    console.log('AI Search button clicked, user:', user, 'search:', filters.search);
    if (!user) {
      setAiError('Please login to use AI search');
      return;
    }
    if (!filters.search.trim()) {
      setAiError('Please enter a search term first');
      return;
    }
    setAiError(null);
    setLoadingAI(true);
    setIsAISearch(true);
    loadRequests().finally(() => setLoadingAI(false));
  };

  const clearAISearch = () => {
    setIsAISearch(false);
    loadRequests();
  };

  useEffect(() => {
    const timeout = setTimeout(loadRequests, 300);
    return () => clearTimeout(timeout);
  }, [filters, isAISearch]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Explore requests</h1>
        <p className="mt-2 text-slate-400">Filter by category, urgency and keywords to find the perfect request to help. Use AI-powered search for smarter results.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="relative">
            <input
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search requests (try AI search)"
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            {showSuggestions && aiSuggestions && (
              <div className="absolute top-full mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 shadow-xl z-10">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">AI Search Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => applyAISuggestion(suggestion)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-slate-400 mb-2">Suggested Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => setFilters(prev => ({ ...prev, category }))}
                        className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {aiError && (
              <div className="absolute top-full mt-2 w-full rounded-lg border border-red-700 bg-red-900/20 shadow-xl z-10 p-3">
                <p className="text-sm text-red-400">{aiError}</p>
              </div>
            )}
          </div>
          <select name="category" value={filters.category} onChange={applyFilters} className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-blue-500 focus:outline-none">
            <option value="">All categories</option>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
          <select name="urgency" value={filters.urgency} onChange={applyFilters} className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-blue-500 focus:outline-none">
            <option value="">All urgency</option>
            {urgencies.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={applyAISearch}
            disabled={!user || !filters.search.trim() || loadingAI}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🤖</span> {loadingAI ? 'Searching...' : 'AI Search'} {!user && '(Login Required)'}
          </button>
          {isAISearch && (
            <button
              onClick={clearAISearch}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Clear AI Search
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-5">
        {requests.length ? requests.map(request => <RequestCard key={request._id} request={request} />) : <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-400">No requests found for the current filters.</div>}
      </div>
    </main>
  );
}
