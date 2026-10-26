'use client';

import React, { useState, useEffect } from 'react';
import { formatBytes } from '@/lib/utils';
import { X, FileText, Video } from 'lucide-react';

export function MediaPreview({ file, onClear }: { file: File | null; onClear: () => void }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file?.type.startsWith('image/')) return setUrl(null);
    const objUrl = URL.createObjectURL(file);
    setUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [file]);

  if (!file) return null;

  return (
    <div className="w-full px-3 sm:px-6 md:px-8 pt-2 z-10 shrink-0">
      <div className="w-full bg-white/95 backdrop-blur-md border border-emerald-500/20 rounded-[20px] p-2.5 px-3 sm:px-4 flex items-center justify-between shadow-sm animate-message-in ring-1 ring-emerald-500/10">
        <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
          {url ? (
            <img src={url} alt="preview" className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] object-cover border border-slate-200 shrink-0" />
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              {file.type.startsWith('video/') ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[13px] font-semibold text-slate-800 truncate">{file.name}</span>
            <span className="text-[11px] text-slate-400 font-medium">{formatBytes(file.size)}</span>
          </div>
        </div>
        <button type="button" onClick={onClear} className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center shrink-0 ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ImageLightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer">
      <img src={src} alt="Preview" className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-white/20" />
    </div>
  );
}