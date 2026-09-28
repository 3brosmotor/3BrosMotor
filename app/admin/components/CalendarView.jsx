'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, X, Ship, UserCheck, Gavel } from 'lucide-react';

export default function CalendarView({ events = [], onAddEvent, onDeleteEvent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Mwanza Yard',
    type: 'Appointment',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter an event title.');
      return;
    }
    onAddEvent(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      location: 'Mwanza Yard',
      type: 'Appointment',
      notes: ''
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Shipment': return Ship;
      case 'Auction': return Gavel;
      default: return UserCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CalendarIcon size={22} className="text-[#4b6ba3]" />
            <span>Dealership Operational Calendar</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Port vessel arrivals, customer test drives, Japan auction schedules and yard inspections
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Schedule Event</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => {
          const Icon = getTypeIcon(evt.type);
          return (
            <div key={evt.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md transition relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    evt.type === 'Shipment'
                      ? 'bg-blue-100 text-blue-800'
                      : evt.type === 'Auction'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Icon size={12} />
                    <span>{evt.type}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onDeleteEvent(evt.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Remove event"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 text-sm leading-snug">
                  {evt.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={13} className="text-gray-400 flex-shrink-0" />
                    <span>{evt.date}</span>
                    <span className="text-gray-400">•</span>
                    <Clock size={13} className="text-gray-400 flex-shrink-0" />
                    <span>{evt.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                    <span>{evt.location}</span>
                  </div>

                  {evt.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500 italic">
                      "{evt.notes}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">
                Schedule Dealership Event
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vessel Berthing Dar Port (2 Prado & 1 Scania)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg bg-white"
                  >
                    <option value="Shipment">Shipment / Port Arrival</option>
                    <option value="Appointment">Client Test Drive / Visit</option>
                    <option value="Auction">Japan Auction Bid</option>
                    <option value="Inspection">TRA / TBS Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Dar Port / Mwanza Yard"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Additional instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
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
                  className="px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
