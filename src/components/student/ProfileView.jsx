import React, { useState } from 'react';
import axios from 'axios';

function ProfileView({ studentData, setApiStudent }) {
  const [formData, setFormData] = useState(studentData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/student', formData);
      setApiStudent(response.data.data); // Update the global state
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Student Profile</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Edit Profile</button>
        ) : (
          <div className="space-x-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Save Changes</button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1">{key}</label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              disabled={!isEditing}
              className={`p-2 rounded border ${isEditing ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileView;