'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SlidersHorizontal, MapPin, CheckCircle, RefreshCw, Filter } from 'lucide-react';

export default function VehiclesManagementView({ cars = [], onUpdateCar }) {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notification, setNotification] = useState(null);

  const filtered = cars.filter(c => {
    const locMatch = selectedLocation === 'ALL' || (c.location || '').includes(selectedLocation);
    const statusMatch = statusFilter === 'ALL' || (c.status || 'In Stock') === statusFilter;
    return locMatch && statusMatch;
  });

  const handleStatusChange = (car, newStatus) => {
    onUpdateCar({ ...car, status: newStatus });
    setNotification(`Updated ${car.make} ${car.model} status to "${newStatus}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLocationChange = (car, newLocation) => {
    onUpdateCar({ ...car, location: newLocation });
    setNotification(`Relocated ${car.make} ${car.model} to "${newLocation}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal size={22} className="text-blue-600" />
            <span>Vehicles Fleet Operations Management</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Yard allocation, transit tracking between Dar es Salaam Port and Mwanza showroom
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-xs font-semibold outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="In Transit">In Transit</option>
            <option value="Reserved">Reserved</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-xs font-semibold outline-none"
          >
            <option value="ALL">All Locations</option>
            <option value="Mwanza">Mwanza Yard</option>
            <option value="Dar es Salaam">Dar es Salaam Port</option>
            <option value="On The Way">On The Way (Vessel)</option>
          </select>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
          <CheckCircle size={15} />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid of Vehicle Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((car) => (
          <div key={car.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <div className="w-16 h-12 rounded overflow-hidden relative bg-gray-100 flex-shrink-0 border border-gray-200">
                <Image
                  src={car.photo}
                  alt={car.model}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized={typeof car.photo === 'string' && (car.photo.startsWith('data:') || car.photo.startsWith('blob:'))}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {car.year} {car.make} {car.model}
                </h4>
                <div className="text-[11px] font-mono text-gray-500">
                  {car.chassis}
                </div>
                <div className="text-xs font-mono font-bold text-blue-600 mt-0.5">
                  ${Number(String(car.price).replace(/[^0-9]/g, '')).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Status:</span>
                <select
                  value={car.status || 'In Stock'}
                  onChange={(e) => handleStatusChange(car, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs font-bold bg-white outline-none"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Location:</span>
                <select
                  value={car.location || 'Mwanza Yard'}
                  onChange={(e) => handleLocationChange(car, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none"
                >
                  <option value="Mwanza Yard">Mwanza Yard</option>
                  <option value="Dar es Salaam Port">Dar es Salaam Port</option>
                  <option value="On The Way">On The Way</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
