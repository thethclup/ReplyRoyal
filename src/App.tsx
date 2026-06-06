import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { wagmiConfig } from './lib/web3';
import { useGameStore } from './lib/store';
import { Lobby } from './components/Lobby';
import { Arena } from './components/Arena';
import { GameOver } from './components/GameOver';
import { Sun } from 'lucide-react';
import { useERC8021Transaction } from './lib/erc8021/hooks/useERC8021Transaction';
import { toHex } from 'viem';

const queryClient = new QueryClient();

function GameHeader() {
  const { isConnected } = useAccount();
  const { sendTransactionAsync, isPending } = useERC8021Transaction({
    schema: 0,
    attributionCode: '[ATTRIBUTION_CODE]',
    builderCode: '[BUILDER_CODE]'
  });

  const sendGMTransaction = async () => {
    try {
      await sendTransactionAsync({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: 0n,
        data: toHex('GM'),
      });
      alert('GM Sent On-chain! 🌅');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to send GM');
    }
  };

  if (!isConnected) return null;

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={sendGMTransaction}
        disabled={isPending}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
      >
        <Sun className="w-4 h-4" />
        {isPending ? 'Sending...' : 'Say GM'}
      </button>
    </div>
  );
}

function GameRenderer() {
  const phase = useGameStore((state) => state.phase);

  return (
    <div className="w-full h-[100dvh] max-w-sm mx-auto bg-[#09090b] text-white flex flex-col overflow-hidden relative shadow-2xl sm:rounded-3xl sm:h-[850px] sm:my-10 border border-zinc-800/50">
      <GameHeader />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col">
        {phase === 'LOBBY' && <Lobby />}
        {phase === 'PLAYING' && <Arena />}
        {phase === 'GAMEOVER' && <GameOver />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          <GameRenderer />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
