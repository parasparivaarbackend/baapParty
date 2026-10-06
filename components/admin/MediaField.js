'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Field, inputClass } from './ui';
import { isYouTubeUrl } from '@/lib/youtube';

const toggleBtn = (active) =>
  `flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
    active ? 'border-saffron bg-saffron text-white' : 'border-ink/10 text-ink-soft hover:border-saffron hover:text-saffron'
  }`;

const fileLabel = (error) =>
  `flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm ${
    error ? 'border-saffron-dark' : 'border-ink/15 hover:border-saffron'
  }`;

/**
 * Lets an admin either paste a link OR upload a local file for an
 * event/blog-post's media — as an image, or as a video (YouTube link or
 * uploaded video file, with an optional thumbnail image).
 *
 * Props:
 *  - mediaType: 'image' | 'video', onMediaTypeChange(type)
 *  - image: current image/thumbnail URL, onImageChange(url)
 *  - videoUrl: current video URL, onVideoUrlChange(url)
 *  - folder: subfolder under /public/uploads to save files into
 *  - errors: { image, videoUrl }
 */
export default function MediaField({
  mediaType,
  onMediaTypeChange,
  image,
  onImageChange,
  videoUrl,
  onVideoUrlChange,
  folder = 'misc',
  errors = {},
}) {
  const [imageMode, setImageMode] = useState(image && image.startsWith('/uploads/') ? 'upload' : 'link');
  const [videoMode, setVideoMode] = useState(videoUrl && !isYouTubeUrl(videoUrl) ? 'upload' : 'youtube');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const uploadFile = async (file, sub) => {
    const body = new FormData();
    body.append('file', file);
    body.append('folder', sub);
    const res = await fetch('/api/upload', { method: 'POST', body });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      onImageChange(await uploadFile(file, folder));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoFile = async (file) => {
    if (!file) return;
    setUploadingVideo(true);
    try {
      onVideoUrlChange(await uploadFile(file, folder));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbFile = async (file) => {
    if (!file) return;
    setUploadingThumb(true);
    try {
      onImageChange(await uploadFile(file, folder));
    } finally {
      setUploadingThumb(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Media Type">
        <div className="flex gap-2.5">
          {[
            { key: 'image', label: 'Photo' },
            { key: 'video', label: 'Video' },
          ].map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => onMediaTypeChange(t.key)}
              className={toggleBtn(mediaType === t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Field>

      {mediaType === 'image' ? (
        <>
          <Field label="Image Source">
            <div className="flex gap-2.5">
              {[
                { key: 'link', label: 'Link' },
                { key: 'upload', label: 'Upload File' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => setImageMode(s.key)}
                  className={toggleBtn(imageMode === s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>

          {imageMode === 'link' ? (
            <Field label="Image URL" error={errors.image}>
              <input
                className={inputClass(errors.image)}
                value={image}
                onChange={(e) => onImageChange(e.target.value)}
                placeholder="https://..."
              />
            </Field>
          ) : (
            <Field
              label="Image File"
              error={errors.image}
              hint={uploadingImage ? 'Uploading...' : image?.startsWith('/uploads/') ? 'Uploaded ✓' : undefined}
            >
              <label className={fileLabel(errors.image)}>
                <Upload size={16} className="text-ink-soft" />
                <span className="truncate text-ink-soft">
                  {uploadingImage
                    ? 'Uploading...'
                    : image?.startsWith('/uploads/')
                    ? image.split('/').pop()
                    : 'Choose an image file...'}
                </span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files?.[0])}
                />
              </label>
            </Field>
          )}
        </>
      ) : (
        <>
          <Field label="Video Source">
            <div className="flex gap-2.5">
              {[
                { key: 'youtube', label: 'YouTube Link' },
                { key: 'upload', label: 'Upload File' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => setVideoMode(s.key)}
                  className={toggleBtn(videoMode === s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>

          {videoMode === 'youtube' ? (
            <Field label="YouTube Link" error={errors.videoUrl} hint="Paste any youtube.com or youtu.be video link.">
              <input
                className={inputClass(errors.videoUrl)}
                value={videoUrl}
                onChange={(e) => onVideoUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </Field>
          ) : (
            <Field
              label="Video File"
              error={errors.videoUrl}
              hint={uploadingVideo ? 'Uploading...' : videoUrl?.startsWith('/uploads/') ? 'Uploaded ✓' : undefined}
            >
              <label className={fileLabel(errors.videoUrl)}>
                <Upload size={16} className="text-ink-soft" />
                <span className="truncate text-ink-soft">
                  {uploadingVideo
                    ? 'Uploading...'
                    : videoUrl?.startsWith('/uploads/')
                    ? videoUrl.split('/').pop()
                    : 'Choose a video file...'}
                </span>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoFile(e.target.files?.[0])}
                />
              </label>
            </Field>
          )}

          <Field
            label="Thumbnail Image (optional)"
            hint={
              uploadingThumb
                ? 'Uploading...'
                : "Shown as the preview image before playing. Auto-used from YouTube if left blank."
            }
          >
            <label className={fileLabel()}>
              <Upload size={16} className="text-ink-soft" />
              <span className="truncate text-ink-soft">
                {uploadingThumb
                  ? 'Uploading...'
                  : image
                  ? image.startsWith('/uploads/')
                    ? image.split('/').pop()
                    : 'Thumbnail set'
                  : 'Choose a thumbnail image...'}
              </span>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleThumbFile(e.target.files?.[0])}
              />
            </label>
          </Field>
        </>
      )}
    </div>
  );
}
