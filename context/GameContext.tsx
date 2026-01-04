import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Game, Player, GameRound, DrawingPrompt, Guess, GameHistory } from '../types/game';
import { getRandomPrompt } from '../data/prompts';
import { 
  calculateGuessRewards, 
  calculateDrawerReward, 
  calculateSpeedReward 
} from '../utils/rewards';
import { saveGameHistory, loadGameHistory, deleteGameHistory, clearAllGameHistory } from '../utils/storage';

// Helper function to check if guesses match (handles variations like cycle/cycling)
function isGuessCorrect(guess: string, correctAnswer: string): boolean {
  const normalizedGuess = guess.toLowerCase().trim();
  const normalizedAnswer = correctAnswer.toLowerCase().trim();
  
  // Exact match (fast path)
  if (normalizedGuess === normalizedAnswer) {
    return true;
  }
  
  // Check if one contains the other (minimum 3 characters to avoid false positives)
  if (normalizedGuess.length >= 3 && normalizedAnswer.length >= 3) {
    // Check if guess is contained in answer or vice versa
    if (normalizedAnswer.includes(normalizedGuess) || normalizedGuess.includes(normalizedAnswer)) {
      // Get the base word (shorter one, or the one without common suffixes)
      const baseGuess = normalizedGuess.replace(/(ing|ed|s|es|er|est)$/, '');
      const baseAnswer = normalizedAnswer.replace(/(ing|ed|s|es|er|est)$/, '');
      
      // If base words match, it's correct
      if (baseGuess === baseAnswer && baseGuess.length >= 3) {
        return true;
      }
      
      // Check if one is the base of the other
      if (baseGuess === normalizedAnswer || normalizedGuess === baseAnswer) {
        return true;
      }
    }
  }
  
  // Handle common word variations
  const commonSuffixes = ['ing', 'ed', 's', 'es', 'er', 'est'];
  for (const suffix of commonSuffixes) {
    // Remove suffix from both and compare
    const guessWithoutSuffix = normalizedGuess.endsWith(suffix) 
      ? normalizedGuess.slice(0, -suffix.length) 
      : normalizedGuess;
    const answerWithoutSuffix = normalizedAnswer.endsWith(suffix)
      ? normalizedAnswer.slice(0, -suffix.length)
      : normalizedAnswer;
    
    if (guessWithoutSuffix === normalizedAnswer || normalizedGuess === answerWithoutSuffix) {
      return true;
    }
    
    // Compare both without suffixes
    if (guessWithoutSuffix === answerWithoutSuffix && guessWithoutSuffix.length >= 3) {
      return true;
    }
  }
  
  return false;
}

interface GameContextType {
  game: Game | null;
  createGame: (playerName: string) => void;
  addPlayer: (name: string) => void;
  setRoundsPerGame: (rounds: number) => void;
  startGame: () => void;
  startRound: () => void;
  submitGuess: (playerId: string, guess: string) => void;
  endRound: () => void;
  resetGame: () => void;
  gameHistory: GameHistory[];
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  // Load history on app start
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await loadGameHistory();
      setGameHistory(history);
    };
    fetchHistory();
  }, []);

  const createGame = useCallback((playerName: string) => {
    const newGame: Game = {
      id: Date.now().toString(),
      players: [
        {
          id: '1',
          name: playerName,
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
    };
    setGame(newGame);
  }, []);

  const addPlayer = useCallback((name: string) => {
    setGame((prev) => {
      if (!prev) return null;
      const newPlayer: Player = {
        id: (prev.players.length + 1).toString(),
        name,
        score: 0,
        isDrawing: false,
        achievements: [],
        totalRounds: 0,
        correctGuesses: 0,
        streak: 0,
      };
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });
  }, []);

  const setRoundsPerGame = useCallback((rounds: number) => {
    setGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          roundsPerGame: rounds,
        },
      };
    });
  }, []);

  const startRound = useCallback(() => {
    setGame((prev) => {
      if (!prev) return null;
      
      // Calculate next round number based on completed rounds
      const completedRounds = prev.rounds?.length || 0;
      const roundNumber = completedRounds + 1;
      
      // Check if we've reached the max rounds
      if (roundNumber > prev.settings.roundsPerGame) {
        return prev; // Don't start a new round if we've exceeded the limit
      }
      
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
        currentPlayerId: drawer.id, // Set drawer as current player
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
      
      // Start the first round immediately
      const roundNumber = 1;
      const drawerIndex = 0;
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
        currentPlayerId: drawer.id, // Set drawer as current player
        players: prev.players.map((p) => ({
          ...p,
          isDrawing: p.id === drawer.id,
        })),
      };
    });
  }, []);

  const submitGuess = useCallback((playerId: string, guess: string) => {
    if (!game || !game.currentRound) return;
    if (playerId === game.currentRound.drawerId) return; // Drawer can't guess

    // Check if this player has already guessed
    const alreadyGuessed = game.currentRound.guesses.some(g => g.playerId === playerId);
    if (alreadyGuessed) return; // Prevent duplicate guesses

    // Use flexible matching to handle word variations (e.g., cycle/cycling)
    const isCorrect = isGuessCorrect(guess, game.currentRound.prompt.word);
    const guessTime = Date.now() - game.currentRound.startTime;

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

      // Fast calculation: Calculate everything in one pass
      const guesser = prev.players.find(p => p.id === playerId);
      const guessTimeSeconds = Math.floor(guessTime / 1000);
      const correctGuessesCount = updatedRound.guesses.filter(g => g.isCorrect).length;
      
      // Calculate rewards efficiently (only if correct)
      const rewards = isCorrect && guesser
        ? calculateGuessRewards(
            newGuess,
            updatedRound.guesses,
            playerId,
            guessTimeSeconds,
            prev.settings.roundDuration,
            guesser
          )
        : [];

      // Calculate drawer reward once (if applicable)
      const drawerReward = isCorrect 
        ? calculateDrawerReward(correctGuessesCount, prev.players.length)
        : null;

      // Single pass through players for maximum speed
      const now = Date.now();
      const updatedPlayers = prev.players.map((player) => {
        // Fast path: if this player isn't involved, return as-is
        if (player.id !== playerId && player.id !== prev.currentRound!.drawerId) {
          return player;
        }

        let newScore = player.score;
        let newStreak = player.streak || 0;
        let correctGuesses = player.correctGuesses || 0;
        const newAchievements = [...(player.achievements || [])];
        
        // Guesser scoring (fast calculation)
        if (isCorrect && player.id === playerId) {
          // Base points: 10
          const basePoints = 10;
          // Time bonus: 1 point per 10 seconds remaining (max 5 points)
          const timeRemaining = Math.max(0, prev.settings.roundDuration - guessTimeSeconds);
          const timeBonus = Math.min(5, Math.floor(timeRemaining / 10));
          
          // Calculate total reward points
          let rewardPoints = 0;
          rewards.forEach(reward => {
            rewardPoints += reward.points;
            newAchievements.push({
              id: `${now}-${Math.random()}`,
              name: reward.title,
              description: reward.message,
              points: reward.points,
              unlockedAt: now,
            });
          });
          
          newScore += basePoints + timeBonus + rewardPoints;
          newStreak = (newStreak || 0) + 1;
          correctGuesses += 1;
        } else if (player.id === playerId && !isCorrect) {
          // Reset streak on wrong guess
          newStreak = 0;
        }
        
        // Drawer scoring (fast calculation)
        if (isCorrect && player.id === prev.currentRound!.drawerId) {
          const drawerPoints = drawerReward ? drawerReward.points : 3; // Base 3 points
          newScore += drawerPoints;
          if (drawerReward) {
            newAchievements.push({
              id: `${now}-${Math.random()}`,
              name: drawerReward.title,
              description: drawerReward.message,
              points: drawerReward.points,
              unlockedAt: now,
            });
          }
        }
        
        return {
          ...player,
          score: newScore,
          streak: newStreak,
          correctGuesses: correctGuesses,
          achievements: newAchievements,
        };
      });

        // Find next guesser after this one submits
        const guessers = prev.players.filter(p => p.id !== prev.currentRound!.drawerId);
        const guessedPlayerIds = Array.from(new Set(updatedRound.guesses.map(g => g.playerId)));
        const nextGuesser = guessers.find(p => !guessedPlayerIds.includes(p.id));

        // Collect all rewards for the round (guesser + drawer)
        const allRoundRewards = [...rewards];
        if (drawerReward) {
          allRoundRewards.push(drawerReward);
        }

        return {
          ...prev,
          currentRound: {
            ...updatedRound,
            rewards: allRoundRewards, // Store all rewards for display
          },
          players: updatedPlayers,
          currentPlayerId: isCorrect ? undefined : (nextGuesser?.id || prev.currentPlayerId),
          state: isCorrect ? 'results' : prev.state,
        };
    });
  }, [game]);

  const endRound = useCallback(() => {
    setGame((prev) => {
      if (!prev || !prev.currentRound) return prev;

      // Fast calculation: Count correct guesses once
      const correctCount = prev.currentRound.guesses.filter(g => g.isCorrect).length;
      const drawerReward = calculateDrawerReward(correctCount, prev.players.length);
      
      // Add drawer reward to round rewards if applicable
      const existingRewards = prev.currentRound.rewards || [];
      const allRewardsWithDrawer = drawerReward 
        ? [...existingRewards, drawerReward]
        : existingRewards;

      // Give drawer points from rewards (optimized)
      const drawerId = prev.currentRound!.drawerId;
      const drawerRewardPoints = drawerReward ? drawerReward.points : 0;
      
      const updatedPlayers = prev.players.map((player) => {
        if (player.id === drawerId) {
          return {
            ...player,
            score: player.score + drawerRewardPoints,
            totalRounds: (player.totalRounds || 0) + 1,
          };
        }
        return {
          ...player,
          totalRounds: (player.totalRounds || 0) + 1,
        };
      });

      const updatedRound = {
        ...prev.currentRound,
        endTime: Date.now(),
        rewards: allRewardsWithDrawer, // All rewards including drawer reward
      };

      const allRounds = [...prev.rounds, updatedRound];
      const isGameFinished = allRounds.length >= prev.settings.roundsPerGame;

      // Find first guesser for guessing phase (after drawing ends)
      const guessers = prev.players.filter(p => p.id !== prev.currentRound!.drawerId);
      const firstGuesser = guessers[0] || null;

      // If game is finished, save to history and mark as finished
      if (isGameFinished) {
        const finishedGame = {
          ...prev,
          rounds: allRounds,
          currentRound: undefined,
          state: 'finished' as const,
          players: updatedPlayers,
          roundRewards: allRewardsWithDrawer,
        };
        
        // Save to history asynchronously
        saveGameHistory(finishedGame).then(() => {
          loadGameHistory().then(history => setGameHistory(history));
        }).catch(console.error);
        
        return finishedGame;
      }

      // Transition to guessing state - don't start next round yet
      // The next round will start from ResultsScreen when user clicks "Next Round"
      return {
        ...prev,
        rounds: allRounds,
        currentRound: updatedRound, // Keep the same round, now in guessing phase
        state: 'guessing',
        currentPlayerId: firstGuesser?.id || undefined, // Set first guesser
        players: updatedPlayers,
        roundRewards: allRewardsWithDrawer,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGame(null);
  }, []);

  const deleteHistoryEntry = useCallback(async (id: string) => {
    await deleteGameHistory(id);
    const updatedHistory = await loadGameHistory();
    setGameHistory(updatedHistory);
  }, []);

  const clearHistory = useCallback(async () => {
    await clearAllGameHistory();
    setGameHistory([]);
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        createGame,
        addPlayer,
        setRoundsPerGame,
        startGame,
        startRound,
        submitGuess,
        endRound,
        resetGame,
        gameHistory,
        deleteHistoryEntry,
        clearHistory,
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

