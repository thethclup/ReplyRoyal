import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/web3';
import { useGameStore } from './lib/store';
import { Lobby } from './components/Lobby';
import { Arena } from './components/Arena';
import { GameOver } from './components/GameOver';

const queryClient = new QueryClient();

function GameRenderer() {
  const phase = useGameStore((state) => state.phase);

  return (
    <div className="w-full h-[100dvh] max-w-sm mx-auto bg-[#09090b] text-white flex flex-col overflow-hidden relative shadow-2xl sm:rounded-3xl sm:h-[850px] sm:my-10 border border-zinc-800/50">
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
