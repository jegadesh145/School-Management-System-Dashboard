import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard',  path: '/',           icon: '🏠', section: 'MAIN' },
  { label: 'Students',   path: '/students',   icon: '🎓', section: 'MAIN' },
  { label: 'Teachers',   path: '/teachers',   icon: '👨‍🏫', section: 'MAIN' },
  { label: 'Class',      path: '/class',      icon: '🏫', section: 'ACADEMIC' },
  { label: 'Subject',    path: '/subject',    icon: '📚', section: 'ACADEMIC' },
  { label: 'Routine',    path: '/routine',    icon: '📅', section: 'ACADEMIC' },
  { label: 'Attendance', path: '/attendance', icon: '✅', section: 'ACADEMIC' },
  { label: 'Exam',       path: '/exam',       icon: '📝', section: 'ACADEMIC' },
  { label: 'Library',    path: '/library',    icon: '📖', section: 'RESOURCES' },
  { label: 'Accounts',   path: '/accounts',   icon: '💰', section: 'RESOURCES' },
  { label: 'Transport',  path: '/transport',  icon: '🚌', section: 'RESOURCES' },
  { label: 'Hostel',     path: '/hostel',     icon: '🏨', section: 'RESOURCES' },
  { label: 'Notice',     path: '/notice',     icon: '📢', section: 'OTHERS', badge: '5' },
];

const sections = ['MAIN', 'ACADEMIC', 'RESOURCES', 'OTHERS'];

export default function Sidebar({ isOpen = false, setIsOpen = () => {} }) {

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <div>
            <div className="logo-text">SchoolMS</div>
            <div className="logo-sub">Management System</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {sections.map(section => {
            const items = navItems.filter(i => i.section === section);

            return (
              <div key={section}>
                <div className="nav-section-label">{section}</div>

                {items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div className="user-info">
            <div className="user-name">Admin User</div>
            <div className="user-role">Super Admin</div>
          </div>
        </div>

      </aside>
    </>
  );
}