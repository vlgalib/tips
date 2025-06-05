import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error('Missing required Firebase Admin environment variables');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();

export interface StaffMember {
  uid: string;
  email: string;
  walletAddress: string;
  authMethod: 'gmail' | 'coinbase';
  xmtpEnabled: boolean;
  createdAt: Date;
}

export async function saveStaffMember(data: Omit<StaffMember, 'createdAt'>) {
  const db = admin.firestore();
  const staffRef = db.collection('staff').doc(data.uid);
  
  await staffRef.set({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return staffRef;
}

export async function getStaffMember(uid: string) {
  const db = admin.firestore();
  const staffRef = db.collection('staff').doc(uid);
  const doc = await staffRef.get();
  
  if (!doc.exists) {
    return null;
  }
  
  return doc.data() as StaffMember;
} 