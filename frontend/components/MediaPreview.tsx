'use client';

import React, { useState, useEffect } from 'react';
import { formatBytes } from '@/lib/utils';
import { X, FileText, Video } from 'lucide-react';

interface MediaPreviewProps {
  file: File | null;
  onClear: () => void;
}

export function MediaPreview({ file, onClear }: MediaPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Revokes the created object URL upon unmount or file replacement to prevent memory leaks
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="px-8 pt-2 pb-0 z-10">
      <div className="bg-white/95 backdrop-blur-md border border-emerald-500/20 rounded-[20px] p-2.5 px-4 flex items-center justify-between shadow-sm animate-message-in ring-1 ring-emerald-500/10">
        <div className="flex items-center gap-3 overflow-hidden">
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-11 h-11 rounded-[12px] object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-[12px] bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center shrink-0">
              {isVideo ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[280px]">
              {file.name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {formatBytes(file.size)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ImageLightbox({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
    >
      <img
        src={src}
        alt="Enlarged preview"
        className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-white/20"
      />
    </div>
  );
}