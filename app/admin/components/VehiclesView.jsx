'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle, 
  MapPin, 
  Download, 
  Plus, 
  LayoutGrid,
  Table as TableIcon,
  X,
  Gauge,
  Fuel
} from 'lucide-react';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function VehiclesView({ 
  cars = [], 
  onDeleteCar, 
  onUpdateCar, 
  onMarkSold, 
  onAddNew 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'cards' | 'table'
  const [editingCar, setEditingCar] = useState(null);

  // Filter cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      (car.make || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.chassis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.year || '').toString().includes(searchTerm);

    const matchesBody = selectedBodyType === 'ALL' || car.bodyType === selectedBodyType;
    const matchesLoc = selectedLocation === 'ALL' || (car.location || '').includes(selectedLocation);

    return matchesSearch && matchesBody && matchesLoc;
  });

  const bodyTypes = ['ALL', 'SUV', 'Pickup', 'Heavy Truck', 'Van', 'Saloon', 'Bus', 'MPV', 'Hatchback', 'T Wagon'];
  const locations = ['ALL', 'Mwanza', 'Dar es Salaam', 'On The Way'];

  const openEditCar = (car) => {
    const carImages = Array.isArray(car.images) && car.images.length > 0
      ? car.images.filter(Boolean)
      : (car.photo ? [car.photo] : []);
    setEditingCar({
      ...car,
      images: carImages,
      photo: carImages[0] || car.photo || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCar) return;
    const rawImages = Array.isArray(editingCar.images) && editingCar.images.length > 0
      ? editingCar.images.filter(Boolean)
      : (editingCar.photo ? [editingCar.photo] : []);
    const photo = rawImages[0] || editingCar.photo || '';
    onUpdateCar({
      ...editingCar,
      photo,
      images: rawImages.length > 0 ? rawImages : (photo ? [photo] : [])
    });
    setEditingCar(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Make,Model,Year,Chassis,Price,Location,BodyType,Fuel,Mileage'];
    const rows = filteredCars.map(c => 
      `"${c.id}","${c.make}","${c.model}","${c.year}","${c.chassis}","${c.price}","${c.location}","${c.bodyType}","${c.fuel}","${c.mileage}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `3B_Motors_Stock_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Vehicles Stock Fleet</span>
            <span className="text-[11px] sm:text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {filteredCars.length} of {cars.length} Active
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Full inventory control, chassis indexing, status tracking and pricing
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onAddNew}
            className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Vehicle</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-bold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>

          {/* View mode toggle (Table vs Cards) */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-gray-600">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Card View"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'cards' || viewMode === 'auto' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <TableIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search make, model, chassis, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#4b6ba3]"
            />
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-500 whitespace-nowrap">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-2.5 py-1.5 sm:py-2 bg-white text-xs outline-none"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Type Pills - horizontally scrollable without breaking on small phones */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 text-xs overflow-x-auto no-scrollbar pb-1">
          <span className="font-bold text-gray-400 text-[11px] mr-1 flex-shrink-0">Type:</span>
          {bodyTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedBodyType(type)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer flex-shrink-0 ${
                selectedBodyType === type
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Mobile Cards View (displayed on mobile when auto or when cards view is selected) */}
      <div className={`${viewMode === 'table' ? 'hidden' : 'block md:hidden'} space-y-3`}>
        {filteredCars.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-xs">
            No vehicles found matching "{searchTerm}". Try clearing search.
          </div>
        ) : (
          filteredCars.map((car, idx) => (
            <div 
              key={car.id}
              className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col transition hover:shadow-md"
            >
              {/* Card Header with Photo and Quick Info */}
              <div className="p-3 flex gap-3 items-center">
                <div className="w-20 h-16 rounded-lg overflow-hidden relative bg-gray-100 flex-shrink-0 border border-gray-200">
                  <Image
                    src={car.photo}
                    alt={car.model}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-mono text-center py-0.5">
                    #{idx + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate">
                      {car.year} {car.make} {car.model}
                    </h4>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                      car.status === 'In Transit' 
                        ? 'bg-amber-100 text-amber-800' 
                        : car.status === 'Reserved'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {car.status || 'In Stock'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-gray-600 truncate mt-0.5">
                    VIN: {car.chassis}
                  </div>

                  <div className="flex items-center justify-between mt-1 text-xs">
                    <div className="font-bold text-gray-900 font-mono text-sm text-[#0d824d]">
                      ${Number(String(car.price).replace(/[^0-9]/g, '')).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <MapPin size={10} className="text-gray-400" />
                      <span>{car.location || 'Mwanza Yard'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs Badges Row */}
              <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-2 text-[10px] text-gray-600 font-medium">
                <span>{car.bodyType}</span>
                <span>•</span>
                <span>{car.fuel}</span>
                <span>•</span>
                <span>{car.mileage}</span>
                <span>•</span>
                <span>{car.trans || 'Auto'}</span>
              </div>

              {/* Mobile Action Buttons Bar */}
              <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between gap-1 bg-white">
                <button
                  type="button"
                  onClick={() => openEditCar(car)}
                  className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-[#4b6ba3] rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onMarkSold(car)}
                  className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
                >
                  <CheckCircle size={13} />
                  <span>Mark Sold</span>
                </button>

                <Link
                  href={`/?stock=${car.id}`}
                  target="_blank"
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center justify-center"
                  title="View Public Details & Gallery"
                >
                  <ExternalLink size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => onDeleteCar(car.id, `${car.year} ${car.make} ${car.model}`)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition flex items-center justify-center"
                  title="Delete from Stock"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Desktop/Tablet Inventory Table (displayed on md+ or when table view mode is explicitly toggled) */}
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${viewMode === 'cards' ? 'hidden' : 'hidden md:block'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Chassis No.</th>
                <th className="py-3 px-4">Year & Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Price (USD)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-medium">
                    No vehicles found matching "{searchTerm}". Try clearing filters.
                  </td>
                </tr>
              ) : (
                filteredCars.map((car, idx) => (
                  <tr key={car.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded overflow-hidden relative bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image
                            src={car.photo}
                            alt={car.model}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-xs">
                            {car.make} {car.model}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {car.mileage} • {car.engine} • {car.fuel}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-gray-700 text-[11px]">
                      {car.chassis}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800">{car.year}</div>
                      <div className="text-[10px] text-gray-500">{car.bodyType}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-gray-700">
                        <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                        <span>{car.location || 'Mwanza'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      ${Number(String(car.price).replace(/[^0-9]/g, '')).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        car.status === 'In Transit' 
                          ? 'bg-amber-100 text-amber-800' 
                          : car.status === 'Reserved'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {car.status || 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCar(car)}
                          title="Quick Edit Vehicle"
                          className="p-1 rounded text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onMarkSold(car)}
                          title="Mark as Sold"
                          className="p-1 rounded text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                        >
                          <CheckCircle size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCar(car.id, `${car.year} ${car.make} ${car.model}`)}
                          title="Delete from Stock"
                          className="p-1 rounded text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
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

      {/* Edit Vehicle Modal (Mobile-responsive with max-h-[90vh] overflow) */}
      {editingCar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 sm:mb-4">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate pr-2">
                Edit: {editingCar.year} {editingCar.make} {editingCar.model}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCar(null)}
                className="text-gray-400 hover:text-black p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (USD)</label>
                  <input
                    type="text"
                    value={editingCar.price}
                    onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fleet Status</label>
                  <select
                    value={editingCar.status || 'In Stock'}
                    onChange={(e) => setEditingCar({ ...editingCar, status: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Yard Location</label>
                  <input
                    type="text"
                    value={editingCar.location}
                    onChange={(e) => setEditingCar({ ...editingCar, location: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mileage</label>
                  <input
                    type="text"
                    value={editingCar.mileage}
                    onChange={(e) => setEditingCar({ ...editingCar, mileage: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-gray-700">
                    Vehicle Photos (Multiple Angles)
                  </label>
                  <span className="text-[10px] text-gray-400">First photo is main cover</span>
                </div>
                <MultiPhotoUpload
                  images={editingCar.images || (editingCar.photo ? [editingCar.photo] : [])}
                  vehicleInfo={editingCar}
                  onChange={(newImages) => {
                    setEditingCar(prev => ({
                      ...prev,
                      images: newImages,
                      photo: newImages[0] || ''
                    }));
                  }}
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg bg-[#4b6ba3] hover:bg-blue-800 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
