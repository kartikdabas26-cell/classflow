import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendanceManagement() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [status, setStatus] = useState('Present');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/attendance');
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!name || !rollNumber) {
      alert("Please provide student name and roll number.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/attendance', { 
        name, 
        rollNumber, 
        status 
      });
      
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      } else {
        fetchAttendance();
      }

      setName('');
      setRollNumber('');
      setStatus('Present');
      alert("Student added to roster successfully!");
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student. Make sure your backend server is running on port 5001.");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/attendance/${id}`);
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error("Error toggling attendance:", err);
      alert("Failed to update status.");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to remove this student from the roster?")) return;
    try {
      const response = await axios.delete(`http://localhost:5001/api/attendance/${id}`);
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to remove student.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Student Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Add Student to Roster</h2>
        <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Student Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Priya Singh" 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Roll Number</label>
            <input 
              type="text" 
              value={rollNumber} 
              onChange={(e) => setRollNumber(e.target.value)} 
              placeholder="e.g. CS-2026-03" 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Initial Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            Add Student
          </button>
        </form>
      </div>

      {/* Attendance Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Class Attendance Management</h2>
        <p className="text-xs text-slate-500 mb-6">Mark, toggle, and review daily attendance records.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-3 font-semibold">Student Name</th>
                <th className="p-3 font-semibold">Roll Number</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-800">{student.name}</td>
                  <td className="p-3 text-slate-500">{student.rollNumber}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      student.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-3">
                    <button 
                      type="button"
                      onClick={() => toggleStatus(student.id)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                    >
                      Toggle Status
                    </button>
                    <button 
                      type="button"
                      onClick={() => deleteStudent(student.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;