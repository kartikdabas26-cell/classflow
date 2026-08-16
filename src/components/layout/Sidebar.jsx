import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  Bell, 
  User, 
  LogOut 
} from 'lucide-react';

function Sidebar({ currentRole, setCurrentRole, activeTab, setActiveTab, onLogout }) {
  
  // Define navigation links based on user role
  const getNavItems = () => {
    if (currentRole === 'teacher') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'mark-attendance', label: 'Mark Attendance', icon: CheckSquare },
        { id: 'timetable', label: 'Manage Timetable', icon: Calendar }, // <-- Timetable Tab added here
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'announcements', label: 'Announcements', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance', icon: CheckSquare },
        { id: 'timetable', label: 'Timetable', icon: Calendar },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        { id: 'announcements', label: 'Announcements', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Calendar size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">ClassFlow</h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-medium">AI Platform</span>
        </div>
      </div>

      {/* Role Switcher Section */}
      <div className="p-4 border-b border-slate-800">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Switch View Mode</p>
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setCurrentRole('student');
              setActiveTab('dashboard');
            }}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              currentRole === 'student' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => {
              setCurrentRole('teacher');
              setActiveTab('dashboard');
            }}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              currentRole === 'teacher' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Teacher
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id || (item.id === 'timetable' && activeTab === 'manage-timetable');
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Footer Option */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;