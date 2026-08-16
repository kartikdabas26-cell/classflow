const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Comprehensive In-Memory Database Store
let database = {
  student: {
    name: "Kartik Dabas",
    role: "student",
    studentId: "CSE2026042",
    department: "Computer Science & Engineering",
    semester: "4th Semester",
    gpa: 8.8,
    email: "kartik.dabas@classflow.edu"
  },
  teacher: {
    name: "Dr. Rakesh Sharma",
    role: "teacher",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    email: "rakesh.sharma@classflow.edu",
    activeClassesCount: 4
  },
  assignments: [
    { id: 101, title: "Data Structures Project", subject: "Computer Science", dueDate: "2026-09-01", description: "Implement a balanced BST in C++ with full documentation." },
    { id: 102, title: "Database Schema Design", subject: "DBMS", dueDate: "2026-09-05", description: "Design a fully normalized ER diagram for a university portal." }
  ],
  announcements: [
    { id: 201, title: "Mid-Term Examination Schedule", content: "Mid-term examinations will commence from next Monday.", date: "2026-08-16" },
    { id: 202, title: "Lab Rescheduling Notice", content: "Tomorrow's DBMS lab is rescheduled to Wednesday afternoon.", date: "2026-08-14" }
  ],
  attendance: [
    { id: 301, name: "Kartik Dabas", rollNumber: "CS-2026-01", status: "Present" },
    { id: 302, name: "Aarav Sharma", rollNumber: "CS-2026-02", status: "Absent" },
    { id: 303, name: "Priya Singh", rollNumber: "CS-2026-03", status: "Present" }
  ],
  timetable: [
    { id: 401, day: "Monday", time: "09:00 AM - 10:30 AM", subject: "Data Structures", room: "Lab 3", status: "Active" },
    { id: 402, day: "Tuesday", time: "11:00 AM - 12:30 PM", subject: "DBMS", room: "Hall 2", status: "Active" },
    { id: 403, day: "Wednesday", time: "02:00 PM - 03:30 PM", subject: "Operating Systems", room: "Room 402", status: "Active" }
  ]
};

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: "ClassFlow Advanced Backend is online and fully synced." });
});

// 2. Master Dashboard Statistics (Calculated dynamically for both Student & Teacher views)
app.get('/api/dashboard/stats', (req, res) => {
  const totalStudents = database.attendance.length;
  const presentCount = database.attendance.filter(s => s.status === "Present").length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  res.json({
    totalAssignments: database.assignments.length,
    totalAnnouncements: database.announcements.length,
    totalStudents: totalStudents,
    attendanceRate: attendanceRate,
    studentGpa: database.student.gpa,
    activeClasses: database.teacher.activeClassesCount,
    totalSchedules: database.timetable.length
  });
});

// 3. Student Profile Endpoints
app.get('/api/student', (req, res) => res.json(database.student));
app.put('/api/student', (req, res) => {
  database.student = { ...database.student, ...req.body };
  res.json({ success: true, message: "Student profile updated successfully.", data: database.student });
});

// 4. Teacher Profile Endpoints
app.get('/api/teacher', (req, res) => res.json(database.teacher));
app.put('/api/teacher', (req, res) => {
  database.teacher = { ...database.teacher, ...req.body };
  res.json({ success: true, message: "Teacher profile updated successfully.", data: database.teacher });
});

// 5. Assignments CRUD Endpoints
app.get('/api/assignments', (req, res) => res.json(database.assignments));
app.post('/api/assignments', (req, res) => {
  const newAssignment = { id: Date.now(), ...req.body };
  database.assignments.unshift(newAssignment);
  res.json({ success: true, message: "Assignment posted globally.", data: database.assignments });
});
app.put('/api/assignments/:id', (req, res) => {
  database.assignments = database.assignments.map(item => item.id == req.params.id ? { ...item, ...req.body } : item);
  res.json({ success: true, message: "Assignment updated.", data: database.assignments });
});
app.delete('/api/assignments/:id', (req, res) => {
  database.assignments = database.assignments.filter(item => item.id != req.params.id);
  res.json({ success: true, message: "Assignment deleted.", data: database.assignments });
});

// 6. Announcements CRUD Endpoints
app.get('/api/announcements', (req, res) => res.json(database.announcements));
app.post('/api/announcements', (req, res) => {
  const newAnn = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...req.body };
  database.announcements.unshift(newAnn);
  res.json({ success: true, message: "Announcement broadcasted.", data: database.announcements });
});
app.delete('/api/announcements/:id', (req, res) => {
  database.announcements = database.announcements.filter(item => item.id != req.params.id);
  res.json({ success: true, message: "Announcement removed.", data: database.announcements });
});

// 7. Attendance Roster Endpoints (Directly drives student attendance tracking metrics)
app.get('/api/attendance', (req, res) => res.json(database.attendance));
app.post('/api/attendance', (req, res) => {
  const newRecord = { id: Date.now(), status: "Present", ...req.body };
  database.attendance.push(newRecord);
  res.json({ success: true, message: "Student added to roster.", data: database.attendance });
});
app.put('/api/attendance/:id', (req, res) => {
  database.attendance = database.attendance.map(s => s.id == req.params.id ? { ...s, status: s.status === "Present" ? "Absent" : "Present" } : s);
  res.json({ success: true, message: "Attendance toggled.", data: database.attendance });
});
app.delete('/api/attendance/:id', (req, res) => {
  database.attendance = database.attendance.filter(s => s.id != req.params.id);
  res.json({ success: true, message: "Student removed from roster.", data: database.attendance });
});

// 8. Timetable Management Endpoints
app.get('/api/timetable', (req, res) => res.json(database.timetable));
app.post('/api/timetable', (req, res) => {
  const newSlot = { id: Date.now(), status: "Active", ...req.body };
  database.timetable.push(newSlot);
  res.json({ success: true, message: "Timetable slot added.", data: database.timetable });
});
app.put('/api/timetable/:id/status', (req, res) => {
  database.timetable = database.timetable.map(item => {
    if (item.id == req.params.id) {
      const newStatus = item.status === 'Cancelled' ? 'Active' : 'Cancelled';
      return { ...item, status: newStatus };
    }
    return item;
  });
  res.json({ success: true, message: "Timetable status toggled.", data: database.timetable });
});
app.delete('/api/timetable/:id', (req, res) => {
  database.timetable = database.timetable.filter(item => item.id != req.params.id);
  res.json({ success: true, message: "Timetable slot removed.", data: database.timetable });
});

app.listen(PORT, () => {
  console.log(`ClassFlow Core Engine running live on http://localhost:${PORT}`);
});