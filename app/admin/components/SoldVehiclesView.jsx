'use client';

import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  User, 
  Plus, 
  X, 
  Pencil, 
  Trash2, 
  Search, 
  AlertTriangle,
  FileText,
  Phone,
  Car
} from 'lucide-react';

export default function SoldVehiclesView({ 
  soldList = [], 
  onAddSold, 
  onUpdateSold, 
  onDeleteSold 
}) {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [deletingSale, setDeletingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Sale Form State
  const [newSale, setNewSale] = useState({
    make: 'Toyota',
    model: '',
    year: '2020',
    chassis: '',
    customerName: '',
    customerPhone: '',
    salePrice: '',
    purchaseCost: '',
    saleDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer'
  });

  // Edit Sale Form State
  const [editForm, setEditForm] = useState({
    id: '',
    make: 'Toyota',
    model: '',
    year: '2020',
    chassis: '',
    customerName: '',
    customerPhone: '',
    salePrice: '',
    purchaseCost: '',
    saleDate: '',
    paymentMethod: 'Bank Transfer'
  });

  // Filtered List based on search
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return soldList;
    const term = searchTerm.toLowerCase();
    return soldList.filter(item => {
      const title = `${item.year || ''} ${item.make || ''} ${item.model || ''}`.toLowerCase();
      const chassis = (item.chassis || '').toLowerCase();
      const customer = (item.customerName || '').toLowerCase();
      const phone = (item.customerPhone || '').toLowerCase();
      return title.includes(term) || chassis.includes(term) || customer.includes(term) || phone.includes(term);
    });
  }, [soldList, searchTerm]);

  // KPI Calculations
  const totalSalesRevenue = soldList.reduce((sum, item) => sum + (Number(item.salePrice) || 0), 0);
  const totalProfit = soldList.reduce((sum, item) => {
    const profit = Number(item.profit) || ((Number(item.salePrice) || 0) - (Number(item.purchaseCost) || 0));
    return sum + profit;
  }, 0);

  // Handle Add Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSale.model || !newSale.salePrice) {
      alert('Please fill in vehicle model and sale price.');
      return;
    }
    const salePriceNum = Number(String(newSale.salePrice).replace(/[^0-9]/g, '')) || 0;
    const purchaseCostNum = Number(String(newSale.purchaseCost).replace(/[^0-9]/g, '')) || Math.round(salePriceNum * 0.8);
    const profitNum = salePriceNum - purchaseCostNum;

    if (onAddSold) {
      onAddSold({
        ...newSale,
        salePrice: salePriceNum,
        purchaseCost: purchaseCostNum,
        profit: profitNum,
        saleDate: newSale.saleDate || new Date().toISOString().split('T')[0]
      });
    }

    setIsAddModalOpen(false);
    setNewSale({
      make: 'Toyota',
      model: '',
      year: '2020',
      chassis: '',
      customerName: '',
      customerPhone: '',
      salePrice: '',
      purchaseCost: '',
      saleDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer'
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingSale(item);
    setEditForm({
      id: item.id,
      make: item.make || 'Toyota',
      model: item.model || '',
      year: String(item.year || '2020'),
      chassis: item.chassis || '',
      customerName: item.customerName || '',
      customerPhone: item.customerPhone || '',
      salePrice: String(item.salePrice || ''),
      purchaseCost: String(item.purchaseCost || ''),
      saleDate: item.saleDate || new Date().toISOString().split('T')[0],
      paymentMethod: item.paymentMethod || 'Bank Transfer'
    });
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.model || !editForm.salePrice) {
      alert('Please fill in vehicle model and sale price.');
      return;
    }
    const salePriceNum = Number(String(editForm.salePrice).replace(/[^0-9]/g, '')) || 0;
    const purchaseCostNum = Number(String(editForm.purchaseCost).replace(/[^0-9]/g, '')) || 0;
    const profitNum = salePriceNum - purchaseCostNum;

    if (onUpdateSold) {
      onUpdateSold({
        ...editForm,
        salePrice: salePriceNum,
        purchaseCost: purchaseCostNum,
        profit: profitNum
      });
    }

    setEditingSale(null);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingSale && onDeleteSold) {
      onDeleteSold(deletingSale.id);
      setDeletingSale(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 size={22} className="text-emerald-600" />
            <span>Sold Vehicles Ledger</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Archived sales contracts, customer deliveries, profits and ledger records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Record New Sale</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Sales Units</span>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{soldList.length} Units</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Gross Volume</span>
          <div className="text-lg sm:text-2xl font-bold text-emerald-600 font-mono mt-0.5 sm:mt-1">
            ${totalSalesRevenue.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Realized Net Profit</span>
          <div className="text-base sm:text-2xl font-bold text-blue-600 font-mono mt-0.5 sm:mt-1">
            ${totalProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vehicle, chassis, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing <strong className="text-gray-800">{filteredList.length}</strong> of {soldList.length} sold records
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Chassis</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Sale Price</th>
                <th className="py-3 px-4">Profit</th>
                <th className="py-3 px-4">Sale Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    {searchTerm ? 'No sold vehicles match your search criteria.' : 'No sold vehicles recorded yet.'}
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition group">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Car size={14} className="text-gray-400 flex-shrink-0" />
                        <span>{item.year} {item.make} {item.model}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 text-[11px]">
                      {item.chassis || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{item.customerName || 'Private Client'}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        {item.customerPhone ? (
                          <>
                            <Phone size={10} />
                            <span>{item.customerPhone}</span>
                          </>
                        ) : (
                          'Direct Deal'
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      ${Number(item.salePrice || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      +${Number(item.profit || (Number(item.salePrice || 0) - Number(item.purchaseCost || 0))).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {item.saleDate || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-800 font-medium px-2 py-0.5 rounded text-[10px]">
                        {item.paymentMethod || 'Bank Wire'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Sold Vehicle Record"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSale(item)}
                          title="Delete Sold Vehicle Record"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Plus size={16} className="text-emerald-600" />
                Record Completed Vehicle Sale
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={newSale.make}
                    onChange={(e) => setNewSale({ ...newSale, make: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={newSale.year}
                    onChange={(e) => setNewSale({ ...newSale, year: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prado TX 2.8L"
                  value={newSale.model}
                  onChange={(e) => setNewSale({ ...newSale, model: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Chassis Number</label>
                <input
                  type="text"
                  placeholder="GDJ150-1092834"
                  value={newSale.chassis}
                  onChange={(e) => setNewSale({ ...newSale, chassis: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sale Price (USD) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42,000"
                    value={newSale.salePrice}
                    onChange={(e) => setNewSale({ ...newSale, salePrice: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cost Price (USD)</label>
                  <input
                    type="text"
                    placeholder="e.g. 35,000"
                    value={newSale.purchaseCost}
                    onChange={(e) => setNewSale({ ...newSale, purchaseCost: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Josephat Mwita"
                    value={newSale.customerName}
                    onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    placeholder="+255 754 123 456"
                    value={newSale.customerPhone}
                    onChange={(e) => setNewSale({ ...newSale, customerPhone: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sale Date</label>
                  <input
                    type="date"
                    value={newSale.saleDate}
                    onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={newSale.paymentMethod}
                    onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                    <option value="Letter of Credit">Letter of Credit</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Confirm Sale Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sold Record Modal */}
      {editingSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Pencil size={16} className="text-blue-600" />
                Edit Sold Vehicle Record
              </h3>
              <button onClick={() => setEditingSale(null)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={editForm.make}
                    onChange={(e) => setEditForm({ ...editForm, make: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={editForm.model}
                  onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Chassis Number</label>
                <input
                  type="text"
                  value={editForm.chassis}
                  onChange={(e) => setEditForm({ ...editForm, chassis: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sale Price (USD) *</label>
                  <input
                    type="text"
                    required
                    value={editForm.salePrice}
                    onChange={(e) => setEditForm({ ...editForm, salePrice: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cost Price (USD)</label>
                  <input
                    type="text"
                    value={editForm.purchaseCost}
                    onChange={(e) => setEditForm({ ...editForm, purchaseCost: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editForm.customerName}
                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    value={editForm.customerPhone}
                    onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sale Date</label>
                  <input
                    type="date"
                    value={editForm.saleDate}
                    onChange={(e) => setEditForm({ ...editForm, saleDate: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                    <option value="Letter of Credit">Letter of Credit</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {/* Live Profit Calculation Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900">Calculated Gross Margin:</span>
                <span className="font-bold font-mono text-blue-800">
                  +${((Number(String(editForm.salePrice).replace(/[^0-9]/g, '')) || 0) - (Number(String(editForm.purchaseCost).replace(/[^0-9]/g, '')) || 0)).toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 animate-in zoom-in-95 text-xs">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Delete Sold Record?</h3>
                <p className="text-gray-500 text-[11px]">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-3 space-y-1">
              <div className="font-bold text-gray-900">
                {deletingSale.year} {deletingSale.make} {deletingSale.model}
              </div>
              <div className="text-gray-500 font-mono text-[11px]">
                Chassis: {deletingSale.chassis || 'N/A'}
              </div>
              <div className="text-emerald-700 font-bold font-mono">
                Sale: ${Number(deletingSale.salePrice || 0).toLocaleString()}
              </div>
              {deletingSale.customerName && (
                <div className="text-gray-600">Client: {deletingSale.customerName}</div>
              )}
            </div>

            <p className="text-gray-600 text-[11px] mb-4">
              Are you sure you want to remove this record from the Sold Vehicles ledger?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingSale(null)}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
