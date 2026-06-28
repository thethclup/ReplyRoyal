import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useSendTransaction, useSendCalls } from 'wagmi';
import { base } from 'wagmi/chains';
import { wagmiConfig, DATA_SUFFIX } from './lib/onchain';
import { useGameStore } from './lib/store';
import { Lobby } from './components/Lobby';
import { Arena } from './components/Arena';
import { GameOver } from './components/GameOver';
import { Sun } from 'lucide-react';
import { parseAbi, encodeFunctionData, parseEther } from 'viem';

const queryClient = new QueryClient();

function GameHeader() {
  const { isConnected } = useAccount();
  const { sendTransactionAsync, isPending: isTxPending } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();

  const sendGMTransaction = async () => {
    try {
      const GM_REGISTRY = (import.meta.env.VITE_GM_REGISTRY_ADDRESS || '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3') as `0x${string}`;
      const abi = parseAbi(['function sayGM()']);
      const rawData = encodeFunctionData({ abi, functionName: 'sayGM' });
      // Append Builder Code data suffix (EIP-8021) to the calldata for EOA wallets
      const dataWithSuffix = `${rawData}${DATA_SUFFIX.replace('0x', '')}` as `0x${string}`;

      try {
        await sendCallsAsync({
          calls: [{
            to: GM_REGISTRY,
            value: parseEther('0'),
            data: rawData
          }],
          capabilities: {
            dataSuffix: { value: DATA_SUFFIX }
          }
        });
      } catch (err) {
        console.log("sendCallsAsync Failed, falling back to sendTransactionAsync", err);
        await sendTransactionAsync({
          to: GM_REGISTRY,
          value: parseEther('0'),
          data: dataWithSuffix,
          chainId: base.id
        });
      }
      alert('GM Sent Onchain! 🌅');
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
        disabled={isTxPending}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
      >
        <Sun className="w-4 h-4" />
        {isTxPending ? 'Sending...' : 'Say GM'}
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
