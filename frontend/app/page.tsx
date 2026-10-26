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

const ImageLightbox = dynamic(() => import('@/components/MediaPreview').then((m) => m.ImageLightbox), { ssr: false });

export default function Home() {
  const { currentUser, loading, login, updateGuestName, logout } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const onMsg = useCallback((m: ChatMessage) => setMessages((prev) => [...prev, m]), []);
  const onDel = useCallback((id: number | string) => setMessages((prev) => prev.filter((m) => String(m.id) !== String(id))), []);

  const { isConnected, sendMessage, sendDelete } = useChatSocket(Boolean(currentUser), onMsg, onDel);

  useEffect(() => {
    if (currentUser) api.getHistory().then(setMessages).catch(console.error);
    else setMessages([]);
  }, [currentUser]);

  const handleDelete = async (id: number | string) => {
    onDel(id); // Optimistic UI update
    api.deleteMessage(id).catch(() => sendDelete(id));
  };

  const handleSend = async (text: string) => {
    if (!currentUser || (!text && !selectedFile)) return;

    if (selectedFile) {
      setIsUploading(true);
      try {
        const up = await api.uploadMedia(selectedFile);
        sendMessage({
          sender: currentUser.name,
          content: text,
          type: up.fileType as 'IMAGE' | 'VIDEO' | 'FILE',
          mediaUrl: up.fileUrl,
          fileName: up.fileName,
          fileSize: up.size,
          avatarUrl: currentUser.picture,
        });
        setSelectedFile(null);
      } catch (e) {
        alert('Upload failed: ' + (e instanceof Error ? e.message : e));
      } finally {
        setIsUploading(false);
      }
    } else {
      sendMessage({ sender: currentUser.name, content: text, type: 'CHAT', avatarUrl: currentUser.picture });
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-emerald-800 font-semibold">Restoring session...</div>;
  if (!currentUser) return <AuthScreen onLogin={(u) => login(u, true)} />;

  return (
    <>
      <div className="w-full max-w-[1200px] h-[100dvh] md:h-[86vh] bg-white/75 backdrop-blur-3xl rounded-none md:rounded-[2.5rem] shadow-xl overflow-hidden ring-1 ring-emerald-500/10 flex flex-col md:flex-row">
        <Sidebar user={currentUser} onUpdateGuestName={updateGuestName} onLogout={logout} />
        <div className="flex-1 flex flex-col bg-slate-50/40 relative min-w-0 min-h-0 h-full overflow-hidden">
          <ChatHeader />
          <ChatMessages messages={messages} currentSender={currentUser.name} onImageClick={setLightboxSrc} onDeleteMessage={handleDelete} />
          <MediaPreview file={selectedFile} onClear={() => setSelectedFile(null)} />
          <ChatInput onSendMessage={handleSend} onSelectFile={setSelectedFile} disabled={!isConnected || isUploading} />
        </div>
      </div>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}