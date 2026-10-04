export type MessageType = 'CHAT' | 'IMAGE' | 'VIDEO' | 'FILE';

export interface ChatMessage {
  id?: number;
  sender: string;
  content: string;
  type: MessageType;
  mediaUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  avatarUrl?: string | null;
  timestamp?: string;
}

export interface UserDto {
  name: string;
  email: string | null;
  picture: string | null;
  isGuest: boolean;
}

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileType: MessageType;
  size: number;
}