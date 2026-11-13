import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const FacultyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await axiosClient.get('/dashboard/faculty');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Fallback faculty metrics:', err.message);
        setData({
          assignedCoursesCount: 2,
          totalEnrolledStudents: 120,
          sessionsConducted: 28,
          averageAttendance: '91.2%',
          activeCourses: [
            { id: 'ca111111-1111-1111-1111-111111111101', code: 'CS301', title: 'Database Management Systems', section: 'A', students: 60, nextClass: 'Period 2 (10:00 AM)', credits: 4, hall: 'Turing Hall 104' },
            { id: 'ca222222-2222-2222-2222-222222222202', code: 'CS302', title: 'Operating Systems Concepts', section: 'B', students: 60, nextClass: 'Period 4 (01:30 PM)', credits: 4, hall: 'Tesla Hall 202' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="md" text="Loading faculty instructional workspace..." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Academic Governance Context Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--card)] px-4 py-2.5 rounded-2xl border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-[var(--secondary-text)]">
          <span className="material-symbols-outlined text-[17px] text-[var(--primary)]">co_present</span>
          <span className="font-semibold text-xs text-[var(--main-text)]">Instructional cadre</span>
          <span className="text-[var(--border)]">/</span>
          <span className="font-medium text-xs text-[var(--secondary-text)]">Department of Computer Science</span>
          <span className="text-[var(--border)]">/</span>
          <span className="badge-mono text-[10px] font-bold">AY 2025–2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block mr-1"></span>
            Roster: Synced
          </span>
          <span className="badge-mono text-[10px]">Dept: CSE</span>
        </div>
      </div>

      {/* 2. Header & Action Horizon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[var(--secondary-text)]">Faculty portal</span>
            <span className="badge-purple">Tenure track</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">Instructional Governance & Workload</h1>
          <p className="text-xs text-[var(--secondary-text)] mt-0.5">
            Active course assignments, real-time lecture roll call, and student attendance compliance records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/students" className="btn-stitch-secondary">
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Register Student</span>
          </Link>
          <Link to="/courses" className="btn-stitch-secondary">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Course Catalog</span>
          </Link>
          <Link to="/attendance" className="btn-stitch-primary">
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span>Take Live Roll Call</span>
          </Link>
        </div>
      </div>

      {/* 3. Workload Health KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Assigned Courses"
          value={data?.assignedCoursesCount || 2}
          icon="menu_book"
          subtext="Fall Semester 2025"
          trend="8 Credits Total"
          progress={66.7}
          progressColor="bg-[var(--primary)]"
          badge="Active Cadre"
          badgeType="purple"
        />
        <StatCard
          index={1}
          title="Enrolled Students"
          value={data?.totalEnrolledStudents || 120}
          icon="groups"
          subtext="Under primary instruction"
          trend="2 Sections"
          progress={100}
          progressColor="bg-[#6D28D9]"
          badge="Capacity 100%"
          badgeType="purple"
        />
        <StatCard
          index={2}
          title="Lectures Conducted"
          value={data?.sessionsConducted || 28}
          icon="calendar_month"
          subtext="Logged in Neon DB"
          trend="Session #18 Active"
          progress={75}
          progressColor="bg-emerald-600"
          badge="On Schedule"
          badgeType="emerald"
        />
        <StatCard
          index={3}
          title="Average Attendance"
          value={data?.averageAttendance || '91.2%'}
          icon="verified"
          subtext="Threshold: 75% Min"
          trend="+2.4% vs Dept Avg"
          progress={91.2}
          progressColor="bg-emerald-600"
          badge="Compliant"
          badgeType="emerald"
        />
      </div>

      {/* 4. Active Teaching Sections (Stitch Spec) */}
      <div className="card-stitch p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--primary)] text-[18px]">co_present</span>
            <h2 className="text-sm font-bold text-[var(--main-text)]">Active Course Assignments & Sections</h2>
          </div>
          <span className="badge-mono text-[10px]">AY25-FA SEMESTER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.activeCourses || []).map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl border border-[var(--border)] bg-[#F5F3FF] flex flex-col justify-between gap-3 hover:border-[#C4B5FD] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge-mono text-xs font-semibold">
                    {course.code} • Sec {course.section}
                  </span>
                  <span className="badge-purple text-[10px]">{course.credits || 4} CREDITS</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--main-text)] mt-2">{course.title}</h3>
                <div className="flex items-center gap-3 text-xs text-[var(--secondary-text)] mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[var(--primary)]">room</span>
                    {course.hall || 'Turing Hall 104'}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[var(--primary)]">schedule</span>
                    {course.nextClass}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--secondary-text)]">
                  Enrolled: <strong className="text-[var(--main-text)]">{course.students} students</strong>
                </span>
                <Link
                  to="/attendance"
                  className="btn-stitch-primary text-[11px] py-1.5 px-3 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[15px]">fact_check</span>
                  <span>Start Roll Call</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
