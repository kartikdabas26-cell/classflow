import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalAnnouncements: 0,
    totalStudents: 0,
    attendanceRate: 0,
    activeClasses: 0
  });

  const [teacherInfo, setTeacherInfo] = useState({});

  useEffect(() => {
    fetchTeacherData();
    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Live sync every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTeacherData = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/teacher');
      setTeacherInfo(res.data);
    } catch (err) {
      console.error("Error fetching teacher profile:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-md">
        <h1 className="text-2xl font-bold">Welcome back, {teacherInfo.name || "Professor"}!</h1>
        <p className="text-blue-100 text-sm mt-1">{teacherInfo.department} • {teacherInfo.designation}</p>
      </div>

      {/* Live Synchronized Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalStudents}</h3>
          <p className="text-xs text-blue-600 font-medium mt-1">Live from attendance roster</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.attendanceRate}%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Real-time class average</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Assignments</span>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalAssignments}</h3>
          <p className="text-xs text-indigo-600 font-medium mt-1">Synced with student view</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Announcements</span>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalAnnouncements}</h3>
          <p className="text-xs text-purple-600 font-medium mt-1">Broadcasted globally</p>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;