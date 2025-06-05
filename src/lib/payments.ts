import { CoinbaseCommerceClient } from '@coinbase/commerce-sdk';

const client = new CoinbaseCommerceClient({
  apiKey: process.env.NEXT_PUBLIC_COINBASE_API_KEY!,
});

export interface CreateChargeParams {
  amount: number;
  currency: string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export async function createCharge({
  amount,
  currency,
  name,
  description,
  metadata,
}: CreateChargeParams) {
  try {
    const charge = await client.charges.create({
      name,
      description,
      local_price: {
        amount: amount.toString(),
        currency,
      },
      pricing_type: 'fixed_price',
      metadata,
    });

    return charge;
  } catch (error) {
    console.error('Error creating charge:', error);
    throw error;
  }
}

export async function getCharge(chargeId: string) {
  try {
    const charge = await client.charges.retrieve(chargeId);
    return charge;
  } catch (error) {
    console.error('Error retrieving charge:', error);
    throw error;
  }
}

export async function listCharges() {
  try {
    const charges = await client.charges.list();
    return charges;
  } catch (error) {
    console.error('Error listing charges:', error);
    throw error;
  }
} 