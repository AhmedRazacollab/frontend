import { Link } from 'react-router-dom';

export default function RequestCard({ request }) {
  return (
    <Link to={`/requests/${request._id}`} className="group block rounded-3xl border border-slate-800 bg-slate-900/90 p-5 transition hover:-translate-y-0.5 hover:border-brand-500">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{request.title}</h3>
          <p className="mt-2 text-slate-400 line-clamp-2">{request.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${request.urgency === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
          {request.urgency}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-400">
        <span className="rounded-full bg-slate-800 px-3 py-1">{request.category}</span>
        {request.tags?.map(tag => (
          <span key={tag} className="rounded-full bg-slate-800 px-3 py-1">{tag}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{request.createdBy?.name || 'Community'}</span>
        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
