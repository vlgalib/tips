'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QRGeneratorProps {
  staffId: string;
  restaurantId: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ staffId, restaurantId }) => {
  const [staffData, setStaffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffDoc = await getDoc(doc(db, 'staff', staffId));
        if (staffDoc.exists()) {
          setStaffData(staffDoc.data());
        } else {
          setError('Staff member not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [staffId]);

  const generateQRValue = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `${baseUrl}/tip/${restaurantId}/${staffId}`;
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `tip-qr-${staffId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Tip QR Code</h2>
        <p className="text-gray-600 mt-2">
          {staffData?.name || 'Staff Member'}
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <QRCodeCanvas
            id="qr-code"
            value={generateQRValue()}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={downloadQR}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download QR
        </button>
        <button
          onClick={() => router.push(`/tip/${restaurantId}/${staffId}`)}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Preview Page
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Scan this QR code to leave a tip</p>
        <p className="mt-1">Supports USDC, cards, and XMTP chat</p>
      </div>
    </div>
  );
}; 