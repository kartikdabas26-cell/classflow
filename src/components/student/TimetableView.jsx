import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Timetableview() {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetchTimetable();
    const interval = setInterval(fetchTimetable, 3000); // Live sync polling
    return () => clearInterval(interval);
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/timetable');
      setTimetable(res.data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Class Schedule</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time updates synced directly from your professor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timetable.map(item => (
          <div key={item.id} className={`p-4 rounded-lg border ${
            item.status === 'Cancelled' ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-blue-600 uppercase">{item.day} • {item.time}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                item.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {item.status || 'Active'}
              </span>
            </div>
            <h4 className="text-base font-semibold text-slate-800 mt-2">{item.subject}</h4>
            <p className="text-xs text-slate-500 mt-1">Venue: {item.room}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timetableview;