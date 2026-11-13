import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const role = user?.role;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'grid_view',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
    {
      label: 'Students',
      path: '/students',
      icon: 'school',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY'],
    },
    {
      label: 'Faculty',
      path: '/faculty',
      icon: 'co_present',
      roles: ['ADMIN', 'DEPARTMENT_STAFF'],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: 'fact_check',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
    {
      label: 'Departments',
      path: '/departments',
      icon: 'domain',
      roles: ['ADMIN', 'DEPARTMENT_STAFF'],
    },
    {
      label: 'Enroll',
      path: '/enrollments',
      icon: 'how_to_reg',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
    {
      label: 'Courses',
      path: '/courses',
      icon: 'menu_book',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
    {
      label: 'Notices',
      path: '/notices',
      icon: 'campaign',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: 'badge',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
  ];

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'ADMIN':
        return 'Registrar rail';
      case 'FACULTY':
        return 'Faculty portal';
      case 'STUDENT':
        return 'Student SIS';
      case 'DEPARTMENT_STAFF':
        return 'Dept registry';
      default:
        return 'Campus portal';
    }
  };

  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col justify-between shrink-0 min-h-screen z-30 select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-[19px]">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[var(--main-text)] truncate tracking-tight">Veritas CMS</span>
              <span className="text-[11px] font-medium text-[var(--secondary-text)] truncate">
                {getRoleBadge(role)}
              </span>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[var(--secondary-text)] hover:bg-[#EDE9FE] hover:text-[var(--primary)] lg:hidden"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Navigation List - Without Group Headings */}
        <div className="p-3 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                    isActive
                      ? 'bg-[#EDE9FE] text-[var(--primary)] font-bold shadow-2xs'
                      : 'text-[var(--secondary-text)] hover:bg-[#F5F3FF] hover:text-[var(--main-text)] font-medium'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[19px]">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="px-3 py-2 rounded-xl bg-[#F5F3FF] border border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-mono text-[10px] text-[var(--main-text)] font-semibold">Neon DB live</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--secondary-text)]">v4.18</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
