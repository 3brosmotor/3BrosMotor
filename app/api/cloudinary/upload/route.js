import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const isTest = formData.get('isTest') === 'true';
    const customCloudName = (formData.get('cloudName') || CLOUD_NAME || '').trim();
    const customApiKey = (formData.get('apiKey') || API_KEY || '').trim();
    const customApiSecret = (formData.get('apiSecret') || API_SECRET || '').trim();
    const customPreset = (formData.get('uploadPreset') || '').trim();
    const file = formData.get('file');

    // Handle connection test requests safely on the server side
    if (isTest) {
      if (!customCloudName || !customPreset) {
        return NextResponse.json({
          success: false,
          error: 'Please enter both Cloud Name and an Unsigned Upload Preset.'
        });
      }

      try {
        const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const cldFormData = new FormData();
        cldFormData.append('file', file || tinyPng);
        cldFormData.append('upload_preset', customPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${customCloudName}/image/upload`, {
          method: 'POST',
          body: cldFormData,
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && (data.secure_url || data.url)) {
          return NextResponse.json({
            success: true,
            url: data.secure_url || data.url,
            message: 'Connected successfully! Cloudinary is ready to store vehicle photos.'
          });
        }

        const errMsg = data?.error?.message || `Cloudinary returned error (${res.status}). Verify your Cloud Name and Unsigned Preset.`;
        return NextResponse.json({
          success: false,
          error: errMsg
        });
      } catch {
        return NextResponse.json({
          success: false,
          error: 'Could not connect to Cloudinary servers. Verify Cloud Name spelling.'
        });
      }
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // 1. Direct unsigned upload if upload_preset is available
    if (customCloudName && customPreset) {
      try {
        const cldFormData = new FormData();
        cldFormData.append('file', file);
        cldFormData.append('upload_preset', customPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${customCloudName}/image/upload`, {
          method: 'POST',
          body: cldFormData,
        });

        const data = await res.json();
        if (res.ok && (data.secure_url || data.url)) {
          return NextResponse.json({
            success: true,
            url: data.secure_url || data.url,
            publicId: data.public_id,
            format: data.format,
            bytes: data.bytes
          });
        }
      } catch (err) {
        // Continue to signed check or fallback
      }
    }

    // 2. Signed upload if server API secret and key exist
    if (customCloudName && customApiKey && customApiSecret) {
      const timestamp = Math.round(Date.now() / 1000);
      const strToSign = `timestamp=${timestamp}${customApiSecret}`;
      const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

      const cldFormData = new FormData();
      cldFormData.append('file', file);
      cldFormData.append('api_key', customApiKey);
      cldFormData.append('timestamp', String(timestamp));
      cldFormData.append('signature', signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${customCloudName}/image/upload`, {
        method: 'POST',
        body: cldFormData,
      });

      const data = await res.json();

      if (res.ok && (data.secure_url || data.url)) {
        return NextResponse.json({
          success: true,
          url: data.secure_url || data.url,
          publicId: data.public_id,
          format: data.format,
          bytes: data.bytes
        });
      }

      return NextResponse.json({
        success: false,
        fallbackToLocal: true,
        error: data?.error?.message || 'Cloudinary rejected upload'
      }, { status: 200 });
    }

    // 3. Cloudinary server credentials not configured.
    // Return friendly status so the client seamlessly processes and saves the image locally without error.
    return NextResponse.json({ 
      success: false, 
      fallbackToLocal: true,
      error: 'Cloudinary server credentials not configured. Falling back to local storage.' 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      fallbackToLocal: true,
      error: error instanceof Error ? error.message : 'Server error during upload'
    }, { status: 200 });
  }
}
