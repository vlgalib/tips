import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Get tips from Firestore
    const tipsSnapshot = await adminDb
      .collection('tips')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const tips = tipsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate statistics
    const stats = {
      totalTips: tips.reduce((sum, tip) => sum + tip.amount, 0),
      cryptoTips: tips
        .filter(tip => tip.source === 'crypto')
        .reduce((sum, tip) => sum + tip.amount, 0),
      cardTips: tips
        .filter(tip => tip.source === 'card')
        .reduce((sum, tip) => sum + tip.amount, 0),
      xmtpTips: tips
        .filter(tip => tip.source === 'xmtp')
        .reduce((sum, tip) => sum + tip.amount, 0),
      period: 'Last 30 days'
    };

    // Prepare chart data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const chartData = last30Days.map(date => {
      const dayTips = tips.filter(tip => 
        new Date(tip.timestamp.toDate()).toISOString().split('T')[0] === date
      );

      return {
        date,
        crypto: dayTips
          .filter(tip => tip.source === 'crypto')
          .reduce((sum, tip) => sum + tip.amount, 0),
        card: dayTips
          .filter(tip => tip.source === 'card')
          .reduce((sum, tip) => sum + tip.amount, 0),
        xmtp: dayTips
          .filter(tip => tip.source === 'xmtp')
          .reduce((sum, tip) => sum + tip.amount, 0)
      };
    });

    // Get recent transactions
    const transactions = tips.slice(0, 10).map(tip => ({
      id: tip.id,
      amount: tip.amount,
      source: tip.source,
      timestamp: tip.timestamp.toDate(),
      sender: tip.sender,
      receiver: tip.receiver
    }));

    return NextResponse.json({
      stats,
      chartData,
      transactions
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 