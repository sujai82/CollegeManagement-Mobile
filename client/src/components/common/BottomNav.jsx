import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const BottomNav = () => {
  const { user } = useAuth();
  const role = user?.role;

  // Reusing existing routes and role filtering schema from Sidebar
  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'grid_view',
      roles: ['ADMIN', 'DEPARTMENT_STAFF', 'FACULTY', 'STUDENT'],
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: 'fact_check',
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

  // Role filtering identical to Sidebar logic
  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)] lg:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_10px_rgba(124,58,237,0.06)] select-none"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-1 transition-all group ${
                isActive
                  ? 'text-[var(--primary)] font-bold'
                  : 'text-[var(--secondary-text)] hover:text-[var(--main-text)] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-10 h-7 flex items-center justify-center rounded-full transition-all ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'text-[var(--secondary-text)] group-hover:text-[var(--main-text)]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[21px] leading-none ${isActive ? 'animate-icon-pop' : ''}`}>
                    {item.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] tracking-tight truncate max-w-full leading-tight mt-0.5 ${
                    isActive ? 'font-bold text-[var(--primary)]' : 'font-medium text-[var(--secondary-text)]'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

