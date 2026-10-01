'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Settings, 
  Save, 
  CheckCircle, 
  Building, 
  DollarSign, 
  MapPin, 
  Truck, 
  Camera, 
  Upload 
} from 'lucide-react';
import { getDealershipSettings, saveDealershipSettings, compressImage } from '../../lib/adminStore';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../../lib/cloudinary';

export default function SettingsView({ subTab = 'settings-makes' }) {
  const [settings, setSettings] = useState(() => getDealershipSettings());
  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef(null);

  const [makesList, setMakesList] = useState([
    'Toyota', 'SCANIA', 'Nissan', 'Mitsubishi', 'Hino', 'Subaru', 
    'Isuzu', 'SINO', 'Land Rover', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Suzuki', 'Honda', 'Mazda'
  ]);
  const [newMake, setNewMake] = useState('');

  const [bodyTypes, setBodyTypes] = useState([
    'SUV', 'Pickup', 'Heavy Truck', 'Van', 'Saloon', 'Bus', 'MPV', 'Hatchback', 'T Wagon', 'Coupe'
  ]);
  const [newBodyType, setNewBodyType] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    saveDealershipSettings(settings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddMake = (e) => {
    e.preventDefault();
    if (!newMake.trim()) return;
    if (!makesList.includes(newMake.trim())) {
      setMakesList([...makesList, newMake.trim()]);
    }
    setNewMake('');
  };

  const handleAddBodyType = (e) => {
    e.preventDefault();
    if (!newBodyType.trim()) return;
    if (!bodyTypes.includes(newBodyType.trim())) {
      setBodyTypes([...bodyTypes, newBodyType.trim()]);
    }
    setNewBodyType('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Settings size={22} className="text-gray-700" />
          <span>Vehicle Settings & Configuration</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure automotive brands, body categories, port locations and exchange benchmarks
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
          <CheckCircle size={15} />
          <span>Settings successfully saved and synchronized!</span>
        </div>
      )}

      {/* Dealership Profile & Exchange Rate */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5 text-xs">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Building size={16} className="text-[#4b6ba3]" />
          <span>Dealership Principal & Currency Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Director / Managing Principal</label>
            <input
              type="text"
              value={settings.directorName || 'Hammad Riaz'}
              onChange={(e) => setSettings({ ...settings, directorName: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Director Profile Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-300 bg-gray-100 flex-shrink-0">
                {settings.adminAvatar ? (
                  <Image
                    src={settings.adminAvatar}
                    alt="Director Profile"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-xs font-bold text-gray-500">HR</span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    // If Cloudinary configured, upload to Cloudinary
                    if (isCloudinaryConfigured()) {
                      const cldRes = await uploadToCloudinary(file);
                      if (cldRes.success && cldRes.url) {
                        setSettings(prev => ({ ...prev, adminAvatar: cldRes.url }));
                        return;
                      }
                    }
                    const compressed = await compressImage(file, 300, 0.82);
                    if (compressed) {
                      setSettings(prev => ({ ...prev, adminAvatar: compressed }));
                    }
                  } catch {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setSettings(prev => ({ ...prev, adminAvatar: ev.target.result }));
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Camera size={13} />
                <span>Upload New Photo</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Registered Dealership Entity</label>
            <input
              type="text"
              value={settings.dealershipName}
              onChange={(e) => setSettings({ ...settings, dealershipName: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Primary Showroom Yard</label>
            <input
              type="text"
              value={settings.primaryLocation}
              onChange={(e) => setSettings({ ...settings, primaryLocation: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Port Office & Clearing Berth</label>
            <input
              type="text"
              value={settings.portOffice}
              onChange={(e) => setSettings({ ...settings, portOffice: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">USD to TZS Exchange Rate (Benchmark)</label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">1 USD =</span>
              <input
                type="text"
                value={settings.tzsRate}
                onChange={(e) => setSettings({ ...settings, tzsRate: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg font-mono font-bold"
              />
              <span className="font-bold text-gray-500">TZS</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-bold px-5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Makes & Brands Manager */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Truck size={16} className="text-emerald-600" />
          <span>Vehicle Brands & Manufacturers</span>
        </h3>
        
        <form onSubmit={handleAddMake} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new make (e.g. Scania, Sinotruk, Fuso)..."
            value={newMake}
            onChange={(e) => setNewMake(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-lg text-xs"
          />
          <button
            type="submit"
            className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
          >
            Add Make
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {makesList.map((m) => (
            <span key={m} className="bg-gray-100 border border-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-md text-xs">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Body Types Manager */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 text-xs">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <MapPin size={16} className="text-purple-600" />
          <span>Automotive Body Categories</span>
        </h3>

        <form onSubmit={handleAddBodyType} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new body type..."
            value={newBodyType}
            onChange={(e) => setNewBodyType(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-lg text-xs"
          />
          <button
            type="submit"
            className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-2 rounded-lg"
          >
            Add Type
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {bodyTypes.map((b) => (
            <span key={b} className="bg-gray-100 border border-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-md text-xs">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
