import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../lib/store';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { generateAttributionPayload } from '../lib/erc8021';
import { createReplyAgentIntent, submitToTrustlessAgent } from '../lib/erc8004';
import { ShieldCheck, Trophy, Loader2, MessageCircle } from 'lucide-react';

export function GameOver() {
  const { score, maxCombo, setPhase } = useGameStore();
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [gmHash, setGmHash] = useState<string | null>(null);

  const handleRecordOnChain = async () => {
    if (!isConnected || !address) {
      alert("Please connect wallet first!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate ERC-8021 payload using the builder code
      const attrPayload = generateAttributionPayload();
      
      // Generate ERC-8004 Agent Intent
      const intent = createReplyAgentIntent(score);
      
      // Submit to agent
      const result = await submitToTrustlessAgent(intent, address);
      
      if (result.success) {
        setTxHash(result.agentTxHash);
      }
    } catch (err) {
      console.error("Failed to commit score:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSayGM = async () => {
    if (!isConnected) return;
    try {
      // Mocking a "Say GM" on-chain transaction (e.g. 0 eth to self or a specific address)
      const hash = await sendTransactionAsync({
        to: address,
        value: parseEther('0'),
        data: '0x474d' // "GM" in hex
      });
      setGmHash(hash);
    } catch (err) {
      console.error("Failed GM tx:", err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6 overflow-y-auto"
    >
      <div className="space-y-2 mt-10">
        <h2 className="text-5xl game-font neon-pink tracking-widest text-[#f43f5e] uppercase">Royale Ended</h2>
        <p className="text-zinc-400">The arena has silenced.</p>
      </div>

      <div className="bento-card p-6 w-full max-w-sm shadow-[0_0_20px_rgba(244,114,182,0.1)] relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500" />
        
        <div className="space-y-4">
          <div>
            <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Final Score</div>
            <div className="text-5xl game-font neon-cyan">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Max Combo</div>
            <div className="text-2xl game-font text-pink-400">{maxCombo}x</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3 pb-10">
        {txHash ? (
          <div className="p-4 bg-green-950/30 border border-green-900 rounded-xl text-green-400 text-sm flex flex-col items-center gap-2">
            <ShieldCheck size={24} />
            <span className="font-bold">Score secured On-Chain!</span>
            <span className="text-xs font-mono text-green-600 break-all">{txHash}</span>
          </div>
        ) : (
          <button
            onClick={handleRecordOnChain}
            disabled={isSubmitting || !isConnected}
            className="w-full py-4 text-xl game-font rounded-xl bg-cyan-600 border border-cyan-400 text-white hover:bg-cyan-500 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(8,145,178,0.4)] tracking-wide"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Trophy size={20} />}
            {isConnected ? "RECORD ON-CHAIN" : "CONNECT TO RECORD"}
          </button>
        )}

        <AnimatePresence>
          {isConnected && !gmHash && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onClick={handleSayGM}
              className="w-full py-3 text-lg game-font tracking-wide rounded-xl glass-btn text-orange-400 border border-orange-500/50 hover:bg-orange-600/10 transition-colors flex justify-center items-center gap-2"
            >
              <MessageCircle size={16} /> SAY "GM" ON-CHAIN
            </motion.button>
          )}
          {gmHash && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="text-[10px] text-zinc-500 font-mono break-all mt-2"
             >
               GM TX: {gmHash}
             </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setPhase('LOBBY')}
          className="w-full py-3 mt-4 text-sm font-bold rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          RETURN TO LOBBY
        </button>
      </div>
    </motion.div>
  );
}
