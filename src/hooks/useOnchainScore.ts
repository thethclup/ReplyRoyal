import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction.ts';
import { useState } from 'react';

export function useOnchainScore() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Use the ERC8021 transaction hook with our codes
  const { sendTransactionAsync, isPending } = useERC8021Transaction({
    schema: 0,
    attributionCode: '[ATTRIBUTION_CODE]',
    builderCode: 'bc_1aw46v36'
  });

  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const submitScore = async (score: number) => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    try {
      setError(null);
      setStatus('Prompting transaction...');
      // Submit a fake transaction to self with 0 value just to demonstrate attribution appending
      const tx = await sendTransactionAsync({
        to: '0x0000000000000000000000000000000000008021',
        value: 0n,
        // Empty data, hook will automatically append suffix
        data: '0x'
      });
      setStatus(`Success! Tx Hash: ${tx}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit score');
      setStatus('');
    }
  };

  return {
    submitScore,
    isConnected,
    isPending,
    status,
    error,
    chainId,
    disconnect
  };
}
