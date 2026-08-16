import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TimetableManagement() {
  const [timetable, setTimetable] = useState([]);
  const [day, setDay] = useState('Monday');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/timetable');
      setTimetable(res.data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!time || !subject || !room) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5001/api/timetable', { 
        day, 
        time, 
        subject, 
        room, 
        status: 'Active' 
      });
      setTimetable(res.data.data);
      setTime('');
      setSubject('');
      setRoom('');
      alert("Timetable slot added successfully!");
    } catch (err) {
      console.error("Error adding timetable slot:", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/timetable/${id}/status`);
      setTimetable(res.data.data);
    } catch (err) {
      console.error("Error updating slot status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this slot?")) return;
    try {
      const res = await axios.delete(`http://localhost:5001/api/timetable/${id}`);
      setTimetable(res.data.data);
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Manage Class Timetable & Status</h2>
        <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Day</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Time Slot</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 AM - 11:30 AM" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Algorithms" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Room / Venue</label>
            <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Lab 3" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Add Slot</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Active Schedule Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-3 font-semibold">Day</th>
                <th className="p-3 font-semibold">Time</th>
                <th className="p-3 font-semibold">Subject</th>
                <th className="p-3 font-semibold">Room</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {timetable.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800">{item.day}</td>
                  <td className="p-3 text-slate-600">{item.time}</td>
                  <td className="p-3 text-blue-600 font-medium">{item.subject}</td>
                  <td className="p-3 text-slate-500">{item.room}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      item.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => toggleStatus(item.id)} className="text-amber-600 hover:text-amber-800 text-xs font-semibold">Toggle Cancelled</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-xs font-semibold">Remove</button>
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

export default TimetableManagement;