import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: 'tips-6545c',
      clientEmail: 'firebase-adminsdk-fbsvc@tips-6545c.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    // Create a custom token for the wallet address
    const customToken = await getAuth().createCustomToken(address);

    return res.status(200).json({ token: customToken });
  } catch (error: any) {
    console.error('Error creating custom token:', error);
    return res.status(500).json({ error: error.message });
  }
} 