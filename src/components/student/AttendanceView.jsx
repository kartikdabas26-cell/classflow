import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentAttendanceView() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetchStudentPortalData();
    const interval = setInterval(fetchStudentPortalData, 3000); // Live sync polling
    return () => clearInterval(interval);
  }, []);

  const fetchStudentPortalData = async () => {
    try {
      const attendanceRes = await axios.get('http://localhost:5001/api/attendance');
      const timetableRes = await axios.get('http://localhost:5001/api/timetable');
      setAttendanceRecords(attendanceRes.data);
      setTimetable(timetableRes.data);
    } catch (err) {
      console.error("Error fetching student portal data:", err);
    }
  };

  const presentCount = attendanceRecords.filter(s => s.status === "Present").length;
  const overallPercentage = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Attendance Summary Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Attendance Overview</h2>
          <p className="text-xs text-slate-500 mt-1">Live updates synced directly from the teacher's roster.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-blue-600">{overallPercentage}%</span>
          <p className="text-xs font-semibold text-slate-400 uppercase">Overall Rate</p>
        </div>
      </div>

      {/* Attendance Roster Table view for Students */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Class Roster & Status Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-3 font-semibold">Student Name</th>
                <th className="p-3 font-semibold">Roll Number</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-800">{record.name}</td>
                  <td className="p-3 text-slate-500">{record.rollNumber}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      record.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Class Schedule View */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Live Class Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timetable.map((slot) => (
            <div key={slot.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-blue-600 uppercase">{slot.day} • {slot.time}</span>
              <h4 className="text-base font-semibold text-slate-800 mt-1">{slot.subject}</h4>
              <p className="text-xs text-slate-500 mt-1">Venue: {slot.room}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentAttendanceView;