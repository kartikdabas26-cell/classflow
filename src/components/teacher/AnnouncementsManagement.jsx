import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in both title and content.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5001/api/announcements', { title, content });
      setAnnouncements(res.data.data);
      setTitle('');
      setContent('');
      alert("Announcement broadcasted successfully!");
    } catch (err) {
      console.error("Error posting announcement:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this announcement?")) return;
    try {
      const res = await axios.delete(`http://localhost:5001/api/announcements/${id}`);
      setAnnouncements(res.data.data);
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Broadcast Announcement</h2>
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Schedule Change" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type your announcement details here..." className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50 h-24" />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Broadcast Now</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Active Broadcasts</h3>
        <div className="space-y-3">
          {announcements.map(item => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{item.content}</p>
                <span className="text-[10px] text-indigo-600 font-medium mt-2 block">Date: {item.date}</span>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 text-xs font-semibold hover:text-red-800">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsManagement;