import React from 'react';
import { TipChart } from '@/components/analytics/TipChart';
import { TipStats } from '@/components/analytics/TipStats';
import { RecentTransactions } from '@/components/analytics/RecentTransactions';

interface ChartDataPoint {
  date: string;
  crypto: number;
  card: number;
  xmtp: number;
}

interface Transaction {
  id: string;
  amount: number;
  source: 'crypto' | 'card' | 'xmtp';
  timestamp: Date;
  sender: string;
  receiver: string;
}

async function getAnalyticsData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch analytics data');
  }

  return res.json();
}

export default async function AnalyticsPage() {
  const { stats, chartData, transactions } = await getAnalyticsData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
      
      <div className="space-y-8">
        <TipStats {...stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TipChart
            data={chartData}
            title="Tips Over Time"
          />
          
          <RecentTransactions
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
} 