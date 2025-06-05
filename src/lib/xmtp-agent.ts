import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { USDCService } from './usdc';

export class XMTPAgent {
  private client: Client;
  private provider: ethers.providers.Provider;
  private usdcService: USDCService;
  private usdcAddress: string;

  constructor(
    client: Client,
    provider: ethers.providers.Provider,
    usdcAddress: string
  ) {
    this.client = client;
    this.provider = provider;
    this.usdcService = new USDCService(provider);
    this.usdcAddress = usdcAddress;
  }

  async startMonitoring() {
    // Monitor USDC transfers
    this.provider.on('block', async () => {
      try {
        const block = await this.provider.getBlock('latest');
        if (!block) return;

        // Get all transactions in the block
        const transactions = await Promise.all(
          block.transactions.map(tx => this.provider.getTransaction(tx))
        );

        // Filter USDC transfers
        const usdcTransfers = transactions.filter(tx => 
          tx && tx.to?.toLowerCase() === this.usdcAddress.toLowerCase()
        );

        // Process each transfer
        for (const tx of usdcTransfers) {
          if (!tx) continue;

          // Decode transaction data
          const iface = new ethers.utils.Interface([
            'function transfer(address to, uint256 amount) returns (bool)'
          ]);
          
          const decodedData = iface.parseTransaction({
            data: tx.data,
            value: tx.value
          });

          if (decodedData.name === 'transfer') {
            const [to, amount] = decodedData.args;
            
            // Get staff member by wallet address
            const staffQuery = query(
              collection(db, 'staff'),
              where('walletAddress', '==', to.toLowerCase())
            );
            
            const staffSnapshot = await getDocs(staffQuery);

            if (!staffSnapshot.empty) {
              const staffDoc = staffSnapshot.docs[0];
              const staffData = staffDoc.data();

              // Update staff member's total tips
              await updateDoc(doc(db, 'staff', staffDoc.id), {
                totalTips: increment(parseFloat(ethers.utils.formatUnits(amount, 6)))
              });

              // Create tip record
              await updateDoc(doc(db, 'tips', tx.hash), {
                staffId: staffDoc.id,
                restaurantId: staffData.restaurantId,
                amount: parseFloat(ethers.utils.formatUnits(amount, 6)),
                currency: 'USDC',
                source: 'crypto',
                txHash: tx.hash,
                payerAddress: tx.from.toLowerCase(),
                status: 'confirmed',
                timestamp: new Date().toISOString()
              });

              // Send XMTP notification
              const conversation = await this.client.conversations.newConversation(
                staffData.walletAddress
              );
              
              await conversation.send(
                `You received a tip of ${ethers.utils.formatUnits(amount, 6)} USDC`
              );
            }
          }
        }
      } catch (error) {
        console.error('Error monitoring transactions:', error);
      }
    });
  }

  async stopMonitoring() {
    this.provider.removeAllListeners();
  }
} 