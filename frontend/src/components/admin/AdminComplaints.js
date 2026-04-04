import React, { useEffect, useState, useCallback } from 'react';
import { getAllComplaints, updateComplaintStatus, deleteComplaint } from '../../api';
import StatusBadge from '../layout/StatusBadge';
import { toast } from 'react-toastify';

const STATUSES = ['Pending', 'In Progress', 'Resolved'];
const CATEGORIES = ['Technical', 'Billing', 'Service', 'Product', 'Other'];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ status: '', adminNote: '' });

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    getAllComplaints(filters)
      .then(({ data }) => setComplaints(data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditData({ status: c.status, adminNote: c.adminNote || '' });
  };

  const handleUpdate = async (id) => {
    try {
      await updateComplaintStatus(id, editData);
      toast.success('Complaint updated!');
      setEditingId(null);
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint? This action cannot be undone.')) return;
    try {
      await deleteComplaint(id);
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">All Complaints</h1>
        <p className="text-slate-500 mt-1">Review, update, and manage all user complaints</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Filter by Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field py-2"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Filter by Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input-field py-2"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={() => setFilters({ status: '', category: '' })} className="btn-secondary py-2">
            Clear
          </button>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full"></div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-slate-500">No complaints found for selected filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{c.title}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="bg-slate-100 px-2 py-1 rounded-lg font-medium">{c.category}</span>
                    <span>👤 {c.user?.name} ({c.user?.email})</span>
                    <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {c.adminNote && editingId !== c._id && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                      <strong>Note:</strong> {c.adminNote}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {editingId === c._id ? (
                    <div className="space-y-2">
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="input-field py-2 text-sm"
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <textarea
                        value={editData.adminNote}
                        onChange={(e) => setEditData({ ...editData, adminNote: e.target.value })}
                        placeholder="Add admin note..."
                        rows={2}
                        className="input-field text-sm resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(c._id)} className="btn-primary flex-1 text-sm py-2">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-secondary flex-1 text-sm py-2">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(c)} className="btn-secondary flex-1 text-sm py-2">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="btn-danger text-sm py-2 px-3">
                        🗑
                      </button>
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

export default AdminComplaints;