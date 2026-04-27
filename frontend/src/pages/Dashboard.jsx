import { useState, useEffect } from 'react';
import { studentAPI, teacherAPI, libraryAPI, noticeAPI } from '../services/api';

const avatarColors = [
  ['#ede9fe','#6d28d9'],['#d1fae5','#065f46'],['#dbeafe','#1e40af'],
  ['#fef3c7','#92400e'],['#fee2e2','#991b1b'],['#e0f2fe','#0c4a6e'],
];

function colorFor(name) {
  const i = (name || 'A').charCodeAt(0) % avatarColors.length;
  return avatarColors[i];
}

function StatCard({ icon, iconClass, value, label, change, changeType }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {change && <div className={`stat-change ${changeType}`}>{change}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, books: 0, notices: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, t, b, n] = await Promise.all([
          studentAPI.getAll({ limit: 5, page: 1 }),
          teacherAPI.getAll({ limit: 1 }),
          libraryAPI.getAll({ limit: 1 }),
          noticeAPI.getAll(),
        ]);
        setStats({
          students: s.data.total,
          teachers: t.data.total,
          books: b.data.total,
          notices: n.data.length,
        });
        setRecentStudents(s.data.students);
        setRecentNotices(n.data.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard Overview</div>
          <div className="breadcrumb">{today}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-outline btn-sm">📥 Export</button>
          <button className="btn btn-primary btn-sm">+ Quick Add</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="🎓" iconClass="purple" value={loading ? '—' : stats.students} label="Total Students"   change="↑ 4 this week" changeType="up" />
        <StatCard icon="👨‍🏫" iconClass="blue"   value={loading ? '—' : stats.teachers} label="Total Teachers"   change="↑ 1 this month" changeType="up" />
        <StatCard icon="📖" iconClass="green"  value={loading ? '—' : stats.books}    label="Library Books"    change="3 due returns" changeType="down" />
        <StatCard icon="📢" iconClass="yellow" value={loading ? '—' : stats.notices}  label="Active Notices"   change="2 new today" changeType="up" />
        <StatCard icon="🏫" iconClass="red"    value="12"   label="Total Classes"    />
        <StatCard icon="📝" iconClass="purple" value="6"    label="Upcoming Exams"   />
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20 }}>

        {/* Recent Students */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Students</div>
            <a href="/students" style={{ fontSize:12, color:'var(--primary)', fontWeight:600 }}>View All →</a>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th><th>Roll No</th><th>Class</th><th>Section</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text-muted)', padding:32 }}>Loading...</td></tr>
                ) : recentStudents.map(s => {
                  const [bg, fg] = colorFor(s.name);
                  return (
                    <tr key={s._id}>
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
                      <td style={{ fontWeight:600 }}>#{s.rollNo}</td>
                      <td>{s.class}</td>
                      <td>{s.section}</td>
                      <td><span className="badge badge-success">{s.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notices */}
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">📢 Latest Notices</div>
              <a href="/notice" style={{ fontSize:12, color:'var(--primary)', fontWeight:600 }}>View All →</a>
            </div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {loading ? (
                <div style={{ color:'var(--text-muted)', textAlign:'center', padding:24 }}>Loading...</div>
              ) : recentNotices.map(n => (
                <div key={n._id} className={`notice-card ${n.category}`} style={{ marginBottom:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span className="badge badge-purple" style={{ fontSize:10 }}>{n.category}</span>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>{n.audience}</span>
                  </div>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{n.title}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>
                    {n.content.slice(0,80)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {[
          { label:'Present Today', value:'28', icon:'✅', color:'var(--success)' },
          { label:'Absent Today',  value:'7',  icon:'❌', color:'var(--danger)' },
          { label:'Fee Collected', value:'₹1.2L', icon:'💰', color:'var(--primary)' },
          { label:'Fee Pending',   value:'₹45K',  icon:'⏳', color:'var(--warning)' },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding:16, textAlign:'center' }}>
            <div style={{ fontSize:28 }}>{item.icon}</div>
            <div style={{ fontSize:22, fontWeight:800, color:item.color, marginTop:4 }}>{item.value}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
