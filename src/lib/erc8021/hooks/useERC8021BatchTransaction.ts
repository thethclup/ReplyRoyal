import { useERC8021Transaction } from './useERC8021Transaction.ts';
import { ERC8021Config } from '../types.ts';
import { SendTransactionParameters } from 'wagmi/actions';

/**
 * Hook for batched calls with attribution.
 * For simplicity, this uses the base transaction hook, but in reality 
 * it would format a multicall or batch call specific to the Smart Wallet.
 */
export function useERC8021BatchTransaction(config?: ERC8021Config) {
  const { sendTransactionAsync, ...rest } = useERC8021Transaction(config);

  const sendBatchWithAttribution = async (calls: SendTransactionParameters[]) => {
    // In a real implementation using Coinbase Smart Wallet or similar,
    // calls would be combined into a batch execution transaction.
    // The attribution is appended to the batch entry point calldata.
    // For demonstration, we just execute the first call.
    if (calls.length === 0) throw new Error('No calls to batch');
    
    return sendTransactionAsync(calls[0]);
  };

  return {
    sendBatchWithAttribution,
    ...rest,
  };
}
