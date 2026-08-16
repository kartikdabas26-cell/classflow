import React, { useState } from 'react';

function ProfileView({ studentData, setApiStudent }) {
  const [formData, setFormData] = useState(studentData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    try {
      setApiStudent(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm text-slate-900 w-full max-w-4xl mx-auto">
      {/* Responsive Header: Stacks on mobile, side-by-side on larger screens */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-900">Student Profile</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            Edit Profile
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button onClick={() => setIsEditing(false)} className="w-full sm:w-auto px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition">
              Cancel
            </button>
            <button onClick={handleSave} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-xs font-bold text-slate-600 uppercase mb-1">{key}</label>
            <input
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              disabled={!isEditing}
              spellCheck="false"
              className={`p-3 rounded-lg border text-black font-medium outline-none transition w-full ${
                isEditing 
                  ? 'border-blue-500 bg-white ring-2 ring-blue-100' 
                  : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileView;
