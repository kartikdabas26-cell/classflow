import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, BookOpen, Award, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

function StudentDashboard({ studentData }) {
  const [stats, setStats] = useState({ totalAssignments: 0, attendanceRate: 88, studentGpa: studentData?.gpa || 8.8 });

  useEffect(() => {
    axios.get('http://localhost:5001/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.log('Stats fetch error', err));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-2xl shadow-blue-900/50 border border-blue-500/20">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100 border border-white/20">
              <Sparkles size={14} className="text-yellow-300 animate-pulse" />
              <span>AI Academic Engine Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {studentData?.name || 'Student'}!
            </h1>
            <p className="text-blue-100 text-sm max-w-xl font-medium">
              {studentData?.department} • {studentData?.semester}
            </p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl flex items-center space-x-4 shadow-inner">
            <div>
              <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Current CGPA</p>
              <p className="text-2xl font-black text-white">{stats.studentGpa}</p>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Attendance</p>
              <p className="text-2xl font-black text-emerald-400">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-4 transition-all hover:border-slate-700 hover:-translate-y-1">
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tasks</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{stats.totalAssignments}</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={12} /> Syncing live
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-4 transition-all hover:border-slate-700 hover:-translate-y-1">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{stats.attendanceRate}%</h3>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
              Safe threshold (&gt;75%)
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-4 transition-all hover:border-slate-700 hover:-translate-y-1">
          <div className="p-3.5 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Standing</p>
            <h3 className="text-2xl font-black text-white mt-0.5">Distinction</h3>
            <span className="text-[11px] text-violet-400 font-semibold flex items-center gap-0.5 mt-1">
              Top 10% batch rank
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center space-x-4 transition-all hover:border-slate-700 hover:-translate-y-1">
          <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semester Status</p>
            <h3 className="text-2xl font-black text-white mt-0.5">On Track</h3>
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-0.5 mt-1">
              Exams approaching
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;