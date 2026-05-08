import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ReplyOption } from '../lib/store';
import { Flame, Skull, Zap, MessageSquare, Timer } from 'lucide-react';
import { cn } from '../lib/utils';

export function Arena() {
  const { 
    hype, toxicity, score, combo, currentPrompt, replyOptions, 
    timeLeft, feed, submitReply, tickGame, abilities, useAbility 
  } = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => {
      tickGame();
    }, 1000);
    return () => clearInterval(timer);
  }, [tickGame]);

  if (!currentPrompt) return null;

  return (
    <div className="flex flex-col h-full bg-transparent p-4">
      {/* HUD Header */}
      <div className="flex justify-between items-center bento-card p-3 mb-4 rounded-full">
        <div className="flex flex-col gap-1 w-1/3">
          <div className="flex items-center gap-1 text-xs font-bold neon-pink">
            <Flame size={14} /> HYPE
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full", hype >= 80 ? "bg-red-500" : "hype-bar-fill")}
              animate={{ width: `${hype}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="text-2xl game-font neon-cyan">{score.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Timer size={10} /> {timeLeft}s
          </div>
        </div>

        <div className="flex flex-col gap-1 w-1/3 items-end">
          <div className="flex items-center gap-1 text-xs font-bold neon-green">
            TOXIC <Skull size={14} />
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden w-full flex justify-end">
            <motion.div 
              className={cn("h-full bg-green-500", toxicity >= 80 && "bg-red-500")}
              animate={{ width: `${toxicity}%` }}
            />
          </div>
        </div>
      </div>

      {/* Arena Feed & Combo (Background subtle) */}
      <div className="flex-1 relative mb-6">
        {combo >= 2 && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-[120px] game-font text-pink-500 mix-blend-overlay">
              X{combo}
            </div>
          </motion.div>
        )}
        
        {/* The Prompt */}
        <motion.div 
          key={currentPrompt.id}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bento-card p-5 border-pink-500/20 bg-gradient-to-b from-zinc-900/50 to-black relative z-10 w-full"
        >
          <div className="flex gap-3 mb-3">
            <img src={currentPrompt.avatar} alt="avatar" className="w-12 h-12 rounded-full border border-zinc-700" />
            <div className="flex flex-col">
              <span className="font-bold text-zinc-100">{currentPrompt.author}</span>
              <span className="text-sm text-zinc-500">{currentPrompt.handle}</span>
            </div>
          </div>
          <p className="text-lg text-zinc-200">{currentPrompt.content}</p>
          <div className="flex gap-4 mt-4 text-zinc-500 text-sm font-mono border-t border-zinc-800/50 pt-3">
            <span className="flex items-center gap-1"><MessageSquare size={14}/> 10K</span>
            <span className="flex items-center gap-1"><Zap size={14}/> {currentPrompt.retweets}</span>
            <span className="flex items-center gap-1"><Flame size={14}/> {currentPrompt.likes}</span>
          </div>
        </motion.div>

        {/* Small Action Feed */}
        <div className="absolute top-0 right-0 p-2 space-y-1 pointer-events-none z-20 flex flex-col items-end w-full overflow-hidden h-24">
          <AnimatePresence>
            {feed.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "text-xs font-bold px-2 py-1 rounded glass-btn border backdrop-blur-sm",
                  item.type === 'gain' ? "text-green-400 border-green-900" :
                  item.type === 'loss' ? "text-red-400 border-red-900" : "text-zinc-400 border-zinc-800"
                )}
              >
                {item.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Abilities */}
      <div className="flex gap-2 mb-4 justify-center">
        <button 
          onClick={() => useAbility('savageBurn')}
          disabled={abilities.savageBurn <= 0}
          className="glass-btn px-4 py-2 rounded-xl text-orange-400 border-orange-500/30 bg-orange-500/5 text-[10px] font-bold uppercase disabled:opacity-30 active:scale-95"
        >
          <span className="text-lg block">💀</span> Burn ({abilities.savageBurn})
        </button>
        <button 
          onClick={() => useAbility('ratioAttack')}
          disabled={abilities.ratioAttack <= 0}
          className="glass-btn px-4 py-2 rounded-xl text-cyan-400 border-cyan-500/30 bg-cyan-500/5 text-[10px] font-bold uppercase disabled:opacity-30 active:scale-95"
        >
          <span className="text-lg block">⚖️</span> Ratio ({abilities.ratioAttack})
        </button>
        <button 
          onClick={() => useAbility('viralBoost')}
          disabled={abilities.viralBoost <= 0}
          className="glass-btn px-4 py-2 rounded-xl text-pink-400 border-pink-500/30 bg-pink-500/5 text-[10px] font-bold uppercase disabled:opacity-30 active:scale-95"
        >
          <span className="text-lg block">🚀</span> Viral ({abilities.viralBoost})
        </button>
      </div>

      {/* Reply Options */}
      <div className="flex flex-col gap-3 z-10 w-full pb-4">
        <AnimatePresence mode="popLayout">
          {replyOptions.map((option, i) => (
            <motion.button
              key={option.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => submitReply(option)}
              className="bento-card p-4 hover:bg-zinc-800/80 border border-zinc-700 shadow-md active:bg-zinc-700 transition-colors text-left"
            >
              <div className="text-zinc-200 font-medium">"{option.text}"</div>
              <div className="flex gap-2 mt-2">
                 <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded glass-btn", 
                    option.type === 'savage' ? "text-pink-400 border-pink-500/30" :
                    option.type === 'ratio' ? "text-cyan-400 border-cyan-500/30" :
                    option.type === 'meme' ? "text-purple-400 border-purple-500/30" :
                    "text-zinc-400 border-zinc-500/30"
                 )}>
                    {option.type}
                 </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
