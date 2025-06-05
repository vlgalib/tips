import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';

let client: Client | null = null;

export async function initializeXMTPClient(privateKey: string) {
  if (client) return client;

  const wallet = new Wallet(privateKey);
  client = await Client.create(wallet, { env: 'production' });
  return client;
}

export async function sendTipMessage(
  recipientAddress: string,
  amount: number,
  message?: string
) {
  if (!client) {
    throw new Error('XMTP client not initialized');
  }

  const conversation = await client.conversations.newConversation(recipientAddress);
  const tipMessage = {
    type: 'tip',
    amount,
    message: message || 'Thank you for your service!',
    timestamp: new Date().toISOString(),
  };

  await conversation.send(JSON.stringify(tipMessage));
}

export async function listenForTips(
  onTipReceived: (tip: { amount: number; message?: string; sender: string }) => void
) {
  if (!client) {
    throw new Error('XMTP client not initialized');
  }

  const conversations = await client.conversations.list();
  
  for (const conversation of conversations) {
    const messages = await conversation.messages();
    
    for (const message of messages) {
      try {
        const content = JSON.parse(message.content);
        if (content.type === 'tip') {
          onTipReceived({
            amount: content.amount,
            message: content.message,
            sender: message.senderAddress,
          });
        }
      } catch (error) {
        console.error('Error parsing tip message:', error);
      }
    }

    // Listen for new messages
    conversation.streamMessages().subscribe({
      next: async (message) => {
        try {
          const content = JSON.parse(message.content);
          if (content.type === 'tip') {
            onTipReceived({
              amount: content.amount,
              message: content.message,
              sender: message.senderAddress,
            });
          }
        } catch (error) {
          console.error('Error parsing tip message:', error);
        }
      },
      error: (error) => {
        console.error('Error in message stream:', error);
      },
    });
  }
} 