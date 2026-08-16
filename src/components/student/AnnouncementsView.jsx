import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Calendar } from 'lucide-react';

function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/announcements')
      .then(response => {
        setAnnouncements(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching announcements:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Campus & Class Announcements</h2>
        <p className="text-sm text-slate-500">Important notices broadcasted by faculty members.</p>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500 text-center">
            No announcements broadcasted yet.
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={13} /> {item.date}
                </span>
              </div>
              <p className="text-sm text-slate-600">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AnnouncementsView;