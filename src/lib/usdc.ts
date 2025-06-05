import { ethers, providers, Contract, Signer, TransactionResponse } from 'ethers';
import { useOnchainKit } from '@coinbase/onchainkit';

// USDC contract address on Base mainnet
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '';

// USDC ABI (minimal for transfer)
const USDC_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

export class USDCService {
  private provider: providers.Provider;
  private contract: Contract;
  private onchainKit: ReturnType<typeof useOnchainKit>;

  constructor(provider: providers.Provider) {
    this.provider = provider;
    this.contract = new Contract(USDC_ADDRESS, USDC_ABI, provider);
    this.onchainKit = useOnchainKit({
      provider,
      chainId: 8453, // Base mainnet
      apiKey: process.env.COINBASE_API_KEY
    });
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    const decimals = await this.contract.decimals();
    return ethers.utils.formatUnits(balance, decimals);
  }

  async transfer(
    from: string,
    to: string,
    amount: string,
    signer: Signer
  ): Promise<TransactionResponse> {
    const decimals = await this.contract.decimals();
    const amountWei = ethers.utils.parseUnits(amount, decimals);

    // Use OnchainKit for gasless transaction
    const tx = await this.onchainKit.sendTransaction({
      to: USDC_ADDRESS,
      data: this.contract.interface.encodeFunctionData('transfer', [to, amountWei]),
      from
    });

    return tx;
  }

  async estimateGas(
    from: string,
    to: string,
    amount: string
  ): Promise<bigint> {
    const decimals = await this.contract.decimals();
    const amountWei = ethers.utils.parseUnits(amount, decimals);

    return this.contract.transfer.estimateGas(to, amountWei);
  }
} 