import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignmentsManagement() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) {
      alert("Please fill in all required assignment fields.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5001/api/assignments', { title, subject, dueDate, description });
      setAssignments(res.data.data);
      setTitle('');
      setSubject('');
      setDueDate('');
      setDescription('');
      alert("Assignment posted successfully!");
    } catch (err) {
      console.error("Error posting assignment:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      const res = await axios.delete(`http://localhost:5001/api/assignments/${id}`);
      setAssignments(res.data.data);
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Publish New Assignment</h2>
        <form onSubmit={handlePost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. BST Implementation" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Computer Science" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Complete in C++" className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Publish Assignment</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Active Assignments Roster</h3>
        <div className="space-y-3">
          {assignments.map(item => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-blue-600">{item.subject} • Due: {item.dueDate}</p>
                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 text-xs font-semibold hover:text-red-800">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignmentsManagement;