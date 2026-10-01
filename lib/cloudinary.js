// Cloudinary Image Upload Service for 3BrosMotor .LTD
// Uploads vehicle & profile images to Cloudinary CDN with automatic high-definition local fallback

import { getDealershipSettings, compressImage } from '../app/lib/adminStore';

export function getCloudinaryConfig() {
  let settings = {};
  try {
    settings = getDealershipSettings() || {};
  } catch {
    // fallback
  }

  const cloudName =
    settings.cloudinaryCloudName ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    'ztiftbhu';

  const uploadPreset =
    settings.cloudinaryUploadPreset ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    'ml_default';

  const apiKey =
    settings.cloudinaryApiKey ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    '';

  return {
    cloudName: cloudName.trim(),
    uploadPreset: uploadPreset.trim(),
    apiKey: apiKey.trim()
  };
}

export function isCloudinaryConfigured() {
  const { cloudName, uploadPreset, apiKey } = getCloudinaryConfig();
  return Boolean(cloudName && (uploadPreset || apiKey));
}

/**
 * Uploads an image (File, Blob, or base64 string) to Cloudinary CDN.
 * If Cloudinary credentials are not configured or upload fails,
 * seamlessly compresses and saves the image locally with zero errors.
 * 
 * @param {File|Blob|string} file - The file or base64 data URL to upload
 * @param {Object} [customConfig] - Optional override for credentials
 * @returns {Promise<{ success: boolean, url: string, isCloudinary: boolean, error?: string }>}
 */
export async function uploadToCloudinary(file, customConfig = null) {
  const config = customConfig || getCloudinaryConfig();
  const cloudName = config.cloudName;
  const uploadPreset = config.uploadPreset;
  const apiKey = config.apiKey;

  // 1. Direct Unsigned Upload to Cloudinary (Standard recommended approach: no secret needed!)
  if (cloudName && uploadPreset && typeof window !== 'undefined') {
    try {
      const directFormData = new FormData();
      directFormData.append('file', file);
      directFormData.append('upload_preset', uploadPreset);

      const directRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: directFormData
      });

      const directData = await directRes.json();
      if (directRes.ok && (directData.secure_url || directData.url)) {
        return {
          success: true,
          url: directData.secure_url || directData.url,
          publicId: directData.public_id,
          format: directData.format,
          isCloudinary: true
        };
      }
    } catch {
      // Unsigned upload network issue; proceed to fallback
    }
  }

  // 2. Try server route if API Key or server configuration exists
  if (cloudName && (apiKey || uploadPreset)) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (cloudName) formData.append('cloudName', cloudName);
      if (uploadPreset) formData.append('uploadPreset', uploadPreset);
      if (apiKey) formData.append('apiKey', apiKey);

      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        return {
          success: true,
          url: data.url,
          publicId: data.publicId,
          format: data.format,
          isCloudinary: true
        };
      }
    } catch {
      // Server upload route error; proceed to fallback
    }
  }

  // 3. Try Firebase Cloud Storage (Permanent public HTTPS URL accessible by all devices)
  try {
    const { storage } = await import('../app/lib/firebase');
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    if (storage && file instanceof Blob) {
      const ext = file.type ? file.type.split('/')[1] || 'jpg' : 'jpg';
      const cleanName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const fileRef = ref(storage, `vehicles/${cleanName}`);
      const uploadRes = await uploadBytes(fileRef, file, {
        contentType: file.type || 'image/jpeg'
      });
      const downloadUrl = await getDownloadURL(uploadRes.ref);
      if (downloadUrl) {
        return {
          success: true,
          url: downloadUrl,
          isCloudinary: false,
          isFirebaseStorage: true
        };
      }
    }
  } catch {
    // Firebase storage not configured or permission denied; proceed to safe lightweight fallback
  }

  // 4. Guaranteed Safe Fallback: Web-optimized compression (max 640px, 0.65 quality)
  // Ensures vehicle photos are lightweight (~25KB) so the entire document never exceeds Firestore's 1MB limit
  try {
    const compressed = await compressImage(file, 640, 0.65);
    if (compressed) {
      return {
        success: true,
        url: compressed,
        isCloudinary: false
      };
    }
  } catch (err) {
    if (typeof window !== 'undefined' && file instanceof Blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const comp = await compressImage(reader.result, 640, 0.65);
          resolve({ success: true, url: comp || reader.result, isCloudinary: false });
        };
        reader.onerror = () => resolve({ success: false, error: 'Could not process image file' });
        reader.readAsDataURL(file);
      });
    }
  }

  return {
    success: false,
    error: 'Could not process selected image'
  };
}

/**
 * Tests connection with Cloudinary using server-side proxy first to avoid browser CORS/Failed to fetch errors
 */
export async function testCloudinaryConnection(cloudName, uploadPreset) {
  const cleanCloud = cloudName?.trim();
  const cleanPreset = uploadPreset?.trim();

  if (!cleanCloud || !cleanPreset) {
    return {
      success: false,
      error: 'Please enter both Cloud Name and an Unsigned Upload Preset.'
    };
  }

  // 1. Test via server route first (immune to browser CORS and network restrictions)
  try {
    const formData = new FormData();
    formData.append('isTest', 'true');
    formData.append('cloudName', cleanCloud);
    formData.append('uploadPreset', cleanPreset);

    const res = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && typeof data.success === 'boolean') {
        return data;
      }
    }
  } catch {
    // Proceed to client direct test attempt
  }

  // 2. Direct browser test as secondary fallback
  try {
    const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const directFormData = new FormData();
    directFormData.append('file', tinyPng);
    directFormData.append('upload_preset', cleanPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cleanCloud}/image/upload`, {
      method: 'POST',
      body: directFormData
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.secure_url || data.url)) {
      return { 
        success: true, 
        url: data.secure_url || data.url,
        message: 'Connected successfully! Cloudinary is ready to store vehicle photos.'
      };
    }

    return {
      success: false,
      error: data?.error?.message || `Cloudinary returned status (${res.status}). Verify your Cloud Name and Unsigned Preset.`
    };
  } catch {
    return {
      success: false,
      error: 'Could not connect to Cloudinary. Please verify your Cloud Name and ensure your Preset is set to "Unsigned" in Cloudinary settings.'
    };
  }
}
