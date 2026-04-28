import { useState, useEffect, useCallback } from 'react';
import { libraryAPI } from '../services/api';
import { useToast } from '../context/useToast';

const EMPTY = { title:'', author:'', isbn:'', category:'Computer Science', quantity:1, available:1, publishedYear:'', status:'Available' };
const CATEGORIES = ['Computer Science','Mathematics','Physics','Chemistry','Biology','English','History','Geography','Programming','Software Design'];

function BookModal({ book, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(book || EMPTY);
  const [saving, setSaving] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author) return toast('Title and Author required', 'error');
    setSaving(true);
    try {
      if (book) { await libraryAPI.update(book._id, form); toast('Book updated!', 'success'); }
      else      { await libraryAPI.create(form);           toast('Book added!', 'success'); }
      onSaved();
    } catch (err) {
      toast(err.response?.data?.message || 'Error saving book', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{book ? '✏️ Edit Book' : '📗 Add Book'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Book Title *</label>
                <input className="form-control" name="title" value={form.title} onChange={handle} placeholder="Book title" required />
              </div>
              <div className="form-group">
                <label className="form-label">Author *</label>
                <input className="form-control" name="author" value={form.author} onChange={handle} placeholder="Author name" required />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input className="form-control" name="isbn" value={form.isbn} onChange={handle} placeholder="978-XXXXXXXXXX" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" name="category" value={form.category} onChange={handle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Published Year</label>
                <input className="form-control" name="publishedYear" value={form.publishedYear} onChange={handle} placeholder="e.g. 2023" />
              </div>
              <div className="form-group">
                <label className="form-label">Total Quantity</label>
                <input className="form-control" type="number" name="quantity" min="1" value={form.quantity} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Available</label>
                <input className="form-control" type="number" name="available" min="0" value={form.available} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" name="status" value={form.status} onChange={handle}>
                  <option>Available</option><option>Issued</option><option>Lost</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving...' : book ? '💾 Update' : '📗 Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Library() {
  const toast = useToast();
  const [data, setData] = useState({ books: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const LIMIT = 10;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryAPI.getAll({ page, limit: LIMIT, search });
      setData(res.data);
    } catch { toast('Failed to load books', 'error'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await libraryAPI.delete(id);
      toast('Book deleted', 'success');
      fetchBooks();
    } catch { toast('Delete failed', 'error'); }
  };

  const statusBadge = (s) => ({ Available:'badge-success', Issued:'badge-warning', Lost:'badge-danger' }[s] || 'badge-gray');
  const pages = Array.from({ length: data.totalPages }, (_, i) => i + 1);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Library</div>
          <div className="breadcrumb">Home / <span>Library</span></div>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('add'); }}>
          📗 Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { icon:'📚', cls:'purple', val:data.total,           lbl:'Total Books' },
          { icon:'✅', cls:'green',  val:data.books.filter(b=>b.status==='Available').length, lbl:'Available' },
          { icon:'📤', cls:'yellow', val:data.books.filter(b=>b.status==='Issued').length, lbl:'Issued' },
          { icon:'❌', cls:'red',    val:data.books.filter(b=>b.status==='Lost').length, lbl:'Lost' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Book Inventory</div>
          <div className="toolbar">
            <div className="search-box">
              <span className="si">🔍</span>
              <input type="text" placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="empty-state"><p>⏳ Loading books...</p></div>
          ) : data.books.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📚</div><p>No books found.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Book Title</th><th>Author</th><th>Category</th>
                  <th>ISBN</th><th>Year</th><th>Qty</th><th>Available</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.books.map((b, idx) => (
                  <tr key={b._id}>
                    <td style={{ color:'var(--text-muted)', fontSize:12 }}>{(page-1)*LIMIT+idx+1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:'#ede9fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📘</div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{b.title}</div>
                      </div>
                    </td>
                    <td style={{ fontSize:13 }}>{b.author}</td>
                    <td><span className="badge badge-info">{b.category}</span></td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{b.isbn || '—'}</td>
                    <td style={{ fontSize:13 }}>{b.publishedYear || '—'}</td>
                    <td style={{ fontWeight:600 }}>{b.quantity}</td>
                    <td>
                      <span style={{ fontWeight:700, color: b.available > 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {b.available}
                      </span>
                    </td>
                    <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-icon" onClick={() => { setSelected(b); setModal('edit'); }}>✏️</button>
                        <button className="btn-icon danger" onClick={() => handleDelete(b._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data.totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">Showing {Math.min((page-1)*LIMIT+1,data.total)}–{Math.min(page*LIMIT,data.total)} of {data.total}</div>
            <button className="page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
            {pages.map(p => <button key={p} className={`page-btn${p===page?' active':''}`} onClick={() => setPage(p)}>{p}</button>)}
            <button className="page-btn" disabled={page===data.totalPages} onClick={() => setPage(p=>p+1)}>›</button>
          </div>
        )}
      </div>

      {(modal==='add'||modal==='edit') && (
        <BookModal
          book={modal==='edit' ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={() => { setModal(null); setSelected(null); fetchBooks(); }}
        />
      )}
    </div>
  );
}
