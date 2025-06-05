'use client';

import React from 'react';
import { QRGenerator } from '@/components/QRGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function QRCodePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Your Tip QR Code</h1>
        <QRGenerator staffId={params.id} restaurantId={user.restaurantId} />
      </div>
    </div>
  );
} 