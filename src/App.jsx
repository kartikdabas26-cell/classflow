import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LoginView from './components/auth/LoginView';
import StudentDashboard from './components/dashboard/StudentDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import AttendanceView from './components/student/AttendanceView';
import TimetableView from './components/student/TimetableView';
import AssignmentsView from './components/student/AssignmentsView';
import AnnouncementsView from './components/student/AnnouncementsView';
import ProfileView from './components/student/ProfileView';
import AttendanceManagement from './components/teacher/AttendanceManagement';
import AssignmentsManagement from './components/teacher/AssignmentsManagement';
import AnnouncementsManagement from './components/teacher/AnnouncementsManagement';
import TimetableManagement from './components/teacher/TimetableManagement';
import TeacherProfile from './components/teacher/TeacherProfile';
import { currentStudent, currentTeacher } from './data/mockData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState('student');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiStudent, setApiStudent] = useState(null);
  const [apiTeacher, setApiTeacher] = useState(null);

  // States for Teacher Passcode Modal Protection
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacherPasscode, setTeacherPasscode] = useState('');

  useEffect(() => {
    // Only attempt local backend calls if not failing or handle gracefully
    axios.get('http://localhost:5001/api/student')
      .then(response => setApiStudent(response.data))
      .catch(err => console.log('Using local fallback for student data'));

    axios.get('http://localhost:5001/api/teacher')
      .then(response => setApiTeacher(response.data))
      .catch(err => console.log('Using local fallback for teacher data'));
  }, []);

  const activeStudent = apiStudent || currentStudent;
  const activeTeacher = apiTeacher || currentTeacher;
  const currentUser = currentRole === 'student' ? activeStudent : activeTeacher;

  const handleLogin = (role, email) => {
    // Strict Gmail / Email Format Verification
    if (email && (!email.includes('@') || !email.includes('.'))) {
      alert("Please enter a valid email address (e.g., name@gmail.com).");
      return;
    }

    // If trying to log straight into teacher view from login page, ask for passcode
    if (role === 'teacher') {
      setShowTeacherModal(true);
      return;
    }

    setCurrentRole('student');
    setIsLoggedIn(true);
  };

  const handleRoleSwitch = (newRole) => {
    if (newRole === 'teacher') {
      // Prompt password modal before letting user switch to teacher side
      setShowTeacherModal(true);
    } else {
      setCurrentRole('student');
      setActiveTab('dashboard');
    }
  };

  const verifyTeacherPasscode = () => {
    // Change this secret passcode to whatever you prefer
    if (teacherPasscode === "teacher123") {
      setCurrentRole('teacher');
      setIsLoggedIn(true);
      setShowTeacherModal(false);
      setTeacherPasscode('');
      setActiveTab('dashboard');
    } else {
      alert("Incorrect Teacher Passcode! Access Denied.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentRole('student');
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginView onLogin={handleLogin} />

        {/* Teacher Security Passcode Modal */}
        {showTeacherModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl w-80 space-y-4 text-slate-100">
              <h3 className="text-lg font-bold">Teacher Access Required</h3>
              <p className="text-xs text-slate-400">Enter the teacher security passcode to proceed.</p>
              
              <input 
                type="password"
                placeholder="Passcode (e.g. teacher123)"
                value={teacherPasscode}
                onChange={(e) => setTeacherPasscode(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg outline-none focus:border-blue-500 text-sm"
              />

              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowTeacherModal(false)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={verifyTeacherPasscode}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      <Sidebar 
        currentRole={currentRole} 
        setCurrentRole={handleRoleSwitch} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        <Header user={currentUser} role={currentRole} activeTab={activeTab} />
        
        <main className="p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && currentRole === 'student' && (
            <StudentDashboard studentData={activeStudent} />
          )}

          {activeTab === 'dashboard' && currentRole === 'teacher' && (
            <TeacherDashboard teacherData={activeTeacher} />
          )}

          {(activeTab === 'attendance' || activeTab === 'mark-attendance') && currentRole === 'student' && (
            <AttendanceView studentData={activeStudent} />
          )}

          {(activeTab === 'attendance' || activeTab === 'mark-attendance') && currentRole === 'teacher' && (
            <AttendanceManagement />
          )}

          {activeTab === 'timetable' && currentRole === 'student' && (
            <TimetableView />
          )}

          {(activeTab === 'timetable' || activeTab === 'manage-timetable') && currentRole === 'teacher' && (
            <TimetableManagement />
          )}

          {(activeTab === 'assignments' || activeTab === 'manage-assignments') && currentRole === 'student' && (
            <AssignmentsView studentData={activeStudent} />
          )}

          {(activeTab === 'assignments' || activeTab === 'manage-assignments') && currentRole === 'teacher' && (
            <AssignmentsManagement />
          )}

          {(activeTab === 'announcements' || activeTab === 'manage-announcements') && currentRole === 'student' && (
            <AnnouncementsView />
          )}

          {(activeTab === 'announcements' || activeTab === 'manage-announcements') && currentRole === 'teacher' && (
            <AnnouncementsManagement />
          )}

          {activeTab === 'profile' && currentRole === 'student' && (
            <ProfileView studentData={activeStudent} setApiStudent={setApiStudent} />
          )}

          {activeTab === 'profile' && currentRole === 'teacher' && (
            <TeacherProfile teacherData={activeTeacher} setApiTeacher={setApiTeacher} />
          )}
        </main>
      </div>

      {/* Teacher Security Modal Overlay during active session */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl w-80 space-y-4 text-slate-100">
            <h3 className="text-lg font-bold">Teacher Access Required</h3>
            <p className="text-xs text-slate-400">Enter the teacher security passcode to switch perspectives.</p>
            
            <input 
              type="password"
              placeholder="Passcode (e.g. teacher123)"
              value={teacherPasscode}
              onChange={(e) => setTeacherPasscode(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg outline-none focus:border-blue-500 text-sm"
            />

            <div className="flex space-x-2">
              <button 
                onClick={() => setShowTeacherModal(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={verifyTeacherPasscode}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
