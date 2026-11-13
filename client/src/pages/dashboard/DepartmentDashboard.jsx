import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const DepartmentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeptStats = async () => {
      try {
        const res = await axiosClient.get('/dashboard/department');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Fallback department stats:', err.message);
        setData({
          departmentName: 'Computer Science and Engineering (CSE)',
          hodName: 'Dr. Robert Vance',
          studentCount: 380,
          facultyCount: 18,
          courseCount: 14,
          avgAttendance: '89.6%',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeptStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="md" text="Compiling departmental statistics..." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Academic Governance Context Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--card)] px-4 py-2.5 rounded-2xl border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-[var(--secondary-text)]">
          <span className="material-symbols-outlined text-[17px] text-[var(--primary)]">domain</span>
          <span className="font-semibold text-xs text-[var(--main-text)]">Departmental registry</span>
          <span className="text-[var(--border)]">/</span>
          <span className="font-medium text-xs text-[var(--secondary-text)]">{data?.departmentName}</span>
          <span className="text-[var(--border)]">/</span>
          <span className="badge-mono text-[10px] font-bold">AY 2025–2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1"></span>
            HOD registered
          </span>
          <span className="badge-mono text-[10px]">Status: Active</span>
        </div>
      </div>

      {/* 2. Header & Action Horizon */}
      <div className="card-stitch p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-mono text-xs font-bold">CSE division</span>
            <span className="badge-purple">HOD command</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">{data?.departmentName}</h1>
          <p className="text-xs text-[var(--secondary-text)] mt-0.5">
            Head of Department: <strong className="text-[var(--main-text)]">{data?.hodName}</strong> • Turing Academic Block
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/students" className="btn-stitch-secondary">
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Enrolled Students</span>
          </Link>
          <Link to="/faculty" className="btn-stitch-primary">
            <span className="material-symbols-outlined text-[16px]">co_present</span>
            <span>Faculty Cadre</span>
          </Link>
        </div>
      </div>

      {/* 3. KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Department Students"
          value={data?.studentCount || 380}
          icon="school"
          subtext="Undergraduate & Postgrad"
          trend="8 Cohorts"
          progress={95}
          progressColor="bg-[var(--primary)]"
          badge="Enrolled"
          badgeType="purple"
        />
        <StatCard
          index={1}
          title="Instructional Faculty"
          value={data?.facultyCount || 18}
          icon="groups"
          subtext="Professors & Lecturers"
          trend="100% Retained"
          progress={88}
          progressColor="bg-[#6D28D9]"
          badge="Active"
          badgeType="emerald"
        />
        <StatCard
          index={2}
          title="Course Offerings"
          value={data?.courseCount || 14}
          icon="menu_book"
          subtext="Current Curriculum"
          trend="52 Total Credits"
          progress={100}
          progressColor="bg-[var(--primary)]"
          badge="Accredited"
          badgeType="emerald"
        />
        <StatCard
          index={3}
          title="Attendance Average"
          value={data?.avgAttendance || '89.6%'}
          icon="verified"
          subtext="Department Compliance"
          trend="+1.8% vs College"
          progress={89.6}
          progressColor="bg-emerald-600"
          badge="Compliant"
          badgeType="emerald"
        />
      </div>
    </div>
  );
};

export default DepartmentDashboard;
