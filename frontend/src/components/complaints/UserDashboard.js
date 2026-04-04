import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserComplaints } from '../../api';
import StatusBadge from '../layout/StatusBadge';

const StatCard = ({ label, value, color }) => (
  <div className={`card border-l-4 ${color}`}>
    <p className="text-3xl font-display font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserComplaints()
      .then(({ data }) => setComplaints(data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Hello, {user?.name} 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's an overview of your complaints</p>
        </div>
        <Link to="/submit-complaint" className="btn-primary">
          + New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Submitted" value={complaints.length} color="border-brand-500" />
        <StatCard label="Pending" value={pending} color="border-amber-400" />
        <StatCard label="In Progress" value={inProgress} color="border-blue-400" />
        <StatCard label="Resolved" value={resolved} color="border-emerald-400" />
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-slate-900">Recent Complaints</h2>
          <Link to="/my-complaints" className="text-sm text-brand-600 font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-slate-500 font-medium">No complaints yet</p>
            <Link to="/submit-complaint" className="btn-primary mt-4 inline-block">
              Submit your first complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 5).map((c) => (
              <div key={c._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.category} · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;