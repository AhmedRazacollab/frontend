export default function StatsCard({ title, value, description }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  );
}
