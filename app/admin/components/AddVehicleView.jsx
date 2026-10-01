'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, CheckCircle, Car, ArrowLeft, Camera } from 'lucide-react';
import MultiPhotoUpload from './MultiPhotoUpload';

const MAKE_OPTIONS = [
  'Toyota', 'Nissan', 'SCANIA', 'Mitsubishi', 'Subaru', 'Hino', 
  'Volkswagen', 'Suzuki', 'Land Rover', 'BMW', 'Mercedes-Benz', 'Isuzu', 'SINO', 'Honda', 'Mazda'
];

const BODY_OPTIONS = [
  'SUV', 'Pickup', 'Heavy Truck', 'Van', 'Saloon', 'Bus', 'MPV', 'Hatchback', 'T Wagon', 'Coupe'
];

export default function AddVehicleView({ onSaveCar, onCancel }) {
  const [formData, setFormData] = useState({
    make: 'Toyota',
    model: '',
    year: '2023',
    chassis: '',
    location: 'Dar es Salaam Yard',
    price: '',
    bodyType: 'SUV',
    fuel: 'DIESEL',
    trans: 'Auto',
    steering: 'RIGHT',
    mileage: '45,000 KM',
    engine: '2800 CC',
    color: 'WHITE',
    seats: '5',
    doors: '5',
    features: 'Push Start, Alloy Wheels, Reverse Camera, Airbags, Bluetooth, 4WD',
    photo: '',
    images: [],
    status: 'In Stock'
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.model.trim()) {
      alert('Please enter vehicle model (e.g. Prado TX, Hilux, Harrier).');
      return;
    }

    const chassisNum = formData.chassis.trim() || `${formData.make.slice(0, 3).toUpperCase()}${formData.year.slice(2)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const rawImages = Array.isArray(formData.images) && formData.images.length > 0
      ? formData.images.filter(Boolean)
      : (formData.photo ? [formData.photo.trim()] : []);

    const primaryPhoto = rawImages[0] || formData.photo.trim() || '';
    const finalImages = rawImages.length > 0 ? rawImages : (primaryPhoto ? [primaryPhoto] : []);

    const carData = {
      ...formData,
      chassis: chassisNum,
      photo: primaryPhoto,
      images: finalImages,
      price: formData.price.replace(/[$,]/g, '') || '25,000',
      mileage: formData.mileage.includes('KM') ? formData.mileage : `${formData.mileage} KM`,
      engine: formData.engine.includes('CC') ? formData.engine : `${formData.engine} CC`
    };

    onSaveCar(carData);
    setNotification(`Successfully added ${carData.year} ${carData.make} ${carData.model} (Chassis: ${chassisNum}) with ${finalImages.length} photos!`);
    
    // Reset form
    setFormData({
      make: 'Toyota',
      model: '',
      year: '2023',
      chassis: '',
      location: 'Dar es Salaam Yard',
      price: '',
      bodyType: 'SUV',
      fuel: 'DIESEL',
      trans: 'Auto',
      steering: 'RIGHT',
      mileage: '45,000 KM',
      engine: '2800 CC',
      color: 'WHITE',
      seats: '5',
      doors: '5',
      features: 'Push Start, Alloy Wheels, Reverse Camera, Airbags, Bluetooth, 4WD',
      photo: '',
      images: [],
      status: 'In Stock'
    });

    setTimeout(() => setNotification(null), 6000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Plus size={22} className="text-emerald-600" />
            <span>Add Vehicle to Dealership Fleet</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Add passenger, commercial or heavy truck inventory to 3B MOTORS stock
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        )}
      </div>

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-3 text-xs font-bold shadow-xs">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Core Specs Grid */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            1. Core Vehicle Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Make / Brand *</label>
              <select
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-600"
              >
                {MAKE_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Model Name *</label>
              <input
                type="text"
                name="model"
                required
                placeholder="e.g. Land Cruiser Prado TX-L"
                value={formData.model}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Year of Manufacture</label>
              <input
                type="number"
                name="year"
                min="1990"
                max="2026"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Body Type</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-600"
              >
                {BODY_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Chassis Number / VIN</label>
              <input
                type="text"
                name="chassis"
                placeholder="e.g. GDJ150-004819"
                value={formData.chassis}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg font-mono outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Price (USD) *</label>
              <input
                type="text"
                name="price"
                placeholder="e.g. 38,500"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg font-bold outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            2. Mechanical & Dimensions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Fuel Type</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white"
              >
                <option value="DIESEL">DIESEL</option>
                <option value="PETROL">PETROL</option>
                <option value="HYBRID">HYBRID</option>
                <option value="ELECTRIC">ELECTRIC</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Transmission</label>
              <select
                name="trans"
                value={formData.trans}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white"
              >
                <option value="Auto">Auto</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Auto">Semi-Auto</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Engine Size</label>
              <input
                type="text"
                name="engine"
                placeholder="2800 CC"
                value={formData.engine}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mileage</label>
              <input
                type="text"
                name="mileage"
                placeholder="45,000 KM"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Exterior Color</label>
              <input
                type="text"
                name="color"
                placeholder="WHITE"
                value={formData.color}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Seating Capacity</label>
              <input
                type="text"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Yard Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white"
              >
                <option value="Mwanza Yard">Mwanza Yard</option>
                <option value="Dar es Salaam Port">Dar es Salaam Port</option>
                <option value="On The Way">On The Way (Vessel)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Fleet Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg bg-white font-bold"
              >
                <option value="In Stock">In Stock (Available)</option>
                <option value="In Transit">In Transit</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Photo & Features */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            3. Photos & Features (Multiple Angles)
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-gray-700">Vehicle Photos (Front, Side, Interior, Rear)</label>
                <span className="text-[11px] text-gray-500">First photo will be the main listing cover</span>
              </div>
              <MultiPhotoUpload
                images={formData.images}
                vehicleInfo={formData}
                onChange={(newImages) => {
                  setFormData(prev => ({
                    ...prev,
                    images: newImages,
                    photo: newImages[0] || ''
                  }));
                }}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Key Features & Equipment</label>
              <textarea
                name="features"
                rows={2}
                value={formData.features}
                onChange={handleChange}
                placeholder="Push Start, Alloy Wheels, Sunroof, Leather Seats, 4WD, Reverse Camera"
                className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Save & Add to Stock</span>
          </button>
        </div>
      </form>
    </div>
  );
}
