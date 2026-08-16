import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Search, Sparkles } from 'lucide-react';

function Header({ user, role, activeTab }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch announcements & assignments to populate live notification items
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5001/api/announcements').catch(() => ({ data: [] })),
      axios.get('http://localhost:5001/api/assignments').catch(() => ({ data: [] }))
    ]).then(([annRes, assignRes]) => {
      const combined = [
        ...annRes.data.map(a => ({ id: `ann-${a.id}`, title: a.title, time: a.date, type: 'Announcement' })),
        ...assignRes.data.map(as => ({ id: `as-${as.id}`, title: `New Assignment: ${as.title}`, time: `Due: ${as.dueDate}`, type: 'Assignment' }))
      ];
      setNotifications(combined.slice(0, 5)); // Keep latest 5
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title & Context */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Welcome back, {user?.name || 'User'} ({role})
        </p>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center space-x-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search subjects, assignments..." 
            className="w-64 pl-9 pr-4 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Notification Bell Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Popup Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{notifications.length} New</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-50/80 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{n.type}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 line-clamp-1">{n.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;