'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Paperclip, Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSelectFile: (file: File) => void;
  disabled: boolean;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit matching Spring Boot multipart config

export function ChatInput({ onSendMessage, onSelectFile, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  }, [text, disabled, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Guards against premature sending during Asian character IME compositions
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds the 100MB upload limit.');
        e.target.value = '';
        return;
      }
      onSelectFile(file);
      e.target.value = '';
    }
  };

  return (
    <div className="px-8 pb-8 pt-4 bg-transparent z-10">
      <div className="bg-white/85 backdrop-blur-2xl border border-slate-200/80 rounded-[24px] p-2 pl-6 pr-3 flex items-center gap-3 shadow-[0_8px_30px_-5px_rgba(16,185,129,0.08)] focus-within:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.18)] focus-within:border-emerald-500/40 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all duration-300">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*,application/pdf,text/plain"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Send Photo, Video or File"
          className="text-slate-400 hover:text-emerald-700 transition-colors shrink-0"
        >
          <Paperclip className="w-5 h-5 rotate-45" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your message or caption..."
          className="w-full bg-transparent border-none focus:outline-none text-[15px] placeholder-slate-400 text-slate-800 font-medium tracking-tight"
        />

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-[0_6px_15px_-3px_rgba(15,23,42,0.4)] hover:bg-emerald-900 hover:shadow-[0_8px_20px_-3px_rgba(6,78,59,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:hover:-translate-y-0 disabled:shadow-none"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}