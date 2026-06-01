import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction.ts';
import { useState } from 'react';

export function useOnchainScore() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  // Use the ERC8021 transaction hook with our codes
  const { sendTransactionAsync, isPending } = useERC8021Transaction({
    schema: 0,
    attributionCode: '[ATTRIBUTION_CODE]',
    builderCode: '[BUILDER_CODE]'
  });

  const [status, setStatus] = useState<string>('');

  const submitScore = async (score: number) => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    try {
      setStatus('Prompting transaction...');
      // Submit a fake transaction to self with 0 value just to demonstrate attribution appending
      const tx = await sendTransactionAsync({
        to: address,
        value: 0n,
        // Empty data, hook will automatically append suffix
        data: '0x'
      });
      setStatus(`Success! Tx Hash: ${tx}`);
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit score');
    }
  };

  return {
    submitScore,
    isConnected,
    isPending,
    status,
    disconnect
  };
}
