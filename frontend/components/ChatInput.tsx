'use client';

import React, { useState, useRef } from 'react';
import { Paperclip, Mic, Send } from 'lucide-react';

const MAX_SIZE = 100 * 1024 * 1024;

export function ChatInput({ onSendMessage, onSelectFile, disabled }: {
  onSendMessage: (text: string) => void;
  onSelectFile: (file: File) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const send = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE) alert('File size exceeds the 100MB limit.');
    else onSelectFile(file);
    e.target.value = '';
  };

  return (
    <div className="w-full px-3 sm:px-6 md:px-8 pb-3 sm:pb-6 md:pb-8 pt-2 sm:pt-4 z-10 shrink-0">
      <div className="bg-white/85 backdrop-blur-2xl border border-slate-200/80 rounded-[24px] p-2 pl-3 sm:pl-6 pr-2 sm:pr-3 flex items-center gap-2 sm:gap-3 shadow-sm focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/40 transition-all">
        <input type="file" ref={fileRef} onChange={handleFile} accept="image/*,video/*,application/pdf,text/plain" className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} title="Attach file" className="text-slate-400 hover:text-emerald-700 shrink-0">
          <Paperclip className="w-5 h-5 rotate-45" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => !e.nativeEvent.isComposing && e.key === 'Enter' && (e.preventDefault(), send())}
          placeholder="Your message or caption..."
          className="w-full min-w-0 bg-transparent border-none focus:outline-none text-[14px] sm:text-[15px] placeholder-slate-400 text-slate-800 font-medium"
        />
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button type="button" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-slate-700">
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={send}
            disabled={disabled || !text.trim()}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-emerald-900 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}