import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const COINBASE_API_URL = 'https://api.commerce.coinbase.com';

export async function POST(req: Request) {
  try {
    const { amount, description } = await req.json();

    // Create checkout session
    const response = await fetch(`${COINBASE_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY || '',
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: 'Tip Payment',
        description,
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: 'USD'
        },
        requested_info: ['email'],
        success_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/cancel`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const checkout = await response.json();

    // Save checkout session to Firestore
    await adminDb.collection('checkouts').add({
      checkoutId: checkout.id,
      amount,
      description,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ checkoutId: checkout.id });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 