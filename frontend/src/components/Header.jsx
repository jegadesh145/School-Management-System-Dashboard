import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/teachers': 'Teachers',
  '/library': 'Library',
  '/attendance': 'Attendance',
  '/accounts': 'Accounts',
  '/notice': 'Notice Board',
  '/class': 'Class',
  '/subject': 'Subject',
  '/routine': 'Routine',
  '/exam': 'Exam',
  '/transport': 'Transport',
  '/hostel': 'Hostel',
};

export default function Header({ setSidebarOpen }) {
  const location = useLocation();
  const [search, setSearch] = useState('');

  const title = pageTitles[location.pathname] || 'Page';

  return (
    <header className="header">

      {/* LEFT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        {/* Page Title */}
        <h2 style={{ margin: 0 }}>{title}</h2>

        {/* Search Box */}
        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">

        {/* Notifications */}
        <button className="header-icon-btn" title="Notifications">
          🔔
          <span className="notif-dot"></span>
        </button>

        {/* Messages */}
        <button className="header-icon-btn" title="Messages">
          💬
        </button>

        {/* Profile */}
        <div className="header-profile">
          <div className="avatar">A</div>

          <div className="profile-info">
            <div className="profile-name">Admin User</div>
            <div className="profile-role">Super Admin</div>
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            ▾
          </span>
        </div>

      </div>

    </header>
  );
}