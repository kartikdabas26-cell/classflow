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

  useEffect(() => {
    axios.get('http://localhost:5001/api/student')
      .then(response => setApiStudent(response.data))
      .catch(err => console.log('Using local fallback for student data', err));

    axios.get('http://localhost:5001/api/teacher')
      .then(response => setApiTeacher(response.data))
      .catch(err => console.log('Using local fallback for teacher data', err));
  }, []);

  const activeStudent = apiStudent || currentStudent;
  const activeTeacher = apiTeacher || currentTeacher;
  const currentUser = currentRole === 'student' ? activeStudent : activeTeacher;

  const handleLogin = (role, email) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      <Sidebar 
        currentRole={currentRole} 
        setCurrentRole={setCurrentRole} 
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
    </div>
  );
}

export default App;