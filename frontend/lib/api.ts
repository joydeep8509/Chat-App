import { ChatMessage, FileUploadResponse, UserDto } from '@/types';

export const api = {
  async getHistory(): Promise<ChatMessage[]> {
    const res = await fetch('/api/messages/history', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  },

  async syncSession(user: UserDto): Promise<void> {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  },

  async getCurrentUser(): Promise<UserDto | null> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.name ? data : null;
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async uploadMedia(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Upload failed');
      throw new Error(errorText || `Upload failed with status ${res.status}`);
    }
    return res.json();
  },
};