import { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const markRead = async id => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(note => note._id === id ? { ...note, read: true } : note));
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Notifications</h1>
        <p className="mt-2 text-slate-400">Stay updated on requests, applications and completed tasks.</p>
        <div className="mt-8 space-y-4">
          {notifications.length ? notifications.map(note => (
            <div key={note._id} className={`rounded-3xl border p-5 ${note.read ? 'border-slate-800 bg-slate-950/80' : 'border-brand-500 bg-slate-900/90'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{note.type.replace('_', ' ')}</p>
                  <p className="mt-2 text-slate-300">{note.message}</p>
                </div>
                {!note.read && <button onClick={() => markRead(note._id)} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Mark read</button>}
              </div>
              <p className="mt-3 text-sm text-slate-500">{new Date(note.createdAt).toLocaleString()}</p>
            </div>
          )) : <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-slate-400">No notifications yet.</div>}
        </div>
      </div>
    </main>
  );
}
