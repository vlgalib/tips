'use client';

import React, { useEffect, useState } from 'react';
import QRGenerator from '@/components/QRGenerator';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function StaffPage() {
  const [staffData, setStaffData] = useState<{
    name: string;
    walletAddress: string;
  } | null>(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      const user = auth.currentUser;
      if (user) {
        const staffDoc = await getDoc(doc(db, 'staff', user.uid));
        if (staffDoc.exists()) {
          setStaffData(staffDoc.data() as { name: string; walletAddress: string });
        }
      }
    };

    fetchStaffData();
  }, []);

  if (!staffData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const qrValue = `${window.location.origin}/tip/${staffData.walletAddress}`;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Tip QR Code</h1>
          <p className="mt-2 text-gray-600">
            Share this QR code with customers to receive tips
          </p>
        </div>
        
        <div className="flex justify-center">
          <QRGenerator
            value={qrValue}
            staffName={staffData.name}
            size={300}
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Wallet Address</h2>
          <p className="font-mono text-sm bg-gray-50 p-3 rounded break-all">
            {staffData.walletAddress}
          </p>
        </div>
      </div>
    </main>
  );
} 