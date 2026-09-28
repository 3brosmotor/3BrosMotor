'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2, X, Tag } from 'lucide-react';

export default function NotesView({ notes = [], onAddNote, onDeleteNote }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddNote({ title, content, color });
    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  const colorStyles = {
    yellow: 'bg-amber-50 border-amber-200 text-amber-950',
    blue: 'bg-blue-50 border-blue-200 text-blue-950',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    purple: 'bg-purple-50 border-purple-200 text-purple-950'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bell size={22} className="text-blue-600" />
            <span>Dealership Memos & Operational Notes</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Internal briefing notes, auction target bids and port clearing agent coordination
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>New Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`border rounded-xl p-5 shadow-xs transition flex flex-col justify-between ${
              colorStyles[note.color] || colorStyles.yellow
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm leading-snug">
                  {note.title}
                </h3>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-40 hover:opacity-100 hover:text-red-600 transition"
                  title="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-xs leading-relaxed opacity-85 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 text-[10px] opacity-60 flex items-center justify-between">
              <span>{note.date || 'Today'}</span>
              <span className="uppercase font-bold tracking-wider">3B MOTORS MEMO</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Create Dealership Memo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scania R450 Buyer Request"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write note details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Color Theme</label>
                <div className="flex gap-2">
                  {['yellow', 'blue', 'green', 'purple'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                      } ${
                        c === 'yellow' ? 'bg-amber-300' : c === 'blue' ? 'bg-blue-300' : c === 'green' ? 'bg-emerald-300' : 'bg-purple-300'
                      }`}
                    />
                  ))}
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
                  className="px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-bold"
                >
                  Save Memo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
