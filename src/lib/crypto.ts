import { ethers } from 'ethers';
import { OnchainKit } from '@coinbase/onchainkit';

// USDC contract address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC ABI (minimal for transfer)
const USDC_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_RPC_URL
);

export async function sendUSDC(
  to: string,
  amount: number,
  signer: ethers.Signer
) {
  try {
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
    const decimals = await usdcContract.decimals();
    const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);

    const tx = await usdcContract.transfer(to, amountInWei);
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error('Error sending USDC:', error);
    throw error;
  }
}

export async function getUSDCBalance(address: string) {
  try {
    const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    const balance = await usdcContract.balanceOf(address);
    const decimals = await usdcContract.decimals();
    
    return ethers.utils.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    throw error;
  }
}

export async function connectWallet() {
  try {
    const onchainKit = new OnchainKit({
      appName: 'TipMaster',
      appLogoUrl: 'https://tipmaster.app/logo.png',
      chain: 'base',
    });

    const { address, provider } = await onchainKit.connectWallet();
    return { address, provider };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
} 