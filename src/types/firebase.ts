export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  restaurantId?: string;
  role: 'admin' | 'staff';
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffMember {
  id: string;
  restaurantId: string;
  name: string;
  walletAddress: string;
  isActive: boolean;
  totalTips: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tip {
  id: string;
  staffId: string;
  restaurantId: string;
  amount: number;
  currency: 'USD' | 'USDC';
  message?: string;
  payerAddress?: string;
  source: 'qr' | 'wallet' | 'xmtp';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'tip' | 'system' | 'wallet';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
} 