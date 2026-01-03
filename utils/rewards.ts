import { Reward, Guess, Player } from '../types/game';

// Speed-based rewards - balanced points
export function calculateSpeedReward(guessTime: number, roundDuration: number): Reward | null {
  const percentageUsed = (guessTime / roundDuration) * 100;
  
  if (percentageUsed < 15) {
    return {
      type: 'speed',
      title: 'Lightning Brain',
      message: 'You guessed it before most people even looked at the drawing',
      points: 8,
    };
  }
  
  if (percentageUsed < 35) {
    return {
      type: 'speed',
      title: 'Quick on the Draw',
      message: 'Fast guess! You\'re either really smart or really lucky',
      points: 5,
    };
  }
  
  return null;
}

// First guess rewards - balanced
export function calculateFirstGuessReward(isFirstGuess: boolean, wasCorrect: boolean): Reward | null {
  if (isFirstGuess && wasCorrect) {
    return {
      type: 'first',
      title: 'First Try Flex',
      message: 'Got it on the first guess. No need to be so good at this.',
      points: 5,
    };
  }
  
  return null;
}

// Perfect guess rewards - balanced
export function calculatePerfectGuessReward(guessCount: number, wasCorrect: boolean): Reward | null {
  // This is already covered by first guess, so return null to avoid double rewards
  return null;
}

// Streak rewards - balanced
export function calculateStreakReward(streak: number): Reward | null {
  if (streak >= 5) {
    return {
      type: 'streak',
      title: 'UNSTOPPABLE',
      message: `${streak} in a row! You're on fire and everyone else is salty`,
      points: 10,
    };
  }
  
  if (streak >= 3) {
    return {
      type: 'streak',
      title: 'Hot Streak',
      message: 'Three in a row! You\'re getting dangerous',
      points: 5,
    };
  }
  
  return null;
}

// Drawer rewards - balanced and fast
export function calculateDrawerReward(guesserCount: number, totalPlayers: number): Reward | null {
  const maxGuessers = totalPlayers - 1;
  
  if (guesserCount === 0 && maxGuessers > 0) {
    return {
      type: 'masterpiece',
      title: 'Abstract Art Award',
      message: 'Nobody guessed it... but your art was... avant-garde?',
      points: 2, // Small consolation prize
    };
  }
  
  if (guesserCount === maxGuessers && maxGuessers > 0) {
    return {
      type: 'masterpiece',
      title: 'Picasso Who?',
      message: 'Everyone guessed it! Your art skills are actually impressive',
      points: 8,
    };
  }
  
  if (guesserCount >= Math.ceil(maxGuessers / 2)) {
    return {
      type: 'masterpiece',
      title: 'Artistic Legend',
      message: 'Most people got it! Your drawing wasn\'t terrible',
      points: 5,
    };
  }
  
  if (guesserCount > 0) {
    return {
      type: 'masterpiece',
      title: 'Decent Effort',
      message: 'At least someone got it. Your drawing was... recognizable?',
      points: 3,
    };
  }
  
  return null;
}

// Comeback rewards - balanced
export function calculateComebackReward(previousGuesses: number, wasCorrect: boolean): Reward | null {
  if (wasCorrect && previousGuesses >= 3) {
    return {
      type: 'comeback',
      title: 'Never Give Up',
      message: 'You guessed wrong like 3+ times but finally got it. Persistence!',
      points: 3,
    };
  }
  
  return null;
}

// Fast reward calculation - optimized for performance
export function calculateGuessRewards(
  guess: Guess,
  allGuesses: Guess[],
  guesserId: string,
  guessTime: number,
  roundDuration: number,
  player: Player
): Reward[] {
  const rewards: Reward[] = [];
  
  if (!guess.isCorrect) {
    return rewards;
  }
  
  // Fast calculation: count correct guesses in one pass
  let correctCount = 0;
  let incorrectCount = 0;
  for (const g of allGuesses) {
    if (g.isCorrect) {
      correctCount++;
    } else if (g.playerId === guesserId) {
      incorrectCount++;
    }
  }
  
  const isFirstGuess = allGuesses.length === 1;
  const isFirstCorrect = correctCount === 1;
  const newStreak = (player.streak || 0) + 1;
  
  // Speed reward (fastest calculation first)
  const speedReward = calculateSpeedReward(guessTime, roundDuration);
  if (speedReward) rewards.push(speedReward);
  
  // First guess reward (only if this is the very first guess)
  if (isFirstGuess) {
    const firstReward = calculateFirstGuessReward(true, true);
    if (firstReward) rewards.push(firstReward);
  }
  
  // Streak reward (most valuable, check early)
  const streakReward = calculateStreakReward(newStreak);
  if (streakReward) rewards.push(streakReward);
  
  // Comeback reward (only if had wrong guesses)
  if (incorrectCount >= 3) {
    const comebackReward = calculateComebackReward(incorrectCount, true);
    if (comebackReward) rewards.push(comebackReward);
  }
  
  return rewards;
}

// Get funny title based on score
export function getScoreTitle(score: number): { title: string; message: string } {
  if (score >= 200) {
    return {
      title: 'Drawing Game Deity',
      message: 'You have transcended. Bow before your greatness!',
    };
  }
  
  if (score >= 150) {
    return {
      title: 'Master Artist',
      message: 'Your skills are legendary!',
    };
  }
  
  if (score >= 100) {
    return {
      title: 'Drawing Champion',
      message: 'You\'re really good at this!',
    };
  }
  
  if (score >= 50) {
    return {
      title: 'Rising Star',
      message: 'You\'re getting the hang of it!',
    };
  }
  
  if (score >= 20) {
    return {
      title: 'Amateur Artist',
      message: 'Not bad for a beginner!',
    };
  }
  
  return {
    title: 'Getting Started',
    message: 'Everyone starts somewhere!',
  };
}

