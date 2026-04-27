const feeData = [
  { id:1, name:'Aarav Kumar',   rollNo:'001', class:'CSE', amount:45000, paid:45000, due:0,     status:'Paid',    lastPaid:'2026-04-01' },
  { id:2, name:'Arjun Singh',   rollNo:'002', class:'CSE', amount:45000, paid:30000, due:15000, status:'Partial', lastPaid:'2026-03-15' },
  { id:3, name:'Ananya Reddy',  rollNo:'004', class:'CSE', amount:45000, paid:0,     due:45000, status:'Pending', lastPaid:'—' },
  { id:4, name:'Bhavya Patel',  rollNo:'005', class:'CSE', amount:45000, paid:45000, due:0,     status:'Paid',    lastPaid:'2026-04-05' },
  { id:5, name:'Deepak Yadav',  rollNo:'009', class:'CSE', amount:45000, paid:22500, due:22500, status:'Partial', lastPaid:'2026-03-20' },
  { id:6, name:'Esha Gupta',    rollNo:'010', class:'CSE', amount:45000, paid:45000, due:0,     status:'Paid',    lastPaid:'2026-04-10' },
  { id:7, name:'Jega Desh',     rollNo:'015', class:'CSE', amount:45000, paid:0,     due:45000, status:'Pending', lastPaid:'—' },
  { id:8, name:'Karthik R',     rollNo:'016', class:'CSE', amount:45000, paid:45000, due:0,     status:'Paid',    lastPaid:'2026-04-02' },
];

const statusBadge = { Paid:'badge-success', Partial:'badge-warning', Pending:'badge-danger' };
const statusIcon  = { Paid:'✅', Partial:'⏳', Pending:'❌' };

export default function Accounts() {
  const totalCollected = feeData.reduce((a,f) => a+f.paid, 0);
  const totalDue       = feeData.reduce((a,f) => a+f.due, 0);
  const totalFees      = feeData.reduce((a,f) => a+f.amount, 0);

  const fmt = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Accounts</div>
          <div className="breadcrumb">Home / <span>Accounts</span></div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-outline btn-sm">📥 Export</button>
          <button className="btn btn-primary btn-sm">➕ Record Payment</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { icon:'💰', cls:'purple', val:fmt(totalFees),      lbl:'Total Fees' },
          { icon:'✅', cls:'green',  val:fmt(totalCollected), lbl:'Collected' },
          { icon:'⏳', cls:'yellow', val:fmt(totalDue),       lbl:'Pending Due' },
          { icon:'📊', cls:'blue',   val:Math.round(totalCollected/totalFees*100)+'%', lbl:'Collection Rate' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div><div className="stat-value" style={{ fontSize:18 }}>{s.val}</div><div className="stat-label">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      {/* Collection Progress */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-header"><div className="card-title">Fee Collection Progress</div></div>
        <div className="card-body">
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>
            <span>Collected: {fmt(totalCollected)}</span>
            <span>Remaining: {fmt(totalDue)}</span>
          </div>
          <div style={{ background:'#f3f4f6', borderRadius:99, height:12, overflow:'hidden' }}>
            <div style={{
              width: `${Math.round(totalCollected/totalFees*100)}%`,
              height:'100%',
              background:'linear-gradient(90deg, var(--primary), var(--accent))',
              borderRadius:99,
              transition:'width 1s ease',
            }} />
          </div>
          <div style={{ textAlign:'center', marginTop:8, fontSize:13, fontWeight:700, color:'var(--primary)' }}>
            {Math.round(totalCollected/totalFees*100)}% Collected
          </div>
        </div>
      </div>

      {/* Fee Table */}
      <div className="card">
        <div className="card-header"><div className="card-title">Student Fee Records</div></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Student</th><th>Roll No</th><th>Total Fee</th>
                <th>Paid</th><th>Due</th><th>Last Payment</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feeData.map((f, idx) => (
                <tr key={f.id}>
                  <td style={{ color:'var(--text-muted)', fontSize:12 }}>{idx+1}</td>
                  <td style={{ fontWeight:600 }}>{f.name}</td>
                  <td><span style={{ fontWeight:700, color:'var(--primary)' }}>#{f.rollNo}</span></td>
                  <td style={{ fontWeight:600 }}>{fmt(f.amount)}</td>
                  <td style={{ color:'var(--success)', fontWeight:600 }}>{fmt(f.paid)}</td>
                  <td style={{ color: f.due > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight:600 }}>{fmt(f.due)}</td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{f.lastPaid}</td>
                  <td>
                    <span className={`badge ${statusBadge[f.status]}`}>{statusIcon[f.status]} {f.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm">💳 Pay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
