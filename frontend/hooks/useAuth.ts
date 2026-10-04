'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserDto } from '@/types';
import { api } from '@/lib/api';

const SESSION_STORAGE_KEY = 'pyramid_user_session';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = useCallback(async (user: UserDto, saveToStorage: boolean = true) => {
    setCurrentUser(user);
    if (saveToStorage) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
    await api.syncSession(user).catch(() => {});
  }, []);

  const updateGuestName = useCallback(
    (newName: string) => {
      if (!currentUser || !currentUser.isGuest) return;
      const updated: UserDto = { ...currentUser, name: newName };
      setCurrentUser(updated);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
      api.syncSession(updated).catch(() => {});
    },
    [currentUser]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    await api.logout().catch(() => {});
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed: UserDto = JSON.parse(stored);
          if (parsed && parsed.name) {
            await login(parsed, false);
            setLoading(false);
            return;
          }
        }
        const sessionUser = await api.getCurrentUser();
        if (sessionUser && sessionUser.name) {
          await login(sessionUser, true);
        }
      } catch (e) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, [login]);

  return { currentUser, loading, login, updateGuestName, logout };
}