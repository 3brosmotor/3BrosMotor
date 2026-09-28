'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { uploadToCloudinary, isCloudinaryConfigured, getCloudinaryConfig } from '../../../lib/cloudinary';

export default function CloudinaryUploadButton({
  currentUrl,
  onUploadSuccess,
  label = "Upload Vehicle Photo",
  className = ""
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successStatus, setSuccessStatus] = useState(null); // 'cloudinary' | 'local' | null
  const fileInputRef = useRef(null);

  const isConfigured = isCloudinaryConfigured();
  const { cloudName } = getCloudinaryConfig();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);
    setSuccessStatus(null);

    try {
      const result = await uploadToCloudinary(file);
      if (result.success && result.url) {
        onUploadSuccess(result.url);
        setSuccessStatus(result.isCloudinary ? 'cloudinary' : 'local');
        setTimeout(() => setSuccessStatus(null), 5000);
      } else {
        setErrorMsg(result.error || 'Failed to process image');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#1c459c] hover:bg-blue-100 font-semibold text-xs transition cursor-pointer disabled:opacity-50 shadow-xs"
        >
          {isUploading ? (
            <>
              <Loader2 size={14} className="animate-spin text-blue-600" />
              <span>Optimizing & Uploading Photo...</span>
            </>
          ) : (
            <>
              <UploadCloud size={14} className="text-blue-600" />
              <span>{label}</span>
            </>
          )}
        </button>

        {isConfigured ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 size={11} />
            <span>Cloudinary CDN Active ({cloudName})</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200" title="Photos are automatically optimized and saved with high definition">
            <ImageIcon size={11} className="text-blue-500" />
            <span>Direct Photo Upload Ready</span>
          </span>
        )}
      </div>

      {successStatus === 'cloudinary' && (
        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
          <CheckCircle2 size={12} />
          <span>Uploaded directly to Cloudinary global CDN!</span>
        </div>
      )}

      {successStatus === 'local' && (
        <div className="text-[11px] text-blue-700 font-medium flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
          <CheckCircle2 size={12} />
          <span>Photo uploaded and optimized in high resolution!</span>
        </div>
      )}

      {errorMsg && (
        <div className="text-[11px] text-red-600 font-medium flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded">
          <AlertCircle size={12} />
          <span>{errorMsg}</span>
        </div>
      )}

      {currentUrl && currentUrl.startsWith('https://res.cloudinary.com') && (
        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono truncate">
          <span className="text-blue-600 font-bold">Cloudinary CDN:</span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-0.5 text-blue-600 truncate max-w-xs"
          >
            {currentUrl}
            <ExternalLink size={9} />
          </a>
        </div>
      )}
    </div>
  );
}
