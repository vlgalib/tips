import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ethers } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import { XMTPAgent } from './xmtp-agent';

admin.initializeApp();

const db = admin.firestore();

// Initialize providers
const provider = new ethers.providers.JsonRpcProvider(
  process.env.BASE_RPC_URL || 'https://mainnet.base.org'
);

// Initialize XMTP client
const xmtpClient = new Client({
  env: process.env.XMTP_ENV === 'production' ? 'production' : 'dev',
  privateKey: process.env.XMTP_PRIVATE_KEY
});

// Create XMTP agent
const agent = new XMTPAgent(xmtpClient, provider, process.env.USDC_CONTRACT_ADDRESS);

// Start monitoring on function deployment
export const startXMTPService = functions.https.onRequest(async (req, res) => {
  try {
    await agent.startMonitoring();
    res.status(200).send('XMTP agent started successfully');
  } catch (error) {
    console.error('Error starting XMTP agent:', error);
    res.status(500).send('Error starting XMTP agent');
  }
});

// Stop monitoring on function termination
export const stopXMTPService = functions.https.onRequest(async (req, res) => {
  try {
    await agent.stopMonitoring();
    res.status(200).send('XMTP agent stopped successfully');
  } catch (error) {
    console.error('Error stopping XMTP agent:', error);
    res.status(500).send('Error stopping XMTP agent');
  }
});

export const handleMoralisWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { logs } = req.body;

    for (const log of logs) {
      const { transactionHash, logIndex, data, topics } = log;

      // Parse the event data
      const iface = new ethers.utils.Interface([
        'event Transfer(address indexed from, address indexed to, uint256 value)'
      ]);

      const parsedLog = iface.parseLog({
        topics: topics,
        data: data
      });

      const { from, to, value } = parsedLog.args;

      // Convert value from wei to USDC (6 decimals)
      const amount = ethers.utils.formatUnits(value, 6);

      // Save the transaction to Firestore
      await db.collection('tips').add({
        transactionHash,
        logIndex,
        amount: parseFloat(amount),
        source: 'crypto',
        sender: from,
        receiver: to,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const handleCoinbaseWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const signature = req.headers['x-cc-webhook-signature'];
    const payload = req.body;

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', process.env.COINBASE_WEBHOOK_SECRET || '');
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');

    if (signature !== digest) {
      throw new Error('Invalid webhook signature');
    }

    const { event } = payload;

    if (event.type === 'charge:confirmed') {
      const { id, metadata } = event.data;

      // Update checkout status
      const checkoutRef = db.collection('checkouts').where('checkoutId', '==', id);
      const checkoutSnapshot = await checkoutRef.get();

      if (!checkoutSnapshot.empty) {
        const checkoutDoc = checkoutSnapshot.docs[0];
        await checkoutDoc.ref.update({
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create tip record
        await db.collection('tips').add({
          amount: event.data.pricing.local.amount,
          source: 'card',
          sender: metadata.email,
          receiver: metadata.receiver,
          transactionHash: id,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const getMoralisConfig = functions.https.onRequest(async (req, res) => {
  // Проверка авторизации (например, через Firebase Auth)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send('Unauthorized');
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    res.status(401).send('Invalid token');
    return;
  }

  // Возвращаем конфигурацию Moralis
  res.json({
    apiKey: process.env.MORALIS_API_KEY,
    usdcContractAddress: process.env.USDC_CONTRACT_ADDRESS,
    streamsApiUrl: process.env.STREAMS_API_URL,
    apiUrl: process.env.API_URL
  });
}); 