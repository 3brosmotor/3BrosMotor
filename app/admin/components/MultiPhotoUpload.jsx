'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  UploadCloud, 
  Trash2, 
  Star, 
  Plus, 
  Loader2, 
  AlertCircle, 
  Camera, 
  Layers
} from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured, getCloudinaryConfig } from '../../../lib/cloudinary';

export default function MultiPhotoUpload({ 
  images = [], 
  onChange, 
  vehicleInfo = {},
  className = "" 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const isConfigured = isCloudinaryConfigured();
  const { cloudName } = getCloudinaryConfig();

  // Handle multi-file selection
  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);

    const uploadedUrls = [];
    for (let i = 0; i < imageFiles.length; i++) {
      setUploadProgress(`Uploading ${i + 1} of ${imageFiles.length}...`);
      try {
        const res = await uploadToCloudinary(imageFiles[i]);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        }
      } catch {
        // Continue with remaining files
      }
    }

    setIsUploading(false);
    setUploadProgress('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    } else {
      setErrorMsg('Could not upload selected photos. Please check file format or network.');
    }
  };

  // Add image by URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  // Remove photo at index
  const handleRemove = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // Set an image as Cover (index 0)
  const handleSetCover = (indexToCover) => {
    if (indexToCover === 0) return;
    const target = images[indexToCover];
    const remaining = images.filter((_, idx) => idx !== indexToCover);
    onChange([target, ...remaining]);
  };

  // Quick generate sample angles based on make & model
  const handleAddSampleAngles = () => {
    const make = vehicleInfo.make || 'Toyota';
    const model = vehicleInfo.model || 'Hilux';
    const year = vehicleInfo.year || '2022';
    const seed = encodeURIComponent(`${make}-${model}-${year}-${Date.now()}`.toLowerCase());

    const sampleAngles = [
      `https://picsum.photos/seed/${seed}-front/800/600`,
      `https://picsum.photos/seed/${seed}-side/800/600`,
      `https://picsum.photos/seed/${seed}-interior/800/600`,
      `https://picsum.photos/seed/${seed}-rear/800/600`
    ];

    onChange([...images, ...sampleAngles]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input supporting multiple files */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFilesSelect}
        className="hidden"
      />

      {/* Upload Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4b6ba3] hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin text-white" />
                <span>{uploadProgress || 'Uploading Photos...'}</span>
              </>
            ) : (
              <>
                <UploadCloud size={15} />
                <span>Upload Multiple Photos</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleAddSampleAngles}
            disabled={isUploading}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs transition cursor-pointer"
          >
            <Camera size={13} className="text-[#4b6ba3]" />
            <span>Add 4 Demo Angles</span>
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
          <Layers size={13} className="text-[#4b6ba3]" />
          <span>{images.length} {images.length === 1 ? 'photo' : 'photos'} added</span>
          {isConfigured && (
            <span className="text-[10px] text-emerald-600 font-bold ml-1">
              • Cloudinary Active ({cloudName})
            </span>
          )}
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Or paste direct image URL (https://...)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          className="flex-1 border border-gray-300 p-2 rounded-lg font-mono text-xs outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          <Plus size={14} />
          <span>Add URL</span>
        </button>
      </div>

      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-1.5">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {images.map((url, idx) => (
            <div 
              key={idx}
              className={`group relative aspect-[4/3] rounded-lg overflow-hidden border bg-gray-100 shadow-xs transition ${
                idx === 0 ? 'border-amber-400 ring-2 ring-amber-300' : 'border-gray-200'
              }`}
            >
              <Image
                src={url}
                alt={`Vehicle angle ${idx + 1}`}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Cover Badge */}
              {idx === 0 ? (
                <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-wider">
                  <Star size={10} className="fill-white" />
                  <span>Cover Photo</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  title="Make this the Cover Photo"
                  className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-amber-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow opacity-90 transition flex items-center gap-1 cursor-pointer"
                >
                  <Star size={10} />
                  <span>Set Cover</span>
                </button>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Remove photo"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition shadow cursor-pointer"
              >
                <Trash2 size={12} />
              </button>

              {/* Angle Counter */}
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-gray-500 text-xs">
          <UploadCloud size={24} className="mx-auto mb-1.5 text-gray-400" />
          <p className="font-semibold text-gray-700">No photos added yet</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Click &quot;Upload Multiple Photos&quot; or &quot;Add 4 Demo Angles&quot; to give visitors front, interior, and side views.
          </p>
        </div>
      )}
    </div>
  );
}
