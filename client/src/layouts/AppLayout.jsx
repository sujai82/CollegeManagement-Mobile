import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CommandPalette from '../components/common/CommandPalette';
import CampusAICopilot from '../components/ai/CampusAICopilot';

export const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K for Spotlight, Ctrl+J for Campus AI)
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setAiOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--page-background)]">
        <LoadingSpinner size="lg" text="Verifying institutional credential tokens..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--page-background)] text-[var(--main-text)]">
      {/* Desktop Permanent Sidebar - hidden on small screens below 1024px (lg) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenAI={() => setAiOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8 overflow-y-auto">
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Fixed Bottom Navigation Bar for Mobile (below 1024px) */}
      <BottomNav />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenAI={() => setAiOpen(true)}
      />

      {/* Global Campus AI Copilot (Ctrl+J) */}
      <CampusAICopilot
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
