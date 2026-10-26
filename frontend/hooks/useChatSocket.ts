'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '/chat';

export function useChatSocket(
  enabled: boolean,
  onMessageReceived: (message: ChatMessage) => void,
  onMessageDeleted?: (id: number | string) => void
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: () => {},
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);

        client.subscribe('/topic/messages', (msg) => {
          try {
            onMessageReceived(JSON.parse(msg.body));
          } catch (e) {
            console.error('Failed to parse incoming message', e);
          }
        });

        client.subscribe('/topic/messages/delete', (msg) => {
          try {
            const data = JSON.parse(msg.body);
            if (data?.id != null && onMessageDeleted) {
              onMessageDeleted(data.id);
            }
          } catch (e) {
            console.error('Failed to parse delete payload', e);
          }
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: (frame) => {
        console.error('STOMP broker error:', frame.headers['message']);
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [enabled, onMessageReceived, onMessageDeleted]);

  const sendMessage = useCallback((msg: ChatMessage) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(msg),
      });
    }
  }, []);

  const sendDelete = useCallback((id: number | string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/deleteMessage',
        body: JSON.stringify({ id }),
      });
    }
  }, []);

  return { isConnected, sendMessage, sendDelete };
}