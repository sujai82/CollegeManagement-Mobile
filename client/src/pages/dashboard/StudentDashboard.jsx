import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import StudentCheckInWidget from '../../components/attendance/StudentCheckInWidget';
import useCountUp from '../../hooks/useCountUp';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const rawAttendance = data?.overallAttendance ?? 89.5;
  const animatedAttendance = useCountUp(rawAttendance, 450, !loading);

  const getFirstName = () => {
    if (user?.firstName) return user.firstName;
    if (data?.firstName) return data.firstName;
    if (user?.name) return user.name.split(' ')[0];
    if (user?.email) {
      const handle = user.email.split('@')[0];
      const namePart = handle.replace(/^(student|faculty|admin)\./i, '').split(/[._-]/)[0];
      if (namePart) return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'Alex';
  };

  const firstName = getFirstName();
  const deptCode = data?.departmentCode || (data?.admissionNumber ? data.admissionNumber.split('-')[2] : 'CSE') || 'CSE';
  const semNumber = String(data?.currentSemester || '3').replace(/[^0-9]/g, '') || '3';

  const fetchStudentData = useCallback(async () => {
    try {
      const res = await axiosClient.get('/dashboard/student');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Fallback student metrics:', err.message);
      setData({
        admissionNumber: 'CMP-2025-CSE-0001',
        department: 'Computer Science and Engineering',
        currentSemester: 'Semester 3',
        overallAttendance: 89.5,
        enrolledCoursesCount: 4,
        subjectAttendance: [
          { code: 'CS301', title: 'Database Management Systems', present: 22, onDuty: 2, total: 26, percent: 92.3 },
          { code: 'CS302', title: 'Operating Systems Concepts', present: 20, onDuty: 1, total: 24, percent: 87.5 },
          { code: 'CS303', title: 'Theory of Computation', present: 18, onDuty: 0, total: 20, percent: 90.0 },
          { code: 'MA301', title: 'Discrete Mathematics', present: 19, onDuty: 2, total: 25, percent: 84.0 },
        ],
        recentNotices: [
          { id: 1, title: 'CSE Department Annual Hackathon 2025', date: 'Oct 30', priority: 'NORMAL' },
          { id: 2, title: 'Mid-Semester Examination Schedule', date: 'Oct 28', priority: 'HIGH' },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="md" text="Loading student academic records..." />
      </div>
    );
  }

  const isLowAttendance = (data?.overallAttendance || 0) < 75;

  return (
    <div className="space-y-5">
      {/* Hero Card */}
      <div className="card-stitch p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="badge-mono text-xs font-bold">
              {data?.admissionNumber || 'CMP-2025-CSE-0001'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">Hi, {firstName}</h1>
          <p className="text-xs text-[var(--secondary-text)] mt-0.5">
            {deptCode} · Semester {semNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/attendance" className="btn-stitch-primary">
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span>Attendance</span>
          </Link>
        </div>
      </div>

      {/* Live Lecture Session PIN Check-In Widget */}
      <StudentCheckInWidget onCheckInSuccess={fetchStudentData} />

      {/* Attendance Deficiency Alert if < 75% */}
      {isLowAttendance && (
        <div className="p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-2xl text-xs text-[#9f1239] flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-[#ba1a1a]">warning</span>
          <div>
            <span className="font-bold block">Attendance Deficiency Notice (&lt; 75%)</span>
            <span>
              Your recorded attendance is below the mandatory institutional requirement of 75%. Please consult your course instructor or submit approved On-Duty records.
            </span>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          index={0}
          title="Attendance"
          value={`${animatedAttendance}%`}
          icon="verified"
          trend="Min 75%"
          progress={data?.overallAttendance || 89.5}
          progressColor={isLowAttendance ? 'bg-[#ba1a1a]' : 'bg-emerald-600'}
        />
        <StatCard
          index={1}
          title="Courses"
          value={data?.enrolledCoursesCount || 4}
          icon="menu_book"
          trend="15 credits"
          progress={100}
          progressColor="bg-[var(--primary)]"
        />
        <StatCard
          index={2}
          title="GPA"
          value="3.85"
          icon="military_tech"
          progress={96.2}
          progressColor="bg-emerald-600"
        />
      </div>

      {/* 4. Subject Attendance Breakdown Table */}
      <div className="card-stitch overflow-hidden bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--primary)] text-[18px]">fact_check</span>
            <h2 className="text-sm font-bold text-[var(--main-text)]">Subject-Wise Attendance Breakdown</h2>
          </div>
          <span className="badge-mono text-[10px]">Min requirement: 75%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EDE9FE] border-b border-[var(--border)] text-xs font-semibold text-[var(--main-text)]">
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3">Lectures Attended</th>
                <th className="py-2.5 px-3">On-Duty Credits</th>
                <th className="py-2.5 px-3">Total Held</th>
                <th className="py-2.5 px-3">Compliance Rate</th>
                <th className="py-2.5 px-3 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {(data?.subjectAttendance || []).map((subject) => {
                const isSubjectLow = subject.percent < 75;
                return (
                  <tr key={subject.code} className="hover:bg-[#F5F3FF] transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="badge-mono">{subject.code}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[var(--main-text)]">{subject.title}</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">{subject.present}</td>
                    <td className="py-2.5 px-3 text-[var(--primary)] font-semibold">{subject.onDuty}</td>
                    <td className="py-2.5 px-3 text-[var(--secondary-text)]">{subject.total}</td>
                    <td className="py-2.5 px-3">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] mb-1 font-mono font-bold">
                          <span className={isSubjectLow ? 'text-[#9f1239]' : 'text-emerald-700'}>
                            {subject.percent}%
                          </span>
                        </div>
                        <div className="w-full bg-[#EDE9FE] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full origin-left animate-scale-x ${isSubjectLow ? 'bg-[#ba1a1a]' : 'bg-emerald-600'}`}
                            style={{ width: `${subject.percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isSubjectLow ? (
                        <span className="badge-rose">Deficient</span>
                      ) : (
                        <span className="badge-emerald">Compliant</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
