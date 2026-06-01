'use client';

import React from 'react';
import { useOnchainScore } from '../../hooks/useOnchainScore.ts';

export function ERC8021Demo() {
  const { isConnected, submitScore, isPending, status, disconnect } = useOnchainScore();

  return (
    <div className="p-6 border border-zinc-200 rounded-lg max-w-md mx-auto my-8 bg-zinc-50/50">
      <h2 className="text-xl font-bold mb-4 text-zinc-900">ERC-8021 Interaction Demo</h2>
      <p className="text-sm text-zinc-600 mb-6">
        This component tests attribution injection on transactions according to the ERC-8021 standard on Base Mainnet.
      </p>

      {status && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-900 text-sm rounded-md break-all">
          {status}
        </div>
      )}

      <div className="space-y-4">
        {!isConnected ? (
          <button 
            onClick={() => submitScore(100)}
            className="w-full py-3 bg-zinc-900 text-white rounded-md font-medium hover:bg-zinc-800 transition-colors"
          >
            Connect Base Wallet
          </button>
        ) : (
          <>
            <button 
              onClick={() => submitScore(100)}
              disabled={isPending}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Sending with ERC-8021...' : 'Send Onchain Action (Score: 100)'}
            </button>
            <button 
              onClick={() => disconnect()}
              className="w-full py-2 bg-transparent text-zinc-600 border border-zinc-300 rounded-md font-medium hover:bg-zinc-100 transition-colors"
            >
              Disconnect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}
