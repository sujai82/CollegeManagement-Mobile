import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onOpenCommandPalette, onOpenAI }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Registrar / Admin';
      case 'FACULTY':
        return 'Faculty Member';
      case 'STUDENT':
        return 'Undergraduate Scholar';
      case 'DEPARTMENT_STAFF':
        return 'Department Staff';
      default:
        return 'User';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-[var(--primary)] text-white border-b border-purple-400/30 pt-[env(safe-area-inset-top,0px)] shadow-xs">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Show only Veritas University */}
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-bold text-white tracking-tight">Veritas University</span>
        </div>

        {/* Right: Search, Campus AI, Notifications & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search (>= 1024px): without Ctrl K hint */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="relative hidden lg:flex items-center w-56 pl-3 pr-2 py-1.5 bg-white/15 hover:bg-white/25 border border-white/25 rounded-xl text-xs text-white transition-all cursor-pointer shadow-2xs group min-h-[44px]"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-purple-200 group-hover:text-white text-[18px] transition-colors">
                search
              </span>
              <span className="text-xs text-purple-100 group-hover:text-white font-medium">Search & commands...</span>
            </div>
          </button>

          {/* Mobile / Tablet Search Icon (< 1024px) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search"
            className="lg:hidden p-2 rounded-lg text-purple-100 hover:bg-white/15 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Campus AI Button: Icon only below 1024px, without Ctrl+J hint */}
          <button
            type="button"
            onClick={onOpenAI}
            aria-label="Open Campus AI"
            className="relative inline-flex items-center justify-center gap-1.5 p-2 lg:px-3.5 lg:py-1.5 rounded-xl bg-white text-[var(--primary)] hover:bg-purple-50 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer border border-white/30 group min-h-[44px] min-w-[44px]"
          >
            <span className="material-symbols-outlined text-[19px]">auto_awesome</span>
            <span className="hidden lg:inline text-[var(--primary)] group-hover:text-purple-900 transition-colors">
              Campus AI
            </span>
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => navigate('/notices')}
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-purple-100 hover:bg-white/15 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="View recent notices"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[var(--primary)]"></span>
          </button>

          {/* User Profile Block: Only avatar below 1024px */}
          <div className="flex items-center gap-2 sm:gap-3 border-l border-white/20 pl-3">
            <div className="w-8 h-8 rounded-full bg-white text-[var(--primary)] flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
              {user?.email?.[0] || 'U'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                {user?.email}
              </span>
              <div className="mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white border border-white/25">
                  {getRoleDisplayName(user?.role)}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 text-purple-200 hover:text-white hover:bg-white/15 rounded transition-colors ml-0.5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
