export default function AdminPanelPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Admin panel</h1>
        <p className="mt-2 text-slate-400">Manage users, requests, and community analytics from a centralized dashboard.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Users</h2>
            <p className="mt-3 text-slate-300">View and manage roles, contributions, and trust scores.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Requests</h2>
            <p className="mt-3 text-slate-300">Review open and completed requests, and moderate content.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Analytics</h2>
            <p className="mt-3 text-slate-300">Monitor platform performance and community growth metrics.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
