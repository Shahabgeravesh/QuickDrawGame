import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ResultsScreen({ navigation }: any) {
  const { game, resetGame } = useGame();

  if (!game || !game.currentRound) {
    navigation.navigate('Home');
    return null;
  }

  const handleNextRound = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (game.state === 'finished') {
      resetGame();
      navigation.navigate('Home');
    } else {
      navigation.navigate('Drawing');
    }
  };

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetGame();
    navigation.navigate('Home');
  };

  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const correctGuesses = game.currentRound.guesses.filter((g) => g.isCorrect);
  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {correctGuesses.length > 0 ? 'Correct! 🎉' : 'Time\'s Up! ⏰'}
        </Text>
        <Text style={styles.answerText}>
          The answer was: <Text style={styles.answerWord}>{game.currentRound.prompt.word}</Text>
        </Text>
        <Text style={styles.drawerText}>Drawn by {drawer?.name}</Text>
      </View>

      <View style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>Scores</Text>
        <FlatList
          data={sortedPlayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.scoreCard}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerScore}>{item.score} points</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.scoresList}
        />
      </View>

      <View style={styles.actionsContainer}>
        {game.state === 'finished' ? (
          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextRoundButton} onPress={handleNextRound}>
            <Text style={styles.nextRoundButtonText}>Next Round</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  answerText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 8,
  },
  answerWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  drawerText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 8,
  },
  scoresContainer: {
    flex: 1,
    padding: 16,
  },
  scoresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  scoresList: {
    paddingBottom: 16,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 24,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  playerScore: {
    fontSize: 16,
    color: '#6B7280',
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextRoundButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextRoundButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playAgainButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

