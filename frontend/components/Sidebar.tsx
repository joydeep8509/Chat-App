'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserDto } from '@/types';
import { Search, LogOut, ArrowDown, Lock, Pin } from 'lucide-react';

interface SidebarProps {
  user: UserDto;
  onUpdateGuestName: (name: string) => void;
  onLogout: () => void;
}

export function Sidebar({ user, onUpdateGuestName, onLogout }: SidebarProps) {
  const [localName, setLocalName] = useState(user.name);
  const avatarInitials = (localName || user.name || 'ME').substring(0, 2).toUpperCase();

  useEffect(() => {
    setLocalName(user.name);
  }, [user.name]);

  // Debounce server updates by 400ms to eliminate redundant HTTP requests on every keystroke
  useEffect(() => {
    if (!user.isGuest || localName === user.name || !localName.trim()) return;
    const handler = setTimeout(() => {
      onUpdateGuestName(localName.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [localName, user.isGuest, user.name, onUpdateGuestName]);

  return (
    <div className="w-full md:w-[320px] bg-white/50 flex flex-col border-b md:border-b-0 md:border-r border-slate-200/60 z-20 shrink-0 max-h-[145px] md:max-h-none overflow-y-auto md:overflow-visible">
      <div className="p-3 md:p-6 pb-1 md:pb-2">
        <div className="bg-white/70 hover:bg-white focus-within:bg-white backdrop-blur-sm rounded-[16px] md:rounded-[20px] px-3.5 py-2 md:px-4 md:py-3 flex items-center gap-2.5 sm:gap-3 border border-slate-200/80 shadow-sm focus-within:shadow-md focus-within:border-emerald-500/40 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            className="bg-transparent w-full focus:outline-none text-[13px] md:text-[15px] placeholder-slate-400 text-slate-800 font-medium tracking-tight"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="px-3 md:px-6 py-1.5 md:py-2">
        <div className="flex items-center gap-1.5 mb-1.5 ml-1 text-emerald-600">
          <ArrowDown className={`w-3.5 h-3.5 ${user.isGuest ? 'animate-bounce' : ''}`} />
          <span className="text-[11px] md:text-[12px] font-bold uppercase tracking-wider">
            {user.isGuest ? 'Guest User (Editable)' : 'Google Verified (Locked)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <input
              type="text"
              value={localName}
              readOnly={!user.isGuest}
              onChange={(e) => setLocalName(e.target.value)}
              className={`w-full text-[13px] md:text-[14px] rounded-[14px] md:rounded-[16px] px-3.5 py-2 md:px-4 md:py-2.5 pr-8 transition-all font-medium shadow-sm ${
                !user.isGuest
                  ? 'cursor-not-allowed bg-slate-100/80 text-slate-600 select-none border border-slate-200/80'
                  : 'bg-white/60 backdrop-blur-sm border border-slate-200/80 text-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white hover:border-slate-300 placeholder-slate-400'
              }`}
              placeholder="e.g. Joydeep..."
            />
            {!user.isGuest && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="p-2 md:p-2.5 rounded-[12px] md:rounded-[14px] bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-1.5 md:py-2 space-y-2 mt-0.5 md:mt-1">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-[18px] md:rounded-[22px] p-2.5 md:p-3.5 flex items-center gap-2.5 md:gap-3 cursor-pointer relative shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5)] border border-emerald-400/30 group hover:shadow-[0_16px_32px_-8px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-[12px] md:rounded-[14px] flex items-center justify-center text-sm md:text-lg font-bold tracking-wider border border-white/20 shadow-inner overflow-hidden shrink-0 relative">
            {user.picture ? (
              <Image src={user.picture} alt={user.name} fill sizes="48px" className="object-cover" />
            ) : (
              avatarInitials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <h3 className="font-semibold text-[13px] md:text-[15px] truncate tracking-tight">{localName}&apos;s chat</h3>
              <span className="text-[11px] md:text-[12px] text-emerald-50 font-medium">Now</span>
            </div>
            <p className="text-[11px] md:text-[13px] text-emerald-100/90 truncate font-light">Chatting globally...</p>
          </div>
          <div className="absolute right-3 bottom-2.5 md:right-3.5 md:bottom-3 flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-white text-emerald-700 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold shadow-sm">
              1
            </div>
            <Pin className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-200/80" />
          </div>
        </div>
      </div>
    </div>
  );
}