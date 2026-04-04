import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, colorClass }) => (
  <div className={`card border-t-4 ${colorClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-4xl font-display font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of all complaints and system activity</p>
        </div>
        <Link to="/admin/complaints" className="btn-primary">
          Manage Complaints →
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Complaints" value={stats?.total ?? 0} icon="📋" colorClass="border-brand-500" />
        <StatCard label="Pending" value={stats?.pending ?? 0} icon="⏳" colorClass="border-amber-400" />
        <StatCard label="In Progress" value={stats?.inProgress ?? 0} icon="🔄" colorClass="border-blue-400" />
        <StatCard label="Resolved" value={stats?.resolved ?? 0} icon="✅" colorClass="border-emerald-400" />
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon="👥" colorClass="border-purple-400" />
      </div>

      {/* By Category */}
      {stats?.byCategory?.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-5">Complaints by Category</h2>
          <div className="space-y-3">
            {stats.byCategory.map(({ _id, count }) => {
              const pct = Math.round((count / stats.total) * 100);
              return (
                <div key={_id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{_id}</span>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;