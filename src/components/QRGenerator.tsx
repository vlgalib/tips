'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface QRGeneratorProps {
  value: string;
  size?: number;
  staffName?: string;
}

export default function QRGenerator({ value, size = 256, staffName }: QRGeneratorProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `tipmaster-qr-${staffName || 'staff'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    setIsDownloading(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
      <div className="relative">
        <QRCodeCanvas
          id="qr-code"
          value={value}
          size={size}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>
      {staffName && (
        <p className="mt-2 text-lg font-semibold text-gray-800">{staffName}</p>
      )}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
        {isDownloading ? 'Downloading...' : 'Download QR Code'}
      </button>
    </div>
  );
} 