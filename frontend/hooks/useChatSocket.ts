'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '@/types';

export function useChatSocket(
  isAuthenticated: boolean,
  onMessageReceived: (message: ChatMessage) => void
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);
  const onMessageReceivedRef = useRef(onMessageReceived);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Connects through Next.js proxy route to preserve cookies and prevent CORS overhead
    const socket = new SockJS('/chat');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        setIsConnected(true);
        stompClient.subscribe('/topic/messages', (frame) => {
          if (frame.body) {
            try {
              const msg: ChatMessage = JSON.parse(frame.body);
              onMessageReceivedRef.current(msg);
            } catch (err) {
              console.error('Failed to parse STOMP body', err);
            }
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP broker error:', frame.headers['message']);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  const sendMessage = useCallback((message: ChatMessage) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(message),
      });
    }
  }, []);

  return { isConnected, sendMessage };
}