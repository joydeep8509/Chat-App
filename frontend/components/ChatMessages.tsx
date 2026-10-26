'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { MessageSquareText } from 'lucide-react';

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentSender: string;
  onImageClick: (url: string) => void;
  onDeleteMessage?: (id: number | string) => void;
}

export function ChatMessages({
  messages,
  currentSender,
  onImageClick,
  onDeleteMessage,
}: ChatMessagesProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  const handleScroll = useCallback(() => {
    if (!feedRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 150;
  }, []);

  useEffect(() => {
    if (feedRef.current && isNearBottomRef.current) {
      feedRef.current.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div
      ref={feedRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 md:py-6 space-y-4 sm:space-y-6 scroll-smooth flex flex-col"
    >
      <div className="text-center text-xs text-emerald-800/60 font-semibold tracking-widest uppercase py-2 shrink-0">
        Connected to Design Chat WebSocket
      </div>
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-75 mt-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-200/60">
            <MessageSquareText className="w-8 h-8" />
          </div>
          <h3 className="text-slate-800 font-semibold text-lg mb-1">Welcome to the Chat Hub!</h3>
          <p className="text-slate-500 text-[15px] flex items-center gap-2 mt-1">
            Send photos, videos, or messages in real time.
          </p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={msg.id ?? `${msg.sender}-${index}-${msg.timestamp}`}
            message={msg}
            isMine={msg.sender === currentSender && currentSender !== ''}
            onImageClick={onImageClick}
            onDelete={onDeleteMessage}
          />
        ))
      )}
    </div>
  );
}