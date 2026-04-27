import { useState, useEffect, useCallback } from 'react';
import { teacherAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const avatarColors = [
  ['#ede9fe','#6d28d9'],['#dbeafe','#1e40af'],['#d1fae5','#065f46'],
  ['#fef3c7','#92400e'],['#fce7f3','#9d174d'],['#e0f2fe','#0c4a6e'],
];
const colorFor = (name) => avatarColors[(name || 'T').charCodeAt(0) % avatarColors.length];

const EMPTY = { name:'', employeeId:'', subject:'', class:'CSE', phone:'', email:'', address:'', qualification:'', gender:'Male', status:'Active', joinDate:'' };

function TeacherModal({ teacher, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(teacher || EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.employeeId || !form.subject) return toast('Name, Employee ID, Subject required', 'error');
    setSaving(true);
    try {
      if (teacher) { await teacherAPI.update(teacher._id, form); toast('Teacher updated!', 'success'); }
      else         { await teacherAPI.create(form);               toast('Teacher added!', 'success'); }
      onSaved();
    } catch (err) {
      toast(err.response?.data?.message || 'Error saving teacher', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{teacher ? '✏️ Edit Teacher' : '➕ Add Teacher'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" name="name" value={form.name} onChange={handle} placeholder="Dr. / Mr. / Ms." required />
              </div>
              <div className="form-group">
                <label className="form-label">Employee ID *</label>
                <input className="form-control" name="employeeId" value={form.employeeId} onChange={handle} placeholder="T001" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input className="form-control" name="subject" value={form.subject} onChange={handle} placeholder="e.g. Mathematics" required />
              </div>
              <div className="form-group">
                <label className="form-label">Class Assigned</label>
                <select className="form-control" name="class" value={form.class} onChange={handle}>
                  {['CSE','ECE','MECH','CIVIL','EEE','IT','MBA','MCA'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" name="gender" value={form.gender} onChange={handle}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Join Date</label>
                <input className="form-control" type="date" name="joinDate" value={form.joinDate} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handle} placeholder="10-digit" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" name="email" value={form.email} onChange={handle} placeholder="teacher@school.edu" />
              </div>
              <div className="form-group full">
                <label className="form-label">Qualification</label>
                <input className="form-control" name="qualification" value={form.qualification} onChange={handle} placeholder="e.g. Ph.D Mathematics" />
              </div>
              <div className="form-group full">
                <label className="form-label">Address</label>
                <input className="form-control" name="address" value={form.address} onChange={handle} placeholder="City, State" />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" name="status" value={form.status} onChange={handle}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving...' : teacher ? '💾 Update' : '➕ Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ name, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🗑️ Delete Teacher</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ textAlign:'center', padding:'28px 24px' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
          <p style={{ fontWeight:600, fontSize:15, marginBottom:8 }}>Are you sure?</p>
          <p style={{ color:'var(--text-muted)', fontSize:13 }}>Delete <strong>{name}</strong>? This cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn" style={{ background:'var(--danger)', color:'#fff' }} onClick={onConfirm}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function Teachers() {
  const toast = useToast();
  const [data, setData] = useState({ teachers: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const LIMIT = 10;

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teacherAPI.getAll({ page, limit: LIMIT, search });
      setData(res.data);
    } catch { toast('Failed to load teachers', 'error'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async () => {
    try {
      await teacherAPI.delete(selected._id);
      toast('Teacher deleted', 'success');
      setModal(null); setSelected(null); fetchTeachers();
    } catch { toast('Delete failed', 'error'); }
  };

  const pages = Array.from({ length: data.totalPages }, (_, i) => i + 1);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Teachers</div>
          <div className="breadcrumb">Home / <span>Teachers</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('add'); }}>
          ➕ Add Teacher
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { icon:'👨‍🏫', cls:'purple', val:data.total,  lbl:'Total Teachers' },
          { icon:'✅',   cls:'green',  val:Math.round(data.total*0.9), lbl:'Active' },
          { icon:'🚹',   cls:'blue',   val:Math.round(data.total*0.55), lbl:'Male' },
          { icon:'🚺',   cls:'red',    val:Math.round(data.total*0.45), lbl:'Female' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Teachers Information</div>
          <div className="toolbar">
            <div className="search-box">
              <span className="si">🔍</span>
              <input type="text" placeholder="Search by name or subject..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state"><p>⏳ Loading teachers...</p></div>
          ) : data.teachers.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👨‍🏫</div><p>No teachers found.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Teacher</th><th>Emp ID</th><th>Subject</th>
                  <th>Class</th><th>Phone</th><th>Qualification</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.teachers.map((t, idx) => {
                  const [bg, fg] = colorFor(t.name);
                  return (
                    <tr key={t._id}>
                      <td style={{ color:'var(--text-muted)', fontSize:12 }}>{(page-1)*LIMIT+idx+1}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="avatar-initials" style={{ background:bg, color:fg }}>
                            {t.name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i,'').slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:13 }}>{t.name}</div>
                            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{t.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontWeight:700, color:'var(--primary)' }}>{t.employeeId}</span></td>
                      <td>{t.subject}</td>
                      <td><span className="badge badge-purple">{t.class}</span></td>
                      <td style={{ fontSize:13 }}>{t.phone}</td>
                      <td style={{ fontSize:12, color:'var(--text-muted)' }}>{t.qualification}</td>
                      <td><span className={`badge ${t.status==='Active'?'badge-success':'badge-gray'}`}>{t.status}</span></td>
                      <td>
                        <div className="td-actions">
                          <button className="btn-icon" onClick={() => { setSelected(t); setModal('edit'); }}>✏️</button>
                          <button className="btn-icon danger" onClick={() => { setSelected(t); setModal('delete'); }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {data.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {Math.min((page-1)*LIMIT+1,data.total)}–{Math.min(page*LIMIT,data.total)} of {data.total}
            </div>
            <button className="page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
            {pages.map(p => <button key={p} className={`page-btn${p===page?' active':''}`} onClick={() => setPage(p)}>{p}</button>)}
            <button className="page-btn" disabled={page===data.totalPages} onClick={() => setPage(p=>p+1)}>›</button>
          </div>
        )}
      </div>

      {(modal==='add'||modal==='edit') && (
        <TeacherModal
          teacher={modal==='edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={() => { setModal(null); setSelected(null); fetchTeachers(); }}
        />
      )}
      {modal==='delete' && selected && (
        <ConfirmModal name={selected.name} onConfirm={handleDelete} onClose={() => { setModal(null); setSelected(null); }} />
      )}
    </div>
  );
}
