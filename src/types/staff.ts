export type AuthMethod = 'gmail' | 'coinbase';

export interface StaffMember {
  uid: string;
  email: string;
  walletAddress: string;
  authMethod: AuthMethod;
  xmtpEnabled: boolean;
  createdAt: Date;
} 