'use client';

import React from 'react';
import { useOnchainScore } from '../../hooks/useOnchainScore.ts';

export function ScoreSubmitButton() {
  const { isConnected, submitScore, isPending, status, error, chainId } = useOnchainScore();

  const explorerBase = chainId === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';

  return (
    <div className="space-y-4">
      {status && (
        <div className="p-3 bg-blue-50 text-blue-900 text-sm rounded-md break-all">
          {status}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          <p>{error}</p>
          {error.includes('User rejected') === false && (
             <a href={explorerBase} target="_blank" rel="noreferrer" className="underline mt-1 inline-block">
               Check Basescan
             </a>
          )}
        </div>
      )}

      <button 
        onClick={() => submitScore(100)}
        disabled={isPending}
        className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Submitting Score...' : isConnected ? 'Submit Score On-chain' : 'Connect to Submit'}
      </button>
    </div>
  );
}
