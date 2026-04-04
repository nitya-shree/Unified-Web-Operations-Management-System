import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitComplaint } from '../../api';
import { toast } from 'react-toastify';

const CATEGORIES = ['Technical', 'Billing', 'Service', 'Product', 'Other'];

const ComplaintForm = () => {
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Please select a category');
    setLoading(true);
    try {
      await submitComplaint(form);
      toast.success('Complaint submitted successfully!');
      navigate('/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Submit a Complaint</h1>
        <p className="text-slate-500 mt-1">Describe your issue and we'll get back to you promptly</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Complaint Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief summary of your issue"
              className="input-field"
              maxLength={100}
              required
            />
            <p className="text-xs text-slate-400 mt-1">{form.title.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    form.category === cat
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your issue in detail..."
              className="input-field resize-none"
              maxLength={1000}
              required
            />
            <p className="text-xs text-slate-400 mt-1">{form.description.length}/1000 characters</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;