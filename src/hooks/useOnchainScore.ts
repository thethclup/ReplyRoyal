import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { useState } from 'react';

export function useOnchainScore() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { sendTransactionAsync, isPending } = useSendTransaction();

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
      // Submitting to a placeholder registry, client auto-appends builder code
      const tx = await sendTransactionAsync({
        to: '0x1de1Ca34F0d8a59E42cf385b0351dbccCDaDe71b',
        value: 0n,
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

