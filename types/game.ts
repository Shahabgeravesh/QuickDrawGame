export type Player = {
  id: string;
  name: string;
  score: number;
  isDrawing: boolean;
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
};

