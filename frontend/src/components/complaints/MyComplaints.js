import React, { useEffect, useState } from 'react';
import { getUserComplaints } from '../../api';
import StatusBadge from '../layout/StatusBadge';
import { Link } from 'react-router-dom';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getUserComplaints()
      .then(({ data }) => setComplaints(data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">My Complaints</h1>
          <p className="text-slate-500 mt-1">{complaints.length} total complaints submitted</p>
        </div>
        <Link to="/submit-complaint" className="btn-primary">+ New Complaint</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === s
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-slate-500">No complaints found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold text-slate-900 text-lg">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-slate-500 text-sm mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="bg-slate-100 px-2 py-1 rounded-lg font-medium">{c.category}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  {c.adminNote && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Admin Note</p>
                      <p className="text-sm text-blue-700">{c.adminNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;