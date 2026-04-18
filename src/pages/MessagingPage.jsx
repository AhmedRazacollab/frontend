import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConversation, sendMessage } from '../services/messageService';
import { requestAISuggestions } from '../services/requestService';

export default function MessagingPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getConversation(userId).then(setMessages);
  }, [userId]);

  const handleSend = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const message = await sendMessage({ receiver: userId, content: text });
      setMessages(prev => [...prev, message]);
      setText('');
      setStatus('Message sent');
      setAiSuggestions(null);
      setShowAISuggestions(false);
    } catch (err) {
      setStatus('Unable to send message');
    }
  };

  const getAISuggestions = async () => {
    if (!text.trim()) return;
    setLoadingAI(true);
    try {
      const suggestions = await requestAISuggestions({
        title: 'Message improvement',
        description: text,
        category: 'Communication',
        urgency: 'LOW',
        tags: ['message', 'communication']
      });
      setAiSuggestions(suggestions);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      setAiSuggestions({ error: 'Unable to get AI suggestions at this time.' });
      setShowAISuggestions(true);
    } finally {
      setLoadingAI(false);
    }
  };

  const applyAISuggestion = (suggestion) => {
    setText(suggestion);
    setShowAISuggestions(false);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Messaging</h1>
        <p className="mt-2 text-slate-400">Chat with a community member using a simple direct message flow. Use AI to improve your messages.</p>
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="max-h-[480px] space-y-4 overflow-y-auto pb-4 scrollbar-thin">
            {messages.length ? messages.map(message => (
              <div key={message._id} className={`rounded-3xl p-4 ${message.sender === userId ? 'bg-slate-800 text-slate-100 self-start' : 'bg-slate-900 text-slate-200 self-end'}`}>
                <p>{message.content}</p>
                <span className="mt-2 block text-xs text-slate-500">{new Date(message.createdAt).toLocaleTimeString()}</span>
              </div>
            )) : <p className="text-slate-400">Start a conversation by sending the first message.</p>}
          </div>
          <form className="mt-6 flex flex-col gap-3" onSubmit={handleSend}>
            <div className="flex gap-3">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={getAISuggestions}
                disabled={loadingAI || !text.trim()}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <span>🤖</span> {loadingAI ? 'AI...' : 'AI Help'}
              </button>
            </div>
            {showAISuggestions && aiSuggestions && (
              <div className="mt-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
                {aiSuggestions.error ? (
                  <p className="text-red-400">{aiSuggestions.error}</p>
                ) : (
                  <div>
                    <h3 className="font-semibold text-white mb-2">AI Suggested Message:</h3>
                    <p className="text-slate-300 mb-3">{aiSuggestions.rewrite}</p>
                    <button
                      onClick={() => applyAISuggestion(aiSuggestions.rewrite)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full transition-colors"
                    >
                      Use this suggestion
                    </button>
                  </div>
                )}
              </div>
            )}
            <button type="submit" className="rounded-3xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 self-start">Send</button>
          </form>
          {status && <p className="mt-3 text-slate-300">{status}</p>}
        </div>
      </div>
    </main>
  );
}
