import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Calendar } from 'lucide-react';

function AssignmentsView() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/assignments')
      .then(response => {
        setAssignments(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching assignments:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Assigned Tasks & Projects</h2>
        <p className="text-sm text-slate-500">View all assignments posted by your faculty.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.length === 0 ? (
          <div className="col-span-2 bg-white p-6 rounded-xl border border-slate-200 text-slate-500 text-center">
            No active assignments found.
          </div>
        ) : (
          assignments.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
                    {item.subject}
                  </span>
                  <span className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <Calendar size={13} /> Due: {item.dueDate}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AssignmentsView;