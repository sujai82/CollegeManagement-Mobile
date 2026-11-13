import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = ({ forcedPortal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Detect portal from URL or prop
  const getInitialPortal = () => {
    if (forcedPortal) return forcedPortal;
    if (location.pathname.includes('/student')) return 'STUDENT';
    if (location.pathname.includes('/faculty')) return 'FACULTY';
    if (location.pathname.includes('/admin')) return 'ADMIN';
    return 'STUDENT'; // default friendly portal
  };

  const [activePortal, setActivePortal] = useState(getInitialPortal);
  const [email, setEmail] = useState('student.alex@college.edu');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);

  // Sync state when URL route changes
  useEffect(() => {
    const portal = getInitialPortal();
    setActivePortal(portal);
    if (portal === 'STUDENT') {
      setEmail('student.alex@college.edu');
    } else if (portal === 'FACULTY') {
      setEmail('faculty.alan@college.edu');
    } else {
      setEmail('admin@college.edu');
    }
    setPassword('Password@123');
    setError('');
    setIsNetworkError(false);
  }, [location.pathname]);

  const handlePortalChange = (portal) => {
    setActivePortal(portal);
    setError('');
    setIsNetworkError(false);
    if (portal === 'STUDENT') {
      navigate('/login/student');
    } else if (portal === 'FACULTY') {
      navigate('/login/faculty');
    } else {
      navigate('/login/admin');
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!email || !password) {
      setError('Please provide institutional credentials.');
      setIsNetworkError(false);
      return;
    }

    setLoading(true);
    setError('');
    setIsNetworkError(false);

    try {
      const res = await login(email, password);
      setLoading(false);

      if (res?.success) {
        setIsNetworkError(false);
        navigate('/dashboard');
      } else {
        const msg = res?.message || '';
        const isNetwork =
          !navigator.onLine ||
          Boolean(res?.isNetworkError) ||
          msg === 'Network Error' ||
          /network|waking|timeout|econnrefused|failed to fetch|load failed|connection/i.test(msg);

        if (isNetwork) {
          setIsNetworkError(true);
          setError('Server is waking up, please wait up to 60 seconds');
        } else {
          setIsNetworkError(false);
          setError(msg || 'Authentication rejected. Verify your institutional email and password.');
        }
      }
    } catch (err) {
      setLoading(false);
      const msg = err?.message || '';
      const isNetwork =
        !navigator.onLine ||
        err?.code === 'ERR_NETWORK' ||
        err?.code === 'ECONNREFUSED' ||
        msg === 'Network Error' ||
        /network|waking|timeout|econnrefused|failed to fetch|load failed|connection/i.test(msg);

      if (isNetwork) {
        setIsNetworkError(true);
        setError('Server is waking up, please wait up to 60 seconds');
      } else {
        setIsNetworkError(false);
        setError(msg || 'Authentication rejected. Verify your institutional email and password.');
      }
    }
  };

  const setDemoCredentials = (demoEmail, demoPass = 'Password@123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsNetworkError(false);
  };

  return (
    <div className="card-stitch p-6 sm:p-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs animate-slide-down">
      {/* Top Portal Switcher Tabs */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-[var(--secondary-text)] mb-2 flex items-center justify-between">
          <span>Select portal</span>
          <span className="font-mono text-[10px] text-[var(--secondary-text)]">Portal separation active</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F3FF] rounded-xl border border-[var(--border)]">
          <button
            type="button"
            onClick={() => handlePortalChange('STUDENT')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold tracking-tight transition-all min-h-[44px] cursor-pointer ${
              activePortal === 'STUDENT'
                ? 'bg-white text-[var(--primary)] shadow-xs border border-[var(--border)] font-bold'
                : 'text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span className="truncate">Student SIS</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalChange('FACULTY')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold tracking-tight transition-all min-h-[44px] cursor-pointer ${
              activePortal === 'FACULTY'
                ? 'bg-white text-[var(--primary)] shadow-xs border border-[var(--border)] font-bold'
                : 'text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">co_present</span>
            <span className="truncate">Faculty Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalChange('ADMIN')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold tracking-tight transition-all min-h-[44px] cursor-pointer ${
              activePortal === 'ADMIN'
                ? 'bg-white text-[var(--primary)] shadow-xs border border-[var(--border)] font-bold'
                : 'text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span className="truncate">Admin / Registrar</span>
          </button>
        </div>
      </div>

      {/* Header Context by Portal */}
      <div className="mb-6 pb-4 border-b border-[var(--border)]">
        {activePortal === 'STUDENT' && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge-purple">
                <span className="material-symbols-outlined text-[14px]">school</span>
                STUDENT SIS PORTAL
              </span>
              <span className="font-mono text-[11px] text-[var(--secondary-text)] font-semibold">SECURE ACCESS</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">Student Information System</h1>
            <p className="text-xs text-[var(--secondary-text)] mt-1">
              Sign in to view enrolled course rosters, real-time lecture attendance records, and academic standing.
            </p>
          </div>
        )}

        {activePortal === 'FACULTY' && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge-purple">
                <span className="material-symbols-outlined text-[14px]">co_present</span>
                FACULTY & INSTRUCTOR PORTAL
              </span>
              <span className="font-mono text-[11px] text-[var(--secondary-text)] font-semibold">ACADEMIC AFFAIRS</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">Faculty Workload & Roll Call</h1>
            <p className="text-xs text-[var(--secondary-text)] mt-1">
              Sign in to administer live roll call, manage instructional workload, and record student grades.
            </p>
          </div>
        )}

        {activePortal === 'ADMIN' && (
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge-purple">
                <span className="material-symbols-outlined text-[14px]">account_balance</span>
                REGISTRAR & EXECUTIVE PORTAL
              </span>
              <span className="font-mono text-[11px] text-[var(--secondary-text)] font-semibold">MASTER CONTROLS</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">Academic Governance Command</h1>
            <p className="text-xs text-[var(--secondary-text)] mt-1">
              Sign in to manage academic departments, student rosters, faculty appointments, and institutional audits.
            </p>
          </div>
        )}
      </div>

      {/* Network Error / Server Waking Up Banner with Retry button, or Standard Error */}
      {isNetworkError ? (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] shrink-0 text-amber-600 animate-spin mt-0.5">
              progress_activity
            </span>
            <div className="leading-relaxed">
              <span className="font-semibold block text-amber-950">Backend Connection</span>
              <span>Server is waking up, please wait up to 60 seconds</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLogin()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs shadow-xs transition-all min-h-[44px] cursor-pointer shrink-0 self-stretch sm:self-auto"
          >
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Connecting...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span>Retry</span>
              </span>
            )}
          </button>
        </div>
      ) : error ? (
        <div className="mb-5 p-3 rounded-xl bg-[#fff1f2] border border-[#fecdd3] text-[#9f1239] text-xs flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] shrink-0 text-[#9f1239]">error</span>
          <div className="leading-relaxed">
            <span className="font-semibold block">Authentication Unsuccessful</span>
            <span>{error}</span>
          </div>
        </div>
      ) : null}

      {/* Main Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--secondary-text)] mb-1.5">
            {activePortal === 'STUDENT'
              ? 'Student email / ID'
              : activePortal === 'FACULTY'
              ? 'Faculty email'
              : 'Administrative email'}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-text)] text-[18px]">
              mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@college.edu"
              required
              className="w-full pl-9 pr-3 py-2.5 min-h-[44px] bg-[var(--card)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--main-text)] placeholder-[var(--secondary-text)]/60 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[var(--secondary-text)]">
              Password
            </label>
            <span className="text-[11px] text-[var(--secondary-text)] hover:text-[var(--primary)] cursor-pointer font-medium">
              Forgot security key?
            </span>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-text)] text-[18px]">
              lock
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full pl-9 pr-3 py-2.5 min-h-[44px] bg-[var(--card)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--main-text)] placeholder-[var(--secondary-text)]/60 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-stitch-primary py-3 min-h-[44px] text-xs font-semibold justify-center mt-2 rounded-xl"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Authenticating Credentials...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span>Sign In to {activePortal === 'STUDENT' ? 'Student SIS' : activePortal === 'FACULTY' ? 'Faculty Portal' : 'Admin Hub'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          )}
        </button>
      </form>

      {/* Preset Fast Login Section */}
      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[var(--secondary-text)]">
            Demo credentials
          </span>
          <span className="font-mono text-[10px] text-[var(--secondary-text)]">Password: Password@123</span>
        </div>

        {activePortal === 'STUDENT' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('student.alex@college.edu')}
              className="text-left p-3 min-h-[44px] rounded-xl border border-[var(--border)] bg-[#F5F3FF] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] transition-all group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--main-text)]">Alex Mercer</span>
                <span className="badge-mono text-[10px]">Sem 3</span>
              </div>
              <p className="text-[11px] text-[var(--secondary-text)] truncate mt-0.5">student.alex@college.edu</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('student.priya@college.edu')}
              className="text-left p-3 min-h-[44px] rounded-xl border border-[var(--border)] bg-[#F5F3FF] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] transition-all group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--main-text)]">Priya Nair</span>
                <span className="badge-mono text-[10px]">Sem 3</span>
              </div>
              <p className="text-[11px] text-[var(--secondary-text)] truncate mt-0.5">student.priya@college.edu</p>
            </button>
          </div>
        )}

        {activePortal === 'FACULTY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('faculty.alan@college.edu')}
              className="text-left p-3 min-h-[44px] rounded-xl border border-[var(--border)] bg-[#F5F3FF] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] transition-all group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--main-text)]">Dr. Alan Turing</span>
                <span className="badge-mono text-[10px]">EMP-002</span>
              </div>
              <p className="text-[11px] text-[var(--secondary-text)] truncate mt-0.5">faculty.alan@college.edu</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('faculty.grace@college.edu')}
              className="text-left p-3 min-h-[44px] rounded-xl border border-[var(--border)] bg-[#F5F3FF] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] transition-all group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--main-text)]">Prof. Grace Hopper</span>
                <span className="badge-mono text-[10px]">EMP-003</span>
              </div>
              <p className="text-[11px] text-[var(--secondary-text)] truncate mt-0.5">faculty.grace@college.edu</p>
            </button>
          </div>
        )}

        {activePortal === 'ADMIN' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@college.edu')}
              className="text-left p-3 min-h-[44px] rounded-xl border border-[var(--border)] bg-[#F5F3FF] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] transition-all group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--main-text)]">System Admin</span>
                <span className="badge-mono text-[10px]">SUPER</span>
              </div>
              <p className="text-[11px] text-[var(--secondary-text)] truncate mt-0.5">admin@college.edu</p>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('hod.cse@college.edu')}
              className="text-left p-3 min-h-[44px] rounded-xl border border-[var(--border)] bg-[#F5F3FF] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] transition-all group flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--main-text)]">Dr. Robert Vance</span>
                <span className="badge-mono text-[10px]">HOD CSE</span>
              </div>
              <p className="text-[11px] text-[var(--secondary-text)] truncate mt-0.5">hod.cse@college.edu</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
