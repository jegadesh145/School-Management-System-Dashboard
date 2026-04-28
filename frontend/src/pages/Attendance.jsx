import { useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../services/api';
import { useToast } from '../context/useToast';

export default function Attendance() {
  const toast = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [classFilter, setClassFilter] = useState('CSE');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // rollNo -> status
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setSaved(false);
      try {
        // Load students for class
        const sRes = await studentAPI.getAll({ classFilter, limit: 100 });
        const studentList = sRes.data.students;
        setStudents(studentList);

        // Load existing attendance records
        const aRes = await attendanceAPI.get({ date, class: classFilter });
        const map = {};
        aRes.data.forEach(r => { map[r.rollNo] = r.status; });

        // Default to Present for unrecorded
        const init = {};
        studentList.forEach(s => { init[s.rollNo] = map[s.rollNo] || 'Present'; });
        setAttendance(init);
      } catch { toast('Failed to load', 'error'); }
      finally { setLoading(false); }
    }
    load();
  }, [date, classFilter]);

  const setStatus = (rollNo, status) => setAttendance(prev => ({ ...prev, [rollNo]: status }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s._id,
        studentName: s.name,
        rollNo: s.rollNo,
        class: s.class,
        date,
        status: attendance[s.rollNo] || 'Present',
      }));
      await attendanceAPI.saveBulk(records);
      toast('Attendance saved successfully!', 'success');
      setSaved(true);
    } catch { toast('Failed to save attendance', 'error'); }
    finally { setSaving(false); }
  };

  const markAll = (status) => {
    const all = {};
    students.forEach(s => { all[s.rollNo] = status; });
    setAttendance(all);
  };

  const present = Object.values(attendance).filter(v => v === 'Present').length;
  const absent  = Object.values(attendance).filter(v => v === 'Absent').length;
  const late    = Object.values(attendance).filter(v => v === 'Late').length;

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Attendance</div>
          <div className="breadcrumb">Home / <span>Attendance</span></div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving || students.length === 0}>
          {saving ? '⏳ Saving...' : '💾 Save Attendance'}
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-body">
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
            <div className="form-group" style={{ flex:1, minWidth:180 }}>
              <label className="form-label">Date</label>
              <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex:1, minWidth:180 }}>
              <label className="form-label">Class</label>
              <select className="form-control" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
                {['CSE','ECE','MECH','CIVIL','EEE','IT','MBA','MCA'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:18 }}>
              <button className="btn btn-success btn-sm" onClick={() => markAll('Present')}>✅ All Present</button>
              <button className="btn btn-danger btn-sm" onClick={() => markAll('Absent')}>❌ All Absent</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { icon:'👥', cls:'purple', val:students.length, lbl:'Total Students' },
          { icon:'✅', cls:'green',  val:present,         lbl:'Present' },
          { icon:'❌', cls:'red',    val:absent,          lbl:'Absent' },
          { icon:'⏱️', cls:'yellow', val:late,            lbl:'Late' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Mark Attendance — {classFilter} | {date}</div>
          {saved && <span className="badge badge-success">✅ Saved</span>}
        </div>
        <div className="table-wrapper attendance-table">
          {loading ? (
            <div className="empty-state"><p>⏳ Loading students...</p></div>
          ) : students.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>No students for this class.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Student Name</th><th>Roll No</th><th style={{ textAlign:'center' }}>Present</th><th style={{ textAlign:'center' }}>Absent</th><th style={{ textAlign:'center' }}>Late</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => {
                  const status = attendance[s.rollNo] || 'Present';
                  return (
                    <tr key={s._id}>
                      <td style={{ color:'var(--text-muted)', fontSize:12 }}>{idx+1}</td>
                      <td>
                        <div style={{ fontWeight:600, fontSize:13 }}>{s.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.gender}</div>
                      </td>
                      <td><span style={{ fontWeight:700, color:'var(--primary)' }}>#{s.rollNo}</span></td>
                      <td style={{ textAlign:'center' }}>
                        <button
                          className={`present-btn${status==='Present'?' active':''}`}
                          onClick={() => setStatus(s.rollNo, 'Present')}
                        >P</button>
                      </td>
                      <td style={{ textAlign:'center' }}>
                        <button
                          className={`absent-btn${status==='Absent'?' active':''}`}
                          onClick={() => setStatus(s.rollNo, 'Absent')}
                        >A</button>
                      </td>
                      <td style={{ textAlign:'center' }}>
                        <button
                          className={`late-btn${status==='Late'?' active':''}`}
                          onClick={() => setStatus(s.rollNo, 'Late')}
                        >L</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {students.length > 0 && (
          <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save Attendance'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
