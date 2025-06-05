import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';

let xmtpClient: Client | null = null;

export async function getXMTPClient() {
  if (xmtpClient) return xmtpClient;

  if (!process.env.XMTP_PRIVATE_KEY) {
    throw new Error('XMTP_PRIVATE_KEY is not set');
  }

  const wallet = new Wallet(process.env.XMTP_PRIVATE_KEY);
  const client = await Client.create(wallet, {
    env: process.env.XMTP_ENV === 'production' ? 'production' : 'dev'
  });

  xmtpClient = client;
  return client;
}

export async function sendTipNotification(
  recipientAddress: string,
  amount: string,
  message?: string
) {
  const client = await getXMTPClient();
  const conversation = await client.conversations.newConversation(recipientAddress);
  
  await conversation.send(
    `You received a tip of ${amount} USDC${message ? ` with message: "${message}"` : ''}`
  );
}

export async function listenForTipCommands(
  callback: (sender: string, amount: string, message?: string) => Promise<void>
) {
  const client = await getXMTPClient();
  
  for await (const conversation of await client.conversations.list()) {
    for await (const message of await conversation.messages()) {
      if (message.content.startsWith('/tip')) {
        const [_, amount, ...messageParts] = message.content.split(' ');
        const tipMessage = messageParts.join(' ');
        
        await callback(
          message.senderAddress,
          amount,
          tipMessage || undefined
        );
      }
    }
  }
}

export async function sendTipMessage(
  recipientAddress: string,
  amount: number,
  message?: string
) {
  if (!xmtpClient) {
    throw new Error('XMTP client not initialized');
  }

  const conversation = await xmtpClient.conversations.newConversation(recipientAddress);
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
  if (!xmtpClient) {
    throw new Error('XMTP client not initialized');
  }

  const conversations = await xmtpClient.conversations.list();
  
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