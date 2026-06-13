import { useSendTransaction } from 'wagmi';

// Since wagmiConfig handles the dataSuffix natively via ox/erc8021, 
// this hook just wraps useSendTransaction to avoid breaking existing imports
export function useERC8021Transaction(config?: any) {
  return useSendTransaction();
}
