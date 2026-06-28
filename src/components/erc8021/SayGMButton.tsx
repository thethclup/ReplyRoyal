'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useSwitchChain, useSendTransaction, useSendCalls } from 'wagmi';
import { base } from 'wagmi/chains';
import { DATA_SUFFIX } from '../../lib/onchain';
import { parseAbi, encodeFunctionData, parseEther } from 'viem';

export function SayGMButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  
  const { sendTransactionAsync, isPending: isTxPending } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSayGM = async () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }

    try {
      setError(null);
      
      if (chainId !== base.id && chainId !== 84532) {
        if (switchChainAsync) {
          await switchChainAsync({ chainId: base.id });
        } else {
          throw new Error('Please switch to Base Mainnet.');
        }
      }

      const GM_REGISTRY = (import.meta.env.VITE_GM_REGISTRY_ADDRESS || '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3') as `0x${string}`;
      const abi = parseAbi(['function sayGM()']);
      const rawData = encodeFunctionData({ abi, functionName: 'sayGM' });
      // Append Builder Code data suffix (EIP-8021) to the calldata for EOA wallets
      const dataWithSuffix = `${rawData}${DATA_SUFFIX.replace('0x', '')}` as `0x${string}`;
      
      try {
        const tx = await sendCallsAsync({
          calls: [{
            to: GM_REGISTRY,
            value: parseEther('0'),
            data: rawData
          }],
          capabilities: {
            dataSuffix: { value: DATA_SUFFIX }
          }
        });
        setTxHash(typeof tx === 'string' ? tx : (tx as any).id || (tx as any).hash);
      } catch (err: any) {
        if (err?.message?.includes('User rejected') || err?.message?.includes('User denied')) {
           throw new Error("User rejected the request.");
        }
        console.log("sendCallsAsync Failed, falling back to sendTransactionAsync", err);
        const tx = await sendTransactionAsync({
          to: GM_REGISTRY,
          value: parseEther('0'),
          data: dataWithSuffix,
          chainId: base.id
        });
        setTxHash(tx);
      }
      
      setShowModal(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message?.includes('User rejected') || err?.message?.includes('User denied') ? "User rejected the transaction." : err.message || 'Failed to send GM');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTxHash(null);
  };

  const explorerBase = chainId === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';

  return (
    <>
      <button
        onClick={handleSayGM}
        disabled={isTxPending}
        className="relative overflow-hidden px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 w-full"
      >
        <span className="relative z-10">
          {isTxPending ? 'Sending GM...' : isConnected ? 'Say GM Onchain 🌅' : 'Connect to Say GM 🌅'}
        </span>
        {isTxPending && (
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          <p>{error}</p>
          {error.includes('User rejected') === false && (
             <a href={explorerBase} target="_blank" rel="noreferrer" className="underline mt-1 inline-block">
               Check Basescan
             </a>
          )}
        </div>
      )}

      {/* Success Modal */}
      {showModal && txHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                GM Sent Onchain!
              </h3>
              <p className="text-zinc-500 mb-6 font-medium">
                Your morning greeting has been permanently recorded on Base.
              </p>
              
              <div className="bg-zinc-50 p-4 rounded-xl mb-6">
                <div className="text-xs text-zinc-400 font-bold uppercase mb-1">Transaction Hash</div>
                <div className="text-sm font-mono text-zinc-700 break-all bg-white border border-zinc-200 p-2 rounded">
                  {txHash}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`${explorerBase}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  View on Basescan 🔍
                </a>
                <button
                  onClick={closeModal}
                  className="block w-full py-3 bg-zinc-100 text-zinc-700 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
