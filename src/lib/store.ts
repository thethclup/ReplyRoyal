import { create } from 'zustand';

export type GamePhase = 'LOBBY' | 'PLAYING' | 'GAMEOVER';

export interface Prompt {
  id: string;
  author: string;
  handle: string;
  content: string;
  avatar: string;
  likes: string;
  retweets: string;
}

export interface ReplyOption {
  id: string;
  text: string;
  hypeEffect: number;
  toxicityEffect: number;
  scoreMultiplier: number;
  type: 'savage' | 'ratio' | 'meme' | 'cringe' | 'witty' | 'neutral';
}

export interface GameState {
  phase: GamePhase;
  hype: number;
  toxicity: number;
  score: number;
  combo: number;
  maxCombo: number;
  currentPrompt: Prompt | null;
  replyOptions: ReplyOption[];
  timeLeft: number;
  feed: { id: number; text: string; type: 'gain' | 'loss' | 'neutral' }[];
  abilities: {
    savageBurn: number;
    ratioAttack: number;
    viralBoost: number;
  };
  setPhase: (phase: GamePhase) => void;
  startGame: () => void;
  endGame: () => void;
  submitReply: (reply: ReplyOption) => void;
  useAbility: (ability: keyof GameState['abilities']) => void;
  tickGame: () => void;
  generateNewPrompt: () => void;
}

const mockPrompts: Prompt[] = [
  { id: '1', author: 'Elon Musk', handle: '@elonmusk', content: 'Thinking about buying Twitter again, but this time I\'ll pay in Doge.', avatar: 'https://i.pravatar.cc/150?u=elon', likes: '1.2M', retweets: '200K' },
  { id: '2', author: 'CryptoBro', handle: '@moonboy', content: 'If you aren\'t buying this dip you hate money. HODL or stay poor!', avatar: 'https://i.pravatar.cc/150?u=crypto', likes: '12K', retweets: '4K' },
  { id: '3', author: 'Influencer', handle: '@maincharacter', content: 'Just drank water for the first time in 3 days. Self-care is so important ❤️', avatar: 'https://i.pravatar.cc/150?u=influencer', likes: '450K', retweets: '20K' },
  { id: '4', author: 'Tech CEO', handle: '@disruptor', content: 'We are pivoting to AI-driven blockchain synergies to optimize our Q4 ROI.', avatar: 'https://i.pravatar.cc/150?u=tech', likes: '8K', retweets: '1K' },
];

const mockReplies: ReplyOption[] = [
  { id: 'r1', text: 'Ratio.', hypeEffect: 15, toxicityEffect: 20, scoreMultiplier: 1.5, type: 'ratio' },
  { id: 'r2', text: 'Bro is yapping out of his mind rn 💀', hypeEffect: 10, toxicityEffect: 25, scoreMultiplier: 1.2, type: 'savage' },
  { id: 'r3', text: 'This aint it chief', hypeEffect: 5, toxicityEffect: 5, scoreMultiplier: 1.1, type: 'neutral' },
  { id: 'r4', text: 'W post.', hypeEffect: 2, toxicityEffect: -5, scoreMultiplier: 1.0, type: 'witty' },
  { id: 'r5', text: "L + ratio + didn't ask + you fell off", hypeEffect: 30, toxicityEffect: 40, scoreMultiplier: 2.0, type: 'savage' },
  { id: 'r6', text: 'Post wallet.', hypeEffect: 20, toxicityEffect: 15, scoreMultiplier: 1.8, type: 'witty' },
  { id: 'r7', text: '*Drops massive meme*', hypeEffect: 25, toxicityEffect: 10, scoreMultiplier: 1.7, type: 'meme' },
];

function getRandomOptions(count: number): ReplyOption[] {
  const shuffled = [...mockReplies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'LOBBY',
  hype: 50,
  toxicity: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  currentPrompt: null,
  replyOptions: [],
  timeLeft: 60,
  feed: [],
  abilities: {
    savageBurn: 1,
    ratioAttack: 1,
    viralBoost: 1,
  },
  setPhase: (phase) => set({ phase }),
  generateNewPrompt: () => {
    const prompt = mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
    const options = getRandomOptions(3);
    set({ currentPrompt: prompt, replyOptions: options });
  },
  startGame: () => {
    set({
      phase: 'PLAYING',
      hype: 50,
      toxicity: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      timeLeft: 60,
      feed: [{ id: Date.now(), text: 'Arena matched. ROUND START!', type: 'neutral' }],
      abilities: { savageBurn: 1, ratioAttack: 1, viralBoost: 1 },
    });
    get().generateNewPrompt();
  },
  endGame: () => {
    set({ phase: 'GAMEOVER' });
  },
  submitReply: (reply) => {
    const state = get();
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (reply.type === 'savage' || reply.type === 'ratio') {
        navigator.vibrate([100, 50, 100]);
      } else {
        navigator.vibrate(50);
      }
    }
    
    // Calculate new stats
    const newHype = Math.min(100, Math.max(0, state.hype + reply.hypeEffect));
    let newToxicity = state.toxicity + reply.toxicityEffect;
    let newCombo = state.combo;
    let comboLost = false;

    if (newToxicity > 100) {
      newToxicity = Math.max(0, newToxicity - 50); // Get banned temporarily, lose hype & combo
      newCombo = 0;
      comboLost = true;
    } else if (reply.type === 'cringe') {
      newCombo = 0;
      comboLost = true;
    } else {
      newCombo += 1;
    }

    const pointsEarned = Math.floor(100 * reply.scoreMultiplier * (1 + newCombo * 0.1) * (newHype / 50));
    
    const feedItem = {
      id: Date.now(),
      text: comboLost ? `Combo breaks! Sent to shadowban realm` : `+${pointsEarned} pt | ${reply.type.toUpperCase()}`,
      type: (comboLost ? 'loss' : 'gain') as 'loss' | 'gain',
    };

    set({
      hype: newHype,
      toxicity: newToxicity,
      score: state.score + pointsEarned,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      feed: [feedItem, ...state.feed].slice(0, 5),
    });

    get().generateNewPrompt();
  },
  useAbility: (ability) => {
    const state = get();
    if (state.abilities[ability] > 0) {
      const feedItem = {
        id: Date.now(),
        text: `Used Ability: ${ability.toUpperCase()}!`,
        type: 'gain' as const,
      };
      
      let hypeBonus = 0;
      let scoreBonus = 0;

      if (ability === 'savageBurn') { hypeBonus = 20; scoreBonus = 500; }
      if (ability === 'ratioAttack') { hypeBonus = 30; scoreBonus = 1000; }
      if (ability === 'viralBoost') { hypeBonus = 50; }

      set({
        abilities: { ...state.abilities, [ability]: state.abilities[ability] - 1 },
        hype: Math.min(100, state.hype + hypeBonus),
        score: state.score + scoreBonus,
        feed: [feedItem, ...state.feed].slice(0, 5),
      });
    }
  },
  tickGame: () => {
    const state = get();
    if (state.phase === 'PLAYING') {
      if (state.timeLeft <= 0) {
        state.endGame();
      } else {
        set({ timeLeft: state.timeLeft - 1 });
      }
    }
  }
}));
