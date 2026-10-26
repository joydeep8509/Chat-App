import { ChatMessage, FileUploadResponse, UserDto } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
  });
  if (!res.ok) throw new Error((await res.text()) || `Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  // Session & Auth endpoints
  syncSession: (user: UserDto) =>
    req<{ status: string; user: UserDto }>('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }),

  getMe: () => req<UserDto>('/api/auth/me'),
  getCurrentUser: () => req<UserDto>('/api/auth/me'),

  logout: () =>
    req<{ status: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  // Messages & Media endpoints
  getHistory: () => req<ChatMessage[]>('/api/messages/history'),

  uploadMedia: (file: File) => {
    const body = new FormData();
    body.append('file', file);
    return req<FileUploadResponse>('/api/media/upload', {
      method: 'POST',
      body,
    });
  },

  deleteMessage: (id: number | string) =>
    req<{ status: string; id: number | string }>(`/api/messages/${id}`, {
      method: 'DELETE',
    }),
};