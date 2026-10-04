'use client';

import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/types';
import { formatBytes, formatTimestamp } from '@/lib/utils';
import { CheckCheck, FileText } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  onImageClick: (url: string) => void;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isMine,
  onImageClick,
}: MessageBubbleProps) {
  const time = useMemo(() => formatTimestamp(message.timestamp), [message.timestamp]);

  const renderMedia = () => {
    if (!message.mediaUrl) return null;

    if (message.type === 'IMAGE') {
      return (
        <div className="mb-2 relative rounded-[16px] overflow-hidden">
          <img
            src={message.mediaUrl}
            alt={message.fileName || 'Photo'}
            loading="lazy"
            onClick={() => onImageClick(message.mediaUrl!)}
            className={`rounded-[16px] max-w-full max-h-72 object-cover cursor-pointer hover:opacity-95 transition-opacity border ${
              isMine ? 'border-slate-700/60' : 'border-slate-200/60'
            }`}
          />
        </div>
      );
    }

    if (message.type === 'VIDEO') {
      return (
        <div className="mb-2">
          <video
            src={message.mediaUrl}
            controls
            preload="metadata"
            className={`rounded-[16px] max-w-full max-h-72 outline-none border ${
              isMine ? 'border-slate-700/60' : 'border-slate-200/60'
            }`}
          />
        </div>
      );
    }

    if (message.type === 'FILE') {
      return (
        <a
          href={message.mediaUrl}
          download={message.fileName || 'file'}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 p-2.5 rounded-[16px] mb-2 no-underline transition-all ${
            isMine ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              isMine ? 'bg-white/20' : 'bg-white'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-[13px] font-semibold truncate max-w-[190px]">
              {message.fileName || 'Attachment'}
            </span>
            <span className="text-[11px] opacity-70">{formatBytes(message.fileSize)}</span>
          </div>
        </a>
      );
    }

    return null;
  };

  return (
    <div className={`flex w-full animate-message-in ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex gap-3 max-w-[75%] items-end group ${
          isMine ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`w-9 h-9 shrink-0 overflow-hidden border-[2px] border-white shadow-sm flex items-center justify-center text-xs font-bold relative ${
            isMine
              ? 'rounded-full bg-slate-200 text-slate-700'
              : 'rounded-[14px] bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700'
          }`}
        >
          {message.avatarUrl ? (
            <Image src={message.avatarUrl} alt={message.sender} fill sizes="36px" className="object-cover" />
          ) : isMine ? (
            <Image
              src="https://i.pravatar.cc/150?img=5"
              alt={message.sender}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            message.sender.charAt(0).toUpperCase()
          )}
        </div>

        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
          <div
            className={`text-[13px] font-bold text-slate-500 mb-1.5 tracking-tight ${
              isMine ? 'mr-1' : 'ml-1'
            }`}
          >
            {message.sender}
          </div>

          <div
            className={`p-4 py-3.5 rounded-[22px] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] mb-1.5 border transform transition-transform duration-300 hover:scale-[1.01] ${
              isMine
                ? 'bg-slate-900 text-white rounded-br-[6px] border-slate-700/50 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.3)] origin-bottom-right'
                : 'bg-white text-slate-800 rounded-bl-[6px] border-slate-100 origin-bottom-left'
            }`}
          >
            {renderMedia()}
            {message.content && (
              <p className="text-[15px] leading-relaxed font-normal tracking-tight">
                {message.content}
              </p>
            )}
          </div>

          <div
            className={`flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 ${
              isMine ? 'justify-end pr-1' : 'justify-start pl-1'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="ml-1 tracking-wide">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
});