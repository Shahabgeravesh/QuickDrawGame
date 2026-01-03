import React, { createContext, useContext, useState, useCallback } from 'react';
import { Game, Player, GameRound, DrawingPrompt, Guess } from '../types/game';
import { getRandomPrompt } from '../data/prompts';

interface GameContextType {
  game: Game | null;
  createGame: (playerName: string) => void;
  addPlayer: (name: string) => void;
  startGame: () => void;
  startRound: () => void;
  submitGuess: (playerId: string, guess: string) => void;
  endRound: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game | null>(null);

  const createGame = useCallback((playerName: string) => {
    const newGame: Game = {
      id: Date.now().toString(),
      players: [
        {
          id: '1',
          name: playerName,
          score: 0,
          isDrawing: false,
        },
      ],
      rounds: [],
      state: 'lobby',
      settings: {
        roundDuration: 60,
        roundsPerGame: 3,
      },
    };
    setGame(newGame);
  }, []);

  const addPlayer = useCallback((name: string) => {
    if (!game) return;
    const newPlayer: Player = {
      id: (game.players.length + 1).toString(),
      name,
      score: 0,
      isDrawing: false,
    };
    setGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });
  }, [game]);

  const startRound = useCallback(() => {
    setGame((prev) => {
      if (!prev) return null;
      const roundNumber = prev.rounds.length + 1;
      const drawerIndex = (roundNumber - 1) % prev.players.length;
      const drawer = prev.players[drawerIndex];
      const prompt = getRandomPrompt();

      const newRound: GameRound = {
        roundNumber,
        drawerId: drawer.id,
        prompt,
        guesses: [],
        startTime: Date.now(),
      };

      return {
        ...prev,
        currentRound: newRound,
        state: 'drawing',
        players: prev.players.map((p) => ({
          ...p,
          isDrawing: p.id === drawer.id,
        })),
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGame((prev) => {
      if (!prev || prev.players.length < 2) return prev;
      return {
        ...prev,
        state: 'drawing',
      };
    });
    // Use setTimeout to ensure state is updated before starting round
    setTimeout(() => {
      startRound();
    }, 0);
  }, [startRound]);

  const submitGuess = useCallback((playerId: string, guess: string) => {
    if (!game || !game.currentRound) return;
    if (playerId === game.currentRound.drawerId) return; // Drawer can't guess

    const normalizedGuess = guess.toLowerCase().trim();
    const correctAnswer = game.currentRound.prompt.word.toLowerCase().trim();
    const isCorrect = normalizedGuess === correctAnswer;

    const newGuess: Guess = {
      playerId,
      guess,
      timestamp: Date.now(),
      isCorrect,
    };

    setGame((prev) => {
      if (!prev || !prev.currentRound) return null;
      const updatedRound = {
        ...prev.currentRound,
        guesses: [...prev.currentRound.guesses, newGuess],
      };

      // Update scores
      const updatedPlayers = prev.players.map((player) => {
        if (isCorrect && player.id === playerId) {
          // Guesser gets points
          const timeBonus = Math.max(0, 60 - Math.floor((Date.now() - prev.currentRound!.startTime) / 1000));
          return { ...player, score: player.score + 10 + timeBonus };
        }
        if (isCorrect && player.id === prev.currentRound!.drawerId) {
          // Drawer gets points when someone guesses correctly
          return { ...player, score: player.score + 5 };
        }
        return player;
      });

      return {
        ...prev,
        currentRound: updatedRound,
        players: updatedPlayers,
        state: isCorrect ? 'results' : prev.state,
      };
    });
  }, [game]);

  const endRound = useCallback(() => {
    setGame((prev) => {
      if (!prev || !prev.currentRound) return prev;

      const updatedRound = {
        ...prev.currentRound,
        endTime: Date.now(),
      };

      const allRounds = [...prev.rounds, updatedRound];
      const isGameFinished = allRounds.length >= prev.settings.roundsPerGame;

      // Start next round if game not finished
      if (!isGameFinished) {
        setTimeout(() => {
          startRound();
        }, 3000);
      }

      return {
        ...prev,
        rounds: allRounds,
        currentRound: undefined,
        state: isGameFinished ? 'finished' : 'drawing',
      };
    });
  }, [startRound]);

  const resetGame = useCallback(() => {
    setGame(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        createGame,
        addPlayer,
        startGame,
        startRound,
        submitGuess,
        endRound,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

