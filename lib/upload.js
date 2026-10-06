import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a File/Blob (from a multipart FormData request) to Cloudinary and
 * returns its public, permanent URL — safe to store in MongoDB and to use
 * directly in <Image>/<video> src, and it survives serverless deploys
 * (Vercel etc.) since nothing is written to the local filesystem.
 *
 * `subfolder` becomes a Cloudinary folder, e.g. saveUploadedFile(file, 'gallery')
 * uploads to `<CLOUDINARY base>/bharatiya-avijit-aawaz-party/gallery/...`.
 */
export async function saveUploadedFile(file, subfolder = '') {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local.'
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const folder = `bharatiya-avijit-aawaz-party${subfolder ? `/${subfolder}` : ''}`;

  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}
