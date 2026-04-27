function PlaceholderPage({ icon, title, description, features = [] }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="breadcrumb">Home / <span>{title}</span></div>
        </div>
        <button className="btn btn-primary btn-sm">➕ Add New</button>
      </div>

      <div className="placeholder-page">
        <div className="placeholder-icon">{icon}</div>
        <h2>{title} Module</h2>
        <p>{description}</p>
        {features.length > 0 && (
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {features.map((f) => (
              <span key={f} className="badge badge-purple" style={{ fontSize: 12, padding: '6px 14px' }}>
                ✓ {f}
              </span>
            ))}
          </div>
        )}
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary">🚀 Coming Soon</button>
        </div>
      </div>
    </div>
  );
}

export function ClassPage() {
  return (
    <PlaceholderPage
      icon="🏫"
      title="Class"
      description="Manage all classes, sections, and classroom assignments for the institution."
      features={['Create Classes', 'Assign Teachers', 'Section Management', 'Timetable View', 'Student Count']}
    />
  );
}

export function SubjectPage() {
  return (
    <PlaceholderPage
      icon="📚"
      title="Subject"
      description="Define and manage subjects across departments with credit hours and syllabus tracking."
      features={['Add Subjects', 'Assign to Classes', 'Credit Hours', 'Syllabus Upload', 'Department Filter']}
    />
  );
}

export function RoutinePage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'CS', 'English', 'Biology', 'History', '—'];
  const colors = ['#ede9fe', '#dbeafe', '#d1fae5', '#fef3c7', '#fce7f3', '#e0f2fe', '#fee2e2', '#f3f4f6'];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Routine</div>
          <div className="breadcrumb">Home / <span>Routine</span></div>
        </div>
        <button className="btn btn-primary btn-sm">✏️ Edit Routine</button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">📅 Weekly Timetable — CSE Section A</div>
          <select className="filter-select">
            {['CSE','ECE','MECH','CIVIL'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ overflowX: 'auto', padding: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>Period</th>
                {days.map(d => (
                  <th key={d} style={{ padding: '10px 14px', background: 'var(--primary)', color: '#fff', textAlign: 'center', fontSize: 12, fontWeight: 700 }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p, pi) => (
                <tr key={p}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, fontSize: 12, color: 'var(--primary)', background: '#faf9ff', borderBottom: '1px solid var(--border)' }}>
                    {p} – {periods[pi + 1] || '5:00'}
                  </td>
                  {days.map((d, di) => {
                    const idx = (pi + di) % subjects.length;
                    const sub = subjects[idx];
                    return (
                      <td key={d} style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                        {sub !== '—' ? (
                          <div style={{
                            background: colors[idx], borderRadius: 8,
                            padding: '6px 10px', fontSize: 12, fontWeight: 600,
                            color: '#374151'
                          }}>
                            {sub}
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Break</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ExamPage() {
  const exams = [
    { subject: 'Mathematics',     date: '2026-05-10', time: '9:00 AM',  room: '101', maxMarks: 100, type: 'Final' },
    { subject: 'Physics',         date: '2026-05-12', time: '9:00 AM',  room: '102', maxMarks: 100, type: 'Final' },
    { subject: 'Chemistry',       date: '2026-05-14', time: '9:00 AM',  room: '103', maxMarks: 100, type: 'Final' },
    { subject: 'Computer Science',date: '2026-05-16', time: '10:00 AM', room: 'Lab1',maxMarks: 100, type: 'Final' },
    { subject: 'English',         date: '2026-05-18', time: '9:00 AM',  room: '104', maxMarks: 100, type: 'Final' },
    { subject: 'Mathematics',     date: '2026-04-20', time: '9:00 AM',  room: '101', maxMarks: 50,  type: 'Mid-Term' },
  ];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Exam</div>
          <div className="breadcrumb">Home / <span>Exam</span></div>
        </div>
        <button className="btn btn-primary btn-sm">➕ Schedule Exam</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { icon: '📝', cls: 'purple', val: exams.length,                              lbl: 'Total Exams' },
          { icon: '⏳', cls: 'yellow', val: exams.filter(e => e.date >= today).length, lbl: 'Upcoming' },
          { icon: '✅', cls: 'green',  val: exams.filter(e => e.date < today).length,  lbl: 'Completed' },
          { icon: '🏫', cls: 'blue',   val: '5',                                        lbl: 'Subjects' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Exam Schedule</div></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Subject</th><th>Type</th><th>Date</th><th>Time</th><th>Room</th><th>Max Marks</th><th>Status</th></tr>
            </thead>
            <tbody>
              {exams.map((e, i) => {
                const upcoming = e.date >= today;
                return (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{e.subject}</td>
                    <td><span className="badge badge-purple">{e.type}</span></td>
                    <td>{e.date}</td>
                    <td>{e.time}</td>
                    <td><span className="badge badge-info">{e.room}</span></td>
                    <td style={{ fontWeight: 700 }}>{e.maxMarks}</td>
                    <td>
                      <span className={`badge ${upcoming ? 'badge-warning' : 'badge-success'}`}>
                        {upcoming ? '⏳ Upcoming' : '✅ Done'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function TransportPage() {
  const buses = [
    { route: 'Route 1', driver: 'Ramu Kumar',  vehicle: 'TN-01-AB-1234', capacity: 40, students: 38, area: 'Anna Nagar, Kilpauk',    time: '7:30 AM' },
    { route: 'Route 2', driver: 'Suresh Babu', vehicle: 'TN-01-CD-5678', capacity: 40, students: 35, area: 'Tambaram, Chromepet',   time: '7:45 AM' },
    { route: 'Route 3', driver: 'Mohan Raj',   vehicle: 'TN-01-EF-9012', capacity: 35, students: 30, area: 'Velachery, Adyar',      time: '7:15 AM' },
    { route: 'Route 4', driver: 'Kumar S',      vehicle: 'TN-01-GH-3456', capacity: 40, students: 40, area: 'Porur, Vadapalani',    time: '7:00 AM' },
  ];
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Transport</div>
          <div className="breadcrumb">Home / <span>Transport</span></div>
        </div>
        <button className="btn btn-primary btn-sm">➕ Add Route</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { icon: '🚌', cls: 'purple', val: buses.length, lbl: 'Total Buses' },
          { icon: '👥', cls: 'blue',   val: buses.reduce((a, b) => a + b.students, 0), lbl: 'Students' },
          { icon: '🛣️', cls: 'green',  val: buses.length, lbl: 'Routes' },
          { icon: '✅', cls: 'yellow', val: buses.filter(b => b.students === b.capacity).length, lbl: 'Full Capacity' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Bus Routes</div></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Route</th><th>Driver</th><th>Vehicle No</th><th>Area</th><th>Pickup Time</th><th>Students</th><th>Capacity</th></tr>
            </thead>
            <tbody>
              {buses.map((b, i) => (
                <tr key={i}>
                  <td><span className="badge badge-purple">{b.route}</span></td>
                  <td style={{ fontWeight: 600 }}>{b.driver}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{b.vehicle}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.area}</td>
                  <td><span className="badge badge-info">{b.time}</span></td>
                  <td style={{ fontWeight: 700, color: b.students === b.capacity ? 'var(--danger)' : 'var(--success)' }}>{b.students}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{b.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function HostelPage() {
  const rooms = [
    { room: 'A-101', type: 'Single', floor: 1, occupant: 'Aarav Kumar',   rollNo: '001', status: 'Occupied', fee: 8000 },
    { room: 'A-102', type: 'Double', floor: 1, occupant: 'Arjun Singh',   rollNo: '002', status: 'Occupied', fee: 6000 },
    { room: 'A-103', type: 'Double', floor: 1, occupant: '—',             rollNo: '—',   status: 'Vacant',   fee: 6000 },
    { room: 'B-201', type: 'Single', floor: 2, occupant: 'Karthik R',     rollNo: '016', status: 'Occupied', fee: 8000 },
    { room: 'B-202', type: 'Triple', floor: 2, occupant: 'Manoj Kumar',   rollNo: '018', status: 'Occupied', fee: 5000 },
    { room: 'B-203', type: 'Double', floor: 2, occupant: '—',             rollNo: '—',   status: 'Vacant',   fee: 6000 },
  ];
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Hostel</div>
          <div className="breadcrumb">Home / <span>Hostel</span></div>
        </div>
        <button className="btn btn-primary btn-sm">➕ Allot Room</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { icon: '🏨', cls: 'purple', val: rooms.length, lbl: 'Total Rooms' },
          { icon: '🛏️', cls: 'red',    val: rooms.filter(r => r.status === 'Occupied').length, lbl: 'Occupied' },
          { icon: '✅', cls: 'green',  val: rooms.filter(r => r.status === 'Vacant').length,   lbl: 'Vacant' },
          { icon: '💰', cls: 'yellow', val: '₹' + rooms.reduce((a, r) => a + (r.status === 'Occupied' ? r.fee : 0), 0).toLocaleString('en-IN'), lbl: 'Monthly Revenue' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value" style={{ fontSize: s.lbl === 'Monthly Revenue' ? 18 : 26 }}>{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Room Allotments</div></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Room</th><th>Type</th><th>Floor</th><th>Occupant</th><th>Roll No</th><th>Monthly Fee</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rooms.map((r, i) => (
                <tr key={i}>
                  <td><span className="badge badge-purple">{r.room}</span></td>
                  <td><span className="badge badge-info">{r.type}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>Floor {r.floor}</td>
                  <td style={{ fontWeight: r.status === 'Occupied' ? 600 : 400, color: r.status === 'Vacant' ? 'var(--text-muted)' : 'var(--text)' }}>{r.occupant}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{r.rollNo !== '—' ? `#${r.rollNo}` : '—'}</td>
                  <td style={{ fontWeight: 600 }}>₹{r.fee.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${r.status === 'Occupied' ? 'badge-success' : 'badge-gray'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
