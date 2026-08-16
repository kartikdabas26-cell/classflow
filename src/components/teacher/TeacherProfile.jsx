import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherProfile() {
  const [teacher, setTeacher] = useState({
    name: '',
    department: '',
    designation: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teacher');
      setTeacher(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error("Error fetching teacher profile:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/teacher', formData);
      setTeacher(response.data.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Teacher Profile</h2>
          <p className="text-xs text-slate-500">Manage your faculty account details.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500 font-medium">Full Name</span>
            <span className="text-slate-800 font-semibold">{teacher.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500 font-medium">Department</span>
            <span className="text-slate-800 font-semibold">{teacher.department}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500 font-medium">Designation</span>
            <span className="text-slate-800 font-semibold">{teacher.designation}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <span className="text-slate-500 font-medium">Email Address</span>
            <span className="text-slate-800 font-semibold">{teacher.email}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleChange}
              spellCheck="false"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Department</label>
            <input 
              type="text" 
              name="department" 
              value={formData.department || ''} 
              onChange={handleChange}
              spellCheck="false"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Designation</label>
            <input 
              type="text" 
              name="designation" 
              value={formData.designation || ''} 
              onChange={handleChange}
              spellCheck="false"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange}
              spellCheck="false"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-black font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition">
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setFormData(teacher); }} 
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TeacherProfile;
