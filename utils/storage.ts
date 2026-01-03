import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, GameHistory, Player } from '../types/game';

const HISTORY_KEY = '@QuickDrawGame:history';

export async function saveGameHistory(game: Game): Promise<void> {
  try {
    if (game.state !== 'finished' || game.rounds.length === 0) {
      return; // Only save completed games
    }

    // Get winner (player with highest score)
    const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0] || null;

    const historyEntry: GameHistory = {
      id: Date.now().toString(),
      gameId: game.id,
      completedAt: Date.now(),
      players: game.players.map(p => ({
        ...p,
        isDrawing: false, // Clear drawing state for history
      })),
      rounds: game.rounds,
      winner,
      totalRounds: game.rounds.length,
    };

    // Load existing history
    const existingHistory = await loadGameHistory();
    const updatedHistory = [historyEntry, ...existingHistory];

    // Save updated history
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving game history:', error);
  }
}

export async function loadGameHistory(): Promise<GameHistory[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading game history:', error);
    return [];
  }
}

export async function deleteGameHistory(historyId: string): Promise<void> {
  try {
    const existingHistory = await loadGameHistory();
    const updatedHistory = existingHistory.filter(h => h.id !== historyId);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting game history:', error);
  }
}

export async function clearAllGameHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing game history:', error);
  }
}

