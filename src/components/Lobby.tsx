import { motion } from 'framer-motion';
import { useGameStore } from '../lib/store';
import { useAccount, useConnect } from 'wagmi';
import { SayGMButton } from './erc8021/SayGMButton.tsx';

export function Lobby() {
  const startGame = useGameStore((state) => state.startGame);
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full p-6 text-center"
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="space-y-4">
          <motion.h1 
            className="text-6xl game-font neon-pink tracking-tighter leading-tight p-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            REPLY ROYALE
          </motion.h1>
          <span className="gladiator-tag inline-block">Gladiator #{Math.floor(Math.random() * 9000) + 1000}</span>
          <p className="text-zinc-400 text-sm font-bold block mt-2">Only the most savage survive.</p>
        </div>

        <div className="w-full max-w-sm space-y-4 bento-card p-6 mt-8">
          
          <SayGMButton />
          
          <button
            onClick={startGame}
            className="w-full py-4 text-2xl game-font tracking-wide rounded-xl bg-pink-600 border border-pink-400 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)] active:scale-95 transition-transform"
          >
            ENTER ARENA
          </button>

          {!isConnected ? (
            <div className="flex flex-col gap-2 w-full">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="w-full py-3 game-font text-xl rounded-xl bg-cyan-600 border border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  CONNECT {connector.name.toUpperCase()}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 bg-white/5 rounded-xl text-xs font-mono text-zinc-300 border border-white/10 flex items-center gap-2 justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              BASE: {address?.slice(0,6)}...{address?.slice(-4)}
            </div>
          )}

        </div>
      </div>
      
      <footer className="mt-auto flex flex-col justify-end pt-4 items-center text-[10px] uppercase tracking-widest text-zinc-600 font-bold px-2 gap-1 w-full border-t border-zinc-800/50">
        <span>&copy; 2024 REPLY ROYALE • POWERED BY BASE</span>
        <span>VERIFIED APP ID: 68f4da468c4fe3f562003e2f</span>
        <span>BUILDER CODE: bc_rarzcl2g</span>
      </footer>
    </motion.div>
  );
}
