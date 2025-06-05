import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/coinbase-commerce';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { sendTipNotification } from '@/lib/xmtp';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-cc-webhook-signature');
    const timestamp = req.headers.get('x-cc-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: 'Missing webhook signature or timestamp' },
        { status: 400 }
      );
    }

    const payload = await req.text();
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(payload, signature, timestamp);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(payload);
    
    // Handle charge:confirmed event
    if (event.type === 'charge:confirmed') {
      const { metadata, payments } = event.data;
      const { staffId, restaurantId } = metadata;
      
      // Get the first successful payment
      const payment = payments.find((p: any) => p.status === 'CONFIRMED');
      if (!payment) {
        return NextResponse.json(
          { error: 'No confirmed payment found' },
          { status: 400 }
        );
      }

      // Update staff member's total tips
      const staffRef = doc(db, 'staff', staffId);
      await updateDoc(staffRef, {
        totalTips: increment(parseFloat(payment.value.local.amount))
      });

      // Create tip record
      const tipRef = doc(db, 'tips', event.data.id);
      await updateDoc(tipRef, {
        staffId,
        restaurantId,
        amount: parseFloat(payment.value.local.amount),
        currency: payment.value.local.currency,
        source: 'card',
        txHash: payment.transaction_id,
        payerAddress: payment.payment_address,
        status: 'confirmed',
        timestamp: new Date().toISOString()
      });

      // Send XMTP notification
      const staffDoc = await staffRef.get();
      const staffData = staffDoc.data();
      if (staffData?.walletAddress) {
        await sendTipNotification(
          staffData.walletAddress,
          payment.value.local.amount,
          'Thank you for your tip!'
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 