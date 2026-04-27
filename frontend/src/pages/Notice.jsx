import { useState, useEffect, useCallback } from 'react';
import { noticeAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const EMPTY = { title:'', content:'', category:'General', audience:'All', publishedDate: new Date().toISOString().split('T')[0], isActive:true };
const CATEGORIES = ['General','Exam','Holiday','Event','Urgent'];
const AUDIENCES  = ['All','Students','Teachers','Parents'];

const catColors = { General:'badge-purple', Exam:'badge-danger', Holiday:'badge-success', Event:'badge-info', Urgent:'badge-warning' };
const catIcons  = { General:'📋', Exam:'📝', Holiday:'🏖️', Event:'🎉', Urgent:'🚨' };

function NoticeModal({ notice, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(notice || EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast('Title and content required', 'error');
    setSaving(true);
    try {
      if (notice) { await noticeAPI.update(notice._id, form); toast('Notice updated!', 'success'); }
      else        { await noticeAPI.create(form);              toast('Notice published!', 'success'); }
      onSaved();
    } catch { toast('Error saving notice', 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{notice ? '✏️ Edit Notice' : '📢 New Notice'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Title *</label>
                <input className="form-control" name="title" value={form.title} onChange={handle} placeholder="Notice title" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" name="category" value={form.category} onChange={handle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Audience</label>
                <select className="form-control" name="audience" value={form.audience} onChange={handle}>
                  {AUDIENCES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Published Date</label>
                <input className="form-control" type="date" name="publishedDate" value={form.publishedDate} onChange={handle} />
              </div>
              <div className="form-group full">
                <label className="form-label">Content *</label>
                <textarea className="form-control" name="content" value={form.content} onChange={handle}
                  placeholder="Notice details..." rows={4} required style={{ resize:'vertical' }} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Publishing...' : notice ? '💾 Update' : '📢 Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Notice() {
  const toast = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await noticeAPI.getAll();
      setNotices(res.data);
    } catch { toast('Failed to load notices', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await noticeAPI.delete(id);
      toast('Notice deleted', 'success');
      fetchNotices();
    } catch { toast('Delete failed', 'error'); }
  };

  const filtered = filter === 'All' ? notices : notices.filter(n => n.category === filter);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Notice Board</div>
          <div className="breadcrumb">Home / <span>Notice</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('add'); }}>
          📢 New Notice
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="btn btn-sm"
            style={{
              background: filter === cat ? 'var(--primary)' : 'var(--bg-card)',
              color: filter === cat ? '#fff' : 'var(--text-muted)',
              border: `1.5px solid ${filter === cat ? 'var(--primary)' : 'var(--border)'}`,
            }}
          >
            {catIcons[cat] || '📋'} {cat}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="empty-state"><p>⏳ Loading notices...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📢</div>
          <p>No notices yet. Add one!</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
          {filtered.map(n => (
            <div key={n._id} className={`notice-card ${n.category}`}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:22 }}>{catIcons[n.category] || '📋'}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{n.title}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                      {n.publishedDate} · For: {n.audience}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button className="btn-icon" style={{ padding:5 }} onClick={() => { setSelected(n); setModal('edit'); }}>✏️</button>
                  <button className="btn-icon danger" style={{ padding:5 }} onClick={() => handleDelete(n._id)}>🗑️</button>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                <span className={`badge ${catColors[n.category] || 'badge-gray'}`}>{n.category}</span>
                <span className="badge badge-gray">{n.audience}</span>
              </div>
              <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>{n.content}</p>
              <div style={{ marginTop:12, fontSize:11, color:'var(--text-light)' }}>
                Posted: {new Date(n.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal==='add'||modal==='edit') && (
        <NoticeModal
          notice={modal==='edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={() => { setModal(null); setSelected(null); fetchNotices(); }}
        />
      )}
    </div>
  );
}
