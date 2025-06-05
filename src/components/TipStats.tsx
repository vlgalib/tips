'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Tip {
  amount: number;
  timestamp: any;
  message?: string;
}

interface TipStats {
  totalTips: number;
  averageTip: number;
  recentTips: Tip[];
}

export default function TipStats() {
  const [stats, setStats] = useState<TipStats>({
    totalTips: 0,
    averageTip: 0,
    recentTips: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const tipsRef = collection(db, 'tips');
      const q = query(
        tipsRef,
        where('staffId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const tips = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Tip[];

      const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
      const averageTip = tips.length > 0 ? totalTips / tips.length : 0;

      setStats({
        totalTips,
        averageTip,
        recentTips: tips,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Tip Statistics</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tips</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalTips.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Tip</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.averageTip.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Tips</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.recentTips.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tips</h3>
        <div className="space-y-4">
          {stats.recentTips.map((tip, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${tip.amount.toFixed(2)}
                </p>
                {tip.message && (
                  <p className="text-sm text-gray-500 mt-1">{tip.message}</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {new Date(tip.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 