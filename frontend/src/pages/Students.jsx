import { useState, useEffect, useCallback } from 'react';
import { studentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const avatarColors = [
  ['#ede9fe','#6d28d9'],['#d1fae5','#065f46'],['#dbeafe','#1e40af'],
  ['#fef3c7','#92400e'],['#fee2e2','#991b1b'],['#fce7f3','#9d174d'],
];
const colorFor = (name) => avatarColors[(name || 'A').charCodeAt(0) % avatarColors.length];

const EMPTY_FORM = { name:'', rollNo:'', class:'CSE', section:'A', phone:'', email:'', address:'', dateOfBirth:'', gender:'Male', status:'Active' };

function StudentModal({ student, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(student || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.rollNo) return toast('Name and Roll No are required', 'error');
    setSaving(true);
    try {
      if (student) { await studentAPI.update(student._id, form); toast('Student updated!', 'success'); }
      else         { await studentAPI.create(form);              toast('Student added!', 'success'); }
      onSaved();
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{student ? '✏️ Edit Student' : '➕ Add Student'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" name="name" value={form.name} onChange={handle} placeholder="e.g. Aarav Kumar" required />
              </div>
              <div className="form-group">
                <label className="form-label">Roll No *</label>
                <input className="form-control" name="rollNo" value={form.rollNo} onChange={handle} placeholder="e.g. 001" required />
              </div>
              <div className="form-group">
                <label className="form-label">Class</label>
                <select className="form-control" name="class" value={form.class} onChange={handle}>
                  {['CSE','ECE','MECH','CIVIL','EEE','IT','MBA','MCA'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <select className="form-control" name="section" value={form.section} onChange={handle}>
                  {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" name="gender" value={form.gender} onChange={handle}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-control" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handle} placeholder="10-digit number" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" name="email" value={form.email} onChange={handle} placeholder="student@school.edu" />
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
              {saving ? '⏳ Saving...' : (student ? '💾 Update' : '➕ Add Student')}
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
          <div className="modal-title">🗑️ Delete Student</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ textAlign:'center', padding:'28px 24px' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
          <p style={{ color:'var(--text)', fontWeight:600, fontSize:15, marginBottom:8 }}>Are you sure?</p>
          <p style={{ color:'var(--text-muted)', fontSize:13 }}>
            You are about to delete <strong>{name}</strong>. This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" style={{ background:'var(--danger)', color:'#fff' }} onClick={onConfirm}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Students() {
  const toast = useToast();
  const [data, setData] = useState({ students: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const LIMIT = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getAll({ page, limit: LIMIT, search, classFilter });
      setData(res.data);
    } catch { toast('Failed to load students', 'error'); }
    finally { setLoading(false); }
  }, [page, search, classFilter]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { setPage(1); }, [search, classFilter]);

  const handleDelete = async () => {
    try {
      await studentAPI.delete(selected._id);
      toast('Student deleted', 'success');
      setModal(null); setSelected(null);
      fetchStudents();
    } catch { toast('Delete failed', 'error'); }
  };

  const openEdit = (s) => { setSelected(s); setModal('edit'); };
  const openDelete = (s) => { setSelected(s); setModal('delete'); };

  const pages = Array.from({ length: data.totalPages }, (_, i) => i + 1);

  return (
    <div className="page-shell">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Students</div>
          <div className="breadcrumb">Home / <span>Students</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('add'); }}>
          ➕ Add Student
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { icon:'🎓', cls:'purple', val: data.total, lbl:'Total Students' },
          { icon:'✅', cls:'green',  val: Math.round(data.total * 0.8), lbl:'Active' },
          { icon:'🚹', cls:'blue',   val: Math.round(data.total * 0.56), lbl:'Male' },
          { icon:'🚺', cls:'red',    val: Math.round(data.total * 0.44), lbl:'Female' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Students Information</div>
          <div className="toolbar">
            <div className="search-box">
              <span className="si">🔍</span>
              <input
                type="text"
                placeholder="Search by name or roll..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
              <option value="">All Classes</option>
              {['CSE','ECE','MECH','CIVIL','EEE','IT','MBA','MCA'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state"><p>⏳ Loading students...</p></div>
          ) : data.students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <p>No students found. Try a different search.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s, idx) => {
                  const [bg, fg] = colorFor(s.name);
                  return (
                    <tr key={s._id}>
                      <td style={{ color:'var(--text-muted)', fontSize:12 }}>{(page - 1) * LIMIT + idx + 1}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="avatar-initials" style={{ background:bg, color:fg }}>
                            {s.name.slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, fontSize:13 }}>{s.name}</div>
                            <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span style={{ fontWeight:700, color:'var(--primary)' }}>#{s.rollNo}</span></td>
                      <td>{s.class}</td>
                      <td>{s.section}</td>
                      <td>
                        <span className={`badge ${s.gender === 'Female' ? 'badge-info' : 'badge-purple'}`}>
                          {s.gender}
                        </span>
                      </td>
                      <td style={{ fontSize:13 }}>{s.phone}</td>
                      <td>
                        <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-gray'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className="td-actions">
                          <button className="btn-icon" title="Edit" onClick={() => openEdit(s)}>✏️</button>
                          <button className="btn-icon danger" title="Delete" onClick={() => openDelete(s)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {Math.min((page - 1) * LIMIT + 1, data.total)}–{Math.min(page * LIMIT, data.total)} of {data.total} students
            </div>
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {pages.map(p => (
              <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <StudentModal
          student={modal === 'edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={() => { setModal(null); setSelected(null); fetchStudents(); }}
        />
      )}
      {modal === 'delete' && selected && (
        <ConfirmModal
          name={selected.name}
          onConfirm={handleDelete}
          onClose={() => { setModal(null); setSelected(null); }}
        />
      )}
    </div>
  );
}
