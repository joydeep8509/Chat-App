'use client';

import React, { memo, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/types';
import { formatBytes, formatTimestamp } from '@/lib/utils';
import { CheckCheck, FileText, Trash2 } from 'lucide-react';

export const MessageBubble = memo(function MessageBubble({
  message,
  isMine,
  onImageClick,
  onDelete,
}: {
  message: ChatMessage;
  isMine: boolean;
  onImageClick: (url: string) => void;
  onDelete?: (id: number | string) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const time = useMemo(() => formatTimestamp(message.timestamp), [message.timestamp]);
  const avatar = message.avatarUrl || (isMine ? 'https://i.pravatar.cc/150?img=5' : null);

  return (
    <>
      <div className={`flex w-full animate-message-in ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%] items-end ${isMine ? 'flex-row-reverse' : 'flex-row'} group`}>
          {/* Avatar */}
          <div className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold relative ${
            isMine ? 'rounded-full bg-slate-200 text-slate-700' : 'rounded-[14px] bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700'
          }`}>
            {avatar ? (
              <Image src={avatar} alt={message.sender} fill sizes="36px" className="object-cover" />
            ) : (
              message.sender.charAt(0).toUpperCase()
            )}
          </div>

          {/* Bubble Box */}
          <div className={`flex flex-col min-w-0 ${isMine ? 'items-end' : 'items-start'}`}>
            <span className={`text-[12px] sm:text-[13px] font-bold text-slate-500 mb-1 ${isMine ? 'mr-1' : 'ml-1'}`}>
              {message.sender}
            </span>
            <div className={`p-3 sm:p-4 py-2.5 sm:py-3.5 rounded-[22px] shadow-sm mb-1 border transition-transform duration-200 hover:scale-[1.01] ${
              isMine ? 'bg-slate-900 text-white rounded-br-[6px] border-slate-700/50' : 'bg-white text-slate-800 rounded-bl-[6px] border-slate-100'
            }`}>
              {message.mediaUrl && message.type === 'IMAGE' && (
                <img
                  src={message.mediaUrl}
                  alt={message.fileName || 'Photo'}
                  loading="lazy"
                  onClick={() => onImageClick(message.mediaUrl!)}
                  className="rounded-[16px] max-w-full max-h-56 sm:max-h-72 w-auto object-contain cursor-pointer mb-2 border border-black/10"
                />
              )}
              {message.mediaUrl && message.type === 'VIDEO' && (
                <video
                  src={message.mediaUrl}
                  controls
                  preload="metadata"
                  className="rounded-[16px] max-w-full max-h-56 sm:max-h-72 mb-2 border border-black/10"
                />
              )}
              {message.mediaUrl && message.type === 'FILE' && (
                <a
                  href={message.mediaUrl}
                  download={message.fileName || 'file'}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 p-2.5 rounded-[16px] mb-2 ${
                    isMine ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[13px] font-semibold truncate max-w-[170px] sm:max-w-[190px]">
                      {message.fileName || 'Attachment'}
                    </span>
                    <span className="text-[11px] opacity-70">{formatBytes(message.fileSize)}</span>
                  </div>
                </a>
              )}
              {message.content && (
                <p className="text-[14px] sm:text-[15px] leading-relaxed break-words">{message.content}</p>
              )}
            </div>

            {/* Actions & Timestamp */}
            <div className={`flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-slate-400 ${isMine ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
              {isMine && message.id != null && onDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                  title="Delete message"
                  className="opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 active:scale-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* On-Screen Delete Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-message-in cursor-default"
          onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
        >
          <div
            className="bg-white rounded-[26px] p-6 max-w-[320px] w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3 shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Delete message?</h4>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-5">
              This message will be permanently removed for everyone in the chat.
            </p>
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-[13px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setShowConfirm(false); if (message.id) onDelete?.(message.id); }}
                className="flex-1 py-2.5 rounded-full text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/25 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default MessageBubble;