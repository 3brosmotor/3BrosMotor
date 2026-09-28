'use client';

import { useState } from 'react';
import { DollarSign, Plus, Trash2, Tag, Calendar, Building2, X } from 'lucide-react';

export default function ExpensesView({ expensesList = [], onAddExpense, onDeleteExpense }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    vehicleStock: '',
    category: 'Clearance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Paid'
  });

  const categories = ['Clearance', 'Transport', 'Maintenance', 'Fuel', 'Customs Duty', 'Inspection', 'Showroom'];

  const totalExpense = expensesList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert('Please fill in expense title and amount.');
      return;
    }

    onAddExpense({
      ...formData,
      amount: Number(formData.amount.replace(/[^0-9]/g, ''))
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      vehicleStock: '',
      category: 'Clearance',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Paid'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <DollarSign size={22} className="text-red-500" />
            <span>Vehicle & Yard Expenses</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log port duty, Dar-to-Mwanza freight, mechanical inspections and yard upkeep
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Recorded</span>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{expensesList.length} Entries</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Total Outflow</span>
          <div className="text-lg sm:text-2xl font-bold text-red-600 font-mono mt-0.5 sm:mt-1">
            ${totalExpense.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Equivalent in TZS</span>
          <div className="text-base sm:text-xl font-bold text-gray-800 font-mono mt-0.5 sm:mt-1">
            TZS {(totalExpense * 2650).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">Expense Title / Purpose</th>
                <th className="py-3 px-4">Vehicle Stock #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expensesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No expenses logged for this period.
                  </td>
                </tr>
              ) : (
                expensesList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {item.vehicleStock ? `#${item.vehicleStock}` : 'General Fleet'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-red-600">
                      ${Number(item.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {item.status || 'Paid'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteExpense(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                        title="Delete expense entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">
                Add Vehicle or Dealership Expense
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TRA Customs clearance for Hilux Revo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Vehicle Stock ID (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1001"
                    value={formData.vehicleStock}
                    onChange={(e) => setFormData({ ...formData, vehicleStock: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount (USD) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1,200"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
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
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
