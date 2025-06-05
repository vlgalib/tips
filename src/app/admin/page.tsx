import React from 'react';
import { MoralisStreams } from '@/components/admin/MoralisStreams';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <MoralisStreams />
      </div>
    </div>
  );
} 