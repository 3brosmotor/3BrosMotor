'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Maximize2, 
  Minimize2, 
  Globe, 
  ChevronDown, 
  LogOut, 
  Building2,
  UserCheck,
  Menu,
  Camera,
  Upload,
  Link as LinkIcon,
  X,
  Check
} from 'lucide-react';
import { getDealershipSettings, saveDealershipSettings, compressImage } from '../../lib/adminStore';
import { uploadToCloudinary, isCloudinaryConfigured } from '../../../lib/cloudinary';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
];

export default function AdminHeader({ 
  adminName = 'Hammad Riaz',
  adminAvatar,
  onLogout,
  onToggleMobileSidebar
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Avatar Management State
  const [currentPhoto, setCurrentPhoto] = useState(
    adminAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  );
  const [inputUrl, setInputUrl] = useState('');
  const [avatarTab, setAvatarTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const fileInputRef = useRef(null);

  // Sync avatar from props or settings
  useEffect(() => {
    if (adminAvatar) {
      setCurrentPhoto(adminAvatar);
      setImageError(false);
    } else {
      const s = getDealershipSettings();
      if (s?.adminAvatar) {
        setCurrentPhoto(s.adminAvatar);
        setImageError(false);
      }
    }
  }, [adminAvatar]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle Local File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    try {
      const cldRes = await uploadToCloudinary(file);
      if (cldRes?.success && cldRes.url) {
        applyNewPhoto(cldRes.url);
        return;
      }

      const compressedDataUrl = await compressImage(file, 300, 0.82);
      if (compressedDataUrl) {
        applyNewPhoto(compressedDataUrl);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          applyNewPhoto(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply & Save new photo
  const applyNewPhoto = (url) => {
    if (!url) return;
    setCurrentPhoto(url);
    setImageError(false);
    
    // Save to Dealership settings in storage
    const currentSettings = getDealershipSettings();
    saveDealershipSettings({
      ...currentSettings,
      adminAvatar: url
    });

    setIsAvatarModalOpen(false);
  };

  // Get initials (HR for Hammad Riaz)
  const getInitials = (name) => {
    if (!name) return 'HR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="h-14 sm:h-16 px-3 sm:px-6 lg:px-8 bg-transparent flex items-center justify-between gap-2">
        {/* Left Greeting & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 -ml-1 text-gray-700 hover:text-black hover:bg-gray-200/60 rounded-lg transition cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-sm sm:text-lg md:text-2xl font-normal text-gray-800 tracking-tight truncate">
            Hi, <span className="font-semibold text-gray-900">{adminName}</span>
          </h1>
        </div>

        {/* Right Controls: Fullscreen, Language, User Profile Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
            className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-gray-100 items-center justify-center text-gray-600 hover:text-black transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={18} />}
          </button>

          {/* Live Public Website Shortcut Icon */}
          <Link
            href="/"
            title="View Live Website (/)"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#4b6ba3] transition cursor-pointer group"
            aria-label="View Live Website"
          >
            <Globe size={18} className="group-hover:scale-110 transition-transform" />
          </Link>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-gray-300 transition cursor-pointer"
            >
              {/* Avatar Photo */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#4b6ba3] relative border border-gray-300 shadow-xs flex items-center justify-center text-white font-bold text-xs">
                {!imageError && currentPhoto ? (
                  <Image 
                    src={currentPhoto}
                    alt={adminName}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>{getInitials(adminName)}</span>
                )}
              </div>
              <ChevronDown size={14} className="text-gray-600" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <div className="font-bold text-gray-900 text-sm">{adminName}</div>
                  <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <UserCheck size={12} className="text-emerald-600" />
                    <span>Managing Director / Super Admin</span>
                  </div>
                  <div className="text-gray-400 text-[10px] flex items-center gap-1 mt-1">
                    <Building2 size={11} />
                    <span>3BrosMotor .LTD • Dar es Salaam, Tanzania</span>
                  </div>
                </div>

                <div className="py-1">
                  {/* Change Profile Photo Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsAvatarModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-[#4b6ba3] flex items-center gap-2 font-bold cursor-pointer"
                  >
                    <Camera size={14} />
                    <span>Change Profile Photo</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Profile Photo Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-[#4b6ba3]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  Change Profile Photo ({adminName})
                </h3>
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Photo Preview */}
            <div className="flex flex-col items-center justify-center mb-5">
              <div className="w-20 h-20 rounded-full overflow-hidden relative border-3 border-[#4b6ba3] shadow-md bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xl">
                {!imageError && currentPhoto ? (
                  <Image
                    src={currentPhoto}
                    alt={adminName}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>{getInitials(adminName)}</span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-700 mt-2">{adminName}</span>
              <span className="text-[11px] text-gray-400">Managing Director Profile Avatar</span>
            </div>

            {/* Selection Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-semibold mb-4">
              <button
                type="button"
                onClick={() => setAvatarTab('upload')}
                className={`flex-1 py-1.5 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  avatarTab === 'upload' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload size={13} />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('url')}
                className={`flex-1 py-1.5 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  avatarTab === 'url' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LinkIcon size={13} />
                <span>Image URL</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('presets')}
                className={`flex-1 py-1.5 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  avatarTab === 'presets' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Check size={13} />
                <span>Presets</span>
              </button>
            </div>

            {/* Tab 1: Upload from Device */}
            {avatarTab === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#4b6ba3] rounded-xl p-6 text-center cursor-pointer transition bg-gray-50/50 hover:bg-blue-50/30"
                >
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs font-bold text-gray-700">Click to select photo from phone or computer</p>
                  <p className="text-[11px] text-gray-400 mt-1">Supports PNG, JPG, or WEBP (automatically optimized)</p>
                </div>
              </div>
            )}

            {/* Tab 2: Paste Image URL */}
            {avatarTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Direct Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-[#4b6ba3]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!inputUrl.trim()) return;
                    applyNewPhoto(inputUrl.trim());
                  }}
                  disabled={!inputUrl.trim()}
                  className="w-full bg-[#111827] hover:bg-black disabled:bg-gray-300 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer"
                >
                  Set as Profile Photo
                </button>
              </div>
            )}

            {/* Tab 3: Presets */}
            {avatarTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Select an executive portrait preset:</p>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyNewPhoto(preset)}
                      className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition cursor-pointer hover:scale-105 ${
                        currentPhoto === preset ? 'border-[#4b6ba3] ring-2 ring-blue-300' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Close footer */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
