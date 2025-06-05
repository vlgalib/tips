export interface CreateChargeParams {
  name: string;
  description: string;
  amount: string;
  currency: string;
  metadata?: {
    staffId: string;
    restaurantId: string;
    [key: string]: any;
  };
}

const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const COINBASE_API_URL = 'https://api.commerce.coinbase.com';

export async function createCharge({
  name,
  description,
  amount,
  currency,
  metadata
}: CreateChargeParams) {
  try {
    const response = await fetch(`${COINBASE_API_URL}/charges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY || '',
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name,
        description,
        local_price: {
          amount,
          currency
        },
        pricing_type: 'fixed_price',
        metadata,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`
      })
    });
    if (!response.ok) {
      throw new Error('Failed to create charge');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating charge:', error);
    throw error;
  }
}

export async function getCharge(chargeId: string) {
  try {
    const response = await fetch(`${COINBASE_API_URL}/charges/${chargeId}`, {
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY || '',
        'X-CC-Version': '2018-03-22'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to retrieve charge');
    }
    return await response.json();
  } catch (error) {
    console.error('Error retrieving charge:', error);
    throw error;
  }
}

export async function listCharges() {
  try {
    const response = await fetch(`${COINBASE_API_URL}/charges`, {
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY || '',
        'X-CC-Version': '2018-03-22'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to list charges');
    }
    return await response.json();
  } catch (error) {
    console.error('Error listing charges:', error);
    throw error;
  }
}

// Webhook signature verification should be implemented in the backend using crypto, not here. 