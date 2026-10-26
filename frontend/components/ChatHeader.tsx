'use client';

import React from 'react';
import { Search, Phone, MoreVertical } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="px-4 py-3 md:px-8 md:py-6 border-b border-slate-200/60 flex justify-between items-center bg-white/60 backdrop-blur-xl z-10 shrink-0">
      <div>
        <h1 className="text-[18px] md:text-[22px] font-bold text-slate-900 leading-tight tracking-tight">
          Real-Time chat-hub
        </h1>
        <p className="text-[12px] md:text-[14px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          Global Room, currently online
        </p>
      </div>
      <div className="flex items-center gap-1 sm:gap-3 text-slate-400">
        <button
          type="button"
          className="p-1.5 sm:p-2 rounded-full hover:text-slate-800 hover:bg-slate-200/50 transition-all duration-200"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          className="p-1.5 sm:p-2 rounded-full hover:text-slate-800 hover:bg-slate-200/50 transition-all duration-200"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          className="p-1.5 sm:p-2 rounded-full hover:text-slate-800 hover:bg-slate-200/50 transition-all duration-200"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}