export type Achievement = {
  id: string;
  name: string;
  description: string;
  points: number;
  unlockedAt: number;
};

export type Reward = {
  type: 'speed' | 'accuracy' | 'comeback' | 'first' | 'perfect' | 'streak' | 'masterpiece';
  title: string;
  message: string;
  points: number;
  multiplier?: number;
};

export type Player = {
  id: string;
  name: string;
  score: number;
  isDrawing: boolean;
  achievements: Achievement[];
  totalRounds: number;
  correctGuesses: number;
  fastestGuess?: number;
  streak: number;
};

export type GameState = 'lobby' | 'drawing' | 'guessing' | 'results' | 'finished';

export type DrawingPrompt = {
  word: string;
  category: string;
};

export type Guess = {
  playerId: string;
  guess: string;
  timestamp: number;
  isCorrect: boolean;
};

export type GameRound = {
  roundNumber: number;
  drawerId: string;
  prompt: DrawingPrompt;
  guesses: Guess[];
  startTime: number;
  endTime?: number;
  rewards?: Reward[];
};

export type Game = {
  id: string;
  players: Player[];
  currentRound?: GameRound;
  rounds: GameRound[];
  state: GameState;
  settings: {
    roundDuration: number; // in seconds
    roundsPerGame: number;
  };
  roundRewards?: Reward[];
  currentPlayerId?: string; // Who is currently holding/using the device
};

export type GameHistory = {
  id: string;
  gameId: string;
  completedAt: number;
  players: Player[];
  rounds: GameRound[];
  winner: Player | null;
  totalRounds: number;
};

