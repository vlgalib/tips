import { Client, Conversation } from '@xmtp/xmtp-js';

export interface XMTPMessage {
  id: string;
  content: string;
  senderAddress: string;
  sent: Date;
}

export interface XMTPConversation {
  id: string;
  peerAddress: string;
  messages: XMTPMessage[];
}

export interface XMTPClient extends Client {
  conversations: {
    list: () => Promise<Conversation[]>;
    newConversation: (address: string) => Promise<Conversation>;
  };
}

export interface XMTPConfig {
  env: 'production' | 'dev';
  privateKey?: string;
} 