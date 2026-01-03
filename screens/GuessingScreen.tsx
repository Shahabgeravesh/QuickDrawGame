import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function GuessingScreen({ navigation }: any) {
  const { game, submitGuess } = useGame();
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!game || !game.currentRound) {
      navigation.navigate('Home');
      return;
    }

    // Navigate to results if round is complete
    if (game.state === 'results') {
      setTimeout(() => {
        navigation.navigate('Results');
      }, 1000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game, navigation]);

  const handleSubmitGuess = () => {
    if (!game || !game.currentRound || !currentGuesser) return;
    if (guess.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitGuess(currentGuesser.id, guess.trim());
    setGuess('');
    // Navigation will be handled by useEffect when game state changes
  };

  if (!game || !game.currentRound) {
    return null;
  }

  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);
  
  // Find next player who hasn't guessed yet
  const guessers = game.players.filter((p) => !p.isDrawing);
  const guessedPlayerIds = game.currentRound.guesses.map((g) => g.playerId);
  const currentGuesser = guessers.find((p) => !guessedPlayerIds.includes(p.id));
  
  // If all non-drawers have guessed, show waiting
  if (!currentGuesser || guessers.length === guessedPlayerIds.length) {
    const correctGuess = game.currentRound.guesses.find((g) => g.isCorrect);
    if (correctGuess) {
      // Someone got it right, will navigate to results
      return (
        <View style={styles.container}>
          <View style={styles.waitingContainer}>
            <Text style={styles.correctText}>🎉 Correct Guess!</Text>
            <Text style={styles.waitingSubtext}>
              Moving to results...
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>All players have guessed</Text>
          <Text style={styles.waitingSubtext}>
            Moving to results...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's being drawn?</Text>
        <Text style={styles.drawerName}>by {drawer?.name}</Text>
        <View style={styles.currentPlayerContainer}>
          <Text style={styles.currentPlayerLabel}>Your turn:</Text>
          <Text style={styles.currentPlayerName}>{currentGuesser.name}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.guessesContainer}>
        <Text style={styles.guessesLabel}>Previous guesses:</Text>
        <FlatList
          data={game.currentRound.guesses}
          keyExtractor={(item, index) => `${item.playerId}-${index}`}
          renderItem={({ item }) => {
            const player = game.players.find((p) => p.id === item.playerId);
            return (
              <View style={styles.guessItem}>
                <Text style={styles.guessPlayer}>{player?.name}:</Text>
                <Text style={styles.guessText}>{item.guess}</Text>
                {item.isCorrect && (
                  <Text style={styles.correctMark}>✓</Text>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.noGuesses}>No guesses yet...</Text>
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your guess"
          placeholderTextColor="#999"
          value={guess}
          onChangeText={setGuess}
          autoCapitalize="words"
          autoCorrect={false}
          onSubmitEditing={handleSubmitGuess}
          editable={!hasGuessed}
        />
        <TouchableOpacity
          style={[styles.submitButton, !guess.trim() && styles.submitButtonDisabled]}
          onPress={handleSubmitGuess}
          disabled={!guess.trim() || hasGuessed}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  drawerName: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 12,
  },
  currentPlayerContainer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  currentPlayerLabel: {
    fontSize: 14,
    color: '#6366F1',
    marginBottom: 4,
  },
  currentPlayerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  correctText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  waitingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  waitingSubtext: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  guessesContainer: {
    flex: 1,
    padding: 16,
  },
  guessesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  guessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  guessPlayer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  guessText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  correctMark: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: 'bold',
  },
  noGuesses: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

