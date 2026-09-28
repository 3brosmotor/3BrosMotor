'use client';

import { useState } from 'react';
import { Bookmark, CheckCircle2, Circle, Plus, Trash2, Calendar, AlertTriangle, X } from 'lucide-react';

export default function RemindersView({ reminders = [], onToggleReminder, onAddReminder, onDeleteReminder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('High');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    onAddReminder({ task, dueDate, priority });
    setTask('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bookmark size={22} className="text-amber-500" />
            <span>Reminders & Compliance Deadlines</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track TRA duty payments, port storage demurrage limits and yard operational tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {reminders.map((rem) => (
          <div 
            key={rem.id} 
            className={`p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition ${
              rem.completed ? 'opacity-50 bg-gray-50/50' : ''
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                type="button"
                onClick={() => onToggleReminder(rem.id)}
                className="mt-0.5 text-gray-400 hover:text-emerald-600 transition cursor-pointer"
              >
                {rem.completed ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <div>
                <span className={`text-xs sm:text-sm font-semibold text-gray-900 block ${
                  rem.completed ? 'line-through text-gray-400' : ''
                }`}>
                  {rem.task}
                </span>

                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Due: {rem.dueDate}</span>
                  </span>

                  <span className={`px-2 py-0.2 rounded font-bold text-[10px] ${
                    rem.priority === 'High' 
                      ? 'bg-red-100 text-red-700' 
                      : rem.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {rem.priority} Priority
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDeleteReminder(rem.id)}
              className="text-gray-300 hover:text-red-500 transition p-1"
              title="Delete reminder"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Add Compliance Reminder</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Task / Deadline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TRA Customs payment deadline for SCANIA R450"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg bg-white font-bold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
