import type { Game, GameHistory, GameRound, Player, Reward } from '../types/game';

const now = Date.now();

const basePlayers: Player[] = [
  {
    id: '1',
    name: 'Ava',
    score: 240,
    isDrawing: false,
    achievements: [],
    totalRounds: 3,
    correctGuesses: 2,
    streak: 2,
  },
  {
    id: '2',
    name: 'Milo',
    score: 210,
    isDrawing: false,
    achievements: [],
    totalRounds: 3,
    correctGuesses: 2,
    streak: 1,
  },
];

const previewRewards: Reward[] = [
  {
    type: 'speed',
    title: 'Lightning Guess',
    message: 'Answered in under 5 seconds.',
    points: 8,
  },
  {
    type: 'masterpiece',
    title: 'Masterpiece',
    message: 'Everyone guessed it. Perfect round.',
    points: 6,
  },
];

const buildRound = (overrides: Partial<GameRound>): GameRound => ({
  roundNumber: 1,
  drawerId: '1',
  prompt: { word: 'Hot Air Balloon', category: 'Things' },
  guesses: [
    {
      playerId: '2',
      guess: 'balloon',
      timestamp: now - 15000,
      isCorrect: true,
    },
  ],
  startTime: now - 45000,
  endTime: now - 20000,
  rewards: previewRewards,
  ...overrides,
});

export const getLobbyPreviewGame = (): Game => ({
  id: 'preview-lobby',
  players: [
    {
      id: '1',
      name: 'Ava',
      score: 0,
      isDrawing: false,
      achievements: [],
      totalRounds: 0,
      correctGuesses: 0,
      streak: 0,
    },
  ],
  rounds: [],
  state: 'lobby',
  settings: {
    roundDuration: 60,
    roundsPerGame: 3,
  },
});

export const getDrawingPreviewGame = (): Game => ({
  id: 'preview-drawing',
  players: basePlayers.map((player) => ({
    ...player,
    isDrawing: player.id === '1',
  })),
  currentRound: buildRound({
    roundNumber: 2,
    drawerId: '1',
    startTime: now - 12000,
    guesses: [],
  }),
  rounds: [buildRound({ roundNumber: 1 })],
  state: 'drawing',
  settings: {
    roundDuration: 60,
    roundsPerGame: 3,
  },
  currentPlayerId: '1',
});

export const getResultsPreviewGame = (): Game => ({
  id: 'preview-results',
  players: basePlayers,
  currentRound: undefined,
  rounds: [
    buildRound({ roundNumber: 1 }),
    buildRound({
      roundNumber: 2,
      prompt: { word: 'Dragon', category: 'Fantasy' },
    }),
    buildRound({
      roundNumber: 3,
      prompt: { word: 'Spaceship', category: 'Things' },
      drawerId: '2',
    }),
  ],
  state: 'finished',
  settings: {
    roundDuration: 60,
    roundsPerGame: 3,
  },
});

export const getPreviewHistory = (): GameHistory[] => [
  {
    id: 'preview-history-1',
    gameId: 'preview-game-1',
    completedAt: now - 1000 * 60 * 60 * 24,
    players: basePlayers,
    rounds: [buildRound({ roundNumber: 1 })],
    winner: basePlayers[0],
    totalRounds: 3,
  },
  {
    id: 'preview-history-2',
    gameId: 'preview-game-2',
    completedAt: now - 1000 * 60 * 60 * 72,
    players: basePlayers.map((player) => ({
      ...player,
      score: player.score - 30,
    })),
    rounds: [buildRound({ roundNumber: 1 })],
    winner: basePlayers[1],
    totalRounds: 3,
  },
];

