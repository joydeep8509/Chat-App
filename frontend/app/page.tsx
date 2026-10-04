'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { useChatSocket } from '@/hooks/useChatSocket';
import { api } from '@/lib/api';
import { ChatMessage } from '@/types';
import { AuthScreen } from '@/components/AuthScreen';
import { Sidebar } from '@/components/Sidebar';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessages } from '@/components/ChatMessages';
import { ChatInput } from '@/components/ChatInput';
import { MediaPreview } from '@/components/MediaPreview';

// Dynamically loads the image lightbox only when required to reduce initial JS evaluation
const ImageLightbox = dynamic(
  () => import('@/components/MediaPreview').then((mod) => mod.ImageLightbox),
  { ssr: false }
);

export default function Home() {
  const { currentUser, loading, login, updateGuestName, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const handleIncomingMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { isConnected, sendMessage } = useChatSocket(
    Boolean(currentUser),
    handleIncomingMessage
  );

  useEffect(() => {
    if (currentUser) {
      api
        .getHistory()
        .then((history) => setMessages(history))
        .catch((err) => console.error('Failed to load history:', err));
    } else {
      setMessages([]);
    }
  }, [currentUser]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;
    if (!text && !selectedFile) return;

    if (selectedFile) {
      setIsUploading(true);
      try {
        const uploadRes = await api.uploadMedia(selectedFile);
        const payload: ChatMessage = {
          sender: currentUser.name,
          content: text,
          type: uploadRes.fileType,
          mediaUrl: uploadRes.fileUrl,
          fileName: uploadRes.fileName,
          fileSize: uploadRes.size,
          avatarUrl: currentUser.picture,
        };
        sendMessage(payload);
        setSelectedFile(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        alert('Media upload failed: ' + msg);
      } finally {
        setIsUploading(false);
      }
    } else {
      const payload: ChatMessage = {
        sender: currentUser.name,
        content: text,
        type: 'CHAT',
        avatarUrl: currentUser.picture,
      };
      sendMessage(payload);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-emerald-800 font-semibold">
        Restoring session...
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onLogin={(user) => login(user, true)} />;
  }

  return (
    <>
      <div className="w-full max-w-[1200px] h-[86vh] bg-white/75 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(16,185,129,0.15),0_0_0_1px_rgba(255,255,255,0.6)] overflow-hidden ring-1 ring-emerald-500/10 flex flex-col md:flex-row">
        <Sidebar
          user={currentUser}
          onUpdateGuestName={updateGuestName}
          onLogout={logout}
        />

        <div className="flex-1 flex flex-col bg-slate-50/40 relative min-w-0">
          <ChatHeader />
          <ChatMessages
            messages={messages}
            currentSender={currentUser.name}
            onImageClick={(url) => setLightboxSrc(url)}
          />
          <MediaPreview
            file={selectedFile}
            onClear={() => setSelectedFile(null)}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            onSelectFile={(file) => setSelectedFile(file)}
            disabled={!isConnected || isUploading}
          />
        </div>
      </div>

      <ImageLightbox
        src={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </>
  );
}