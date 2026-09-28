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
  Upload, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  Key, 
  HelpCircle 
} from 'lucide-react';
import { getDealershipSettings, saveDealershipSettings, compressImage } from '../../lib/adminStore';
import { uploadToCloudinary, isCloudinaryConfigured, testCloudinaryConnection } from '../../../lib/cloudinary';

export default function SettingsView({ subTab = 'settings-makes' }) {
  const [settings, setSettings] = useState(() => getDealershipSettings());
  const [savedNotice, setSavedNotice] = useState(false);
  const [testState, setTestState] = useState({ loading: false, result: null });
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

  const handleTestCloudinary = async () => {
    if (!settings.cloudinaryCloudName?.trim() || !settings.cloudinaryUploadPreset?.trim()) {
      setTestState({
        loading: false,
        result: {
          success: false,
          message: 'Please enter both Cloud Name and Upload Preset before testing.'
        }
      });
      return;
    }

    setTestState({ loading: true, result: null });
    const res = await testCloudinaryConnection(
      settings.cloudinaryCloudName.trim(),
      settings.cloudinaryUploadPreset.trim()
    );

    if (res.success) {
      setTestState({
        loading: false,
        result: {
          success: true,
          message: 'Connected successfully! Cloudinary is ready to store all vehicle photos.'
        }
      });
    } else {
      setTestState({
        loading: false,
        result: {
          success: false,
          message: res.error || 'Connection failed. Please verify your Cloud Name and Unsigned Preset.'
        }
      });
    }
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
          Configure automotive brands, body categories, port locations, Cloudinary CDN storage and exchange benchmarks
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
          <CheckCircle size={15} />
          <span>Settings successfully saved and synchronized!</span>
        </div>
      )}

      {/* Cloudinary CDN Image Storage Configuration */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <UploadCloud size={18} className="text-blue-600" />
            <span>Cloudinary CDN Photo Storage Integration</span>
          </h3>
          {settings.cloudinaryCloudName && settings.cloudinaryUploadPreset ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={13} />
              <span>CDN Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              <CheckCircle size={13} />
              <span>Direct Photo Upload Active (Cloudinary Optional)</span>
            </span>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">
          Vehicle photo upload works <strong>out-of-the-box</strong> with automated high-definition compression. Connecting your free Cloudinary account is <em>optional</em> and provides external CDN hosting for your inventory assets.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
              <span>Cloud Name</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. dxyz123abc"
              value={settings.cloudinaryCloudName || ''}
              onChange={(e) => setSettings({ ...settings, cloudinaryCloudName: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg font-mono text-xs"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              Found on your main Cloudinary Dashboard (Cloud Name)
            </span>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
              <span>Upload Preset (Unsigned)</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 3bros_preset or ml_default"
              value={settings.cloudinaryUploadPreset || ''}
              onChange={(e) => setSettings({ ...settings, cloudinaryUploadPreset: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded-lg font-mono text-xs"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              Created in Cloudinary Settings → Upload → Upload Presets (Mode: Unsigned)
            </span>
          </div>
        </div>

        {/* Quick Guide Card */}
        <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] space-y-1 text-blue-900">
          <div className="font-bold flex items-center gap-1 text-blue-950">
            <HelpCircle size={13} />
            <span>How to get your free Cloudinary credentials in 1 minute:</span>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
            <li>Log into your free account at <a href="https://cloudinary.com/console" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-600 inline-flex items-center gap-0.5">cloudinary.com <ExternalLink size={10} /></a>.</li>
            <li>Copy your <strong>Cloud Name</strong> from the Dashboard.</li>
            <li>Go to <strong>Settings ⚙️ → Upload Presets</strong>, click <strong>Add upload preset</strong>, switch Signing Mode to <strong>Unsigned</strong>, and copy the preset name.</li>
            <li>Paste both above and click <strong>Test Connection</strong>!</li>
          </ol>
        </div>

        {/* Test Result Banner */}
        {testState.result && (
          <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            testState.result.success
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : 'bg-amber-50 border border-amber-300 text-amber-800'
          }`}>
            {testState.result.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{testState.result.message}</span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleTestCloudinary}
            disabled={testState.loading}
            className="px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {testState.loading ? (
              <>
                <Loader2 size={14} className="animate-spin text-blue-600" />
                <span>Testing Connection...</span>
              </>
            ) : (
              <>
                <Key size={14} className="text-gray-500" />
                <span>Test Cloudinary Connection</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save size={14} />
            <span>Save Cloudinary Settings</span>
          </button>
        </div>
      </div>

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
