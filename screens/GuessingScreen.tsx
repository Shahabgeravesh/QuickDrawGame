import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function GuessingScreen({ navigation }: any) {
  const { game, submitGuess, resetGame } = useGame();
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showWaitingAnimation, setShowWaitingAnimation] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!game || !game.currentRound) {
      navigation.navigate('Home');
      return;
    }

    // Navigate to results if round is complete
    if (game.state === 'results' || game.state === 'finished') {
      setTimeout(() => {
        navigation.navigate('Results');
      }, 1000);
      return;
    }

    // If we're in drawing state, navigate back to drawing
    if (game.state === 'drawing') {
      navigation.navigate('Drawing');
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

  // Animated waiting screen effect
  useEffect(() => {
    if (showWaitingAnimation) {
      // Simple progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.03;
        if (progress > 1) progress = 1;
        setAnimationProgress(progress);
      }, 50);

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Navigate to results after 2.5 seconds
      const timer = setTimeout(() => {
        navigation.navigate('Results');
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [showWaitingAnimation, navigation, pulseAnim]);

  const handleSubmitGuess = () => {
    if (!game || !game.currentRound || !currentGuesser) return;
    if (guess.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Hold Up!', 'Your guess can\'t be empty, genius.');
      return;
    }

    const guessText = guess.trim();
    
    // Check if correct for immediate feedback (use same matching logic as submitGuess)
    const normalizedGuess = guessText.toLowerCase().trim();
    const normalizedAnswer = game.currentRound.prompt.word.toLowerCase().trim();
    let isCorrect = normalizedGuess === normalizedAnswer;
    
    // Handle word variations if not exact match
    if (!isCorrect && normalizedGuess.length >= 3 && normalizedAnswer.length >= 3) {
      const baseGuess = normalizedGuess.replace(/(ing|ed|s|es|er|est)$/, '');
      const baseAnswer = normalizedAnswer.replace(/(ing|ed|s|es|er|est)$/, '');
      isCorrect = baseGuess === baseAnswer || 
                  baseGuess === normalizedAnswer || 
                  normalizedGuess === baseAnswer ||
                  normalizedAnswer.includes(normalizedGuess) ||
                  normalizedGuess.includes(normalizedAnswer);
    }
    
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    submitGuess(currentGuesser.id, guessText);
    setGuess('');
    // Navigation will be handled by useEffect when game state changes
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Game?',
      'Are you sure you want to exit? All progress will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            resetGame();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  if (!game || !game.currentRound) {
    return null;
  }

  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);
  
  // Find all players who can guess (non-drawers)
  const guessers = game.players.filter((p) => p.id !== game.currentRound!.drawerId);
  
  // Get unique player IDs who have guessed (avoid duplicates)
  const guessedPlayerIds = Array.from(new Set(game.currentRound.guesses.map((g) => g.playerId)));
  
  // Find the next player who hasn't guessed yet
  // If currentPlayerId is set, use that; otherwise find first who hasn't guessed
  const currentPlayerId = game.currentPlayerId;
  let currentGuesser;
  
  if (currentPlayerId && currentPlayerId !== game.currentRound.drawerId) {
    // Check if the current player has already guessed
    const hasCurrentPlayerGuessed = guessedPlayerIds.includes(currentPlayerId);
    currentGuesser = hasCurrentPlayerGuessed 
      ? null 
      : guessers.find(p => p.id === currentPlayerId);
  }
  
  // If no current player set or current player has guessed, find next available
  if (!currentGuesser) {
    currentGuesser = guessers.find((p) => !guessedPlayerIds.includes(p.id));
  }
  
  // Check if all non-drawers have guessed (properly check each player)
  const allGuessed = guessers.every(guesser => guessedPlayerIds.includes(guesser.id));
  const hasGuessed = currentGuesser ? guessedPlayerIds.includes(currentGuesser.id) : true;
  
  // If all non-drawers have guessed OR someone got it right, show waiting
  if (allGuessed || !currentGuesser) {
    const correctGuess = game.currentRound.guesses.find((g) => g.isCorrect);
    if (correctGuess) {
      // Someone got it right, will navigate to results
      if (!showWaitingAnimation) {
        setTimeout(() => setShowWaitingAnimation(true), 100);
      }
      return (
        <View style={styles.container}>
          <View style={styles.waitingContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={styles.correctText}>YOU GOT IT!</Text>
            </Animated.View>
            <Text style={styles.waitingSubtext}>
              Someone actually guessed it. Wow.
            </Text>
          </View>
        </View>
      );
    }
    
    // Show funny animated waiting screen
    if (!showWaitingAnimation) {
      setTimeout(() => setShowWaitingAnimation(true), 100);
    }
    
    return (
        <View style={styles.container}>
          <View style={styles.waitingContainer}>
            <View style={styles.animationBox}>
              <Svg width={200} height={150} style={styles.waitingSvg}>
                {/* Animated wavy line - draws progressively */}
                {animationProgress > 0 && (
                  <Path
                    d="M 50 75 Q 80 50 110 75 Q 140 100 170 75"
                    stroke="#6366F1"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset={String(300 - (animationProgress * 300))}
                  />
                )}
                {/* Animated dots for loading effect */}
                {animationProgress > 0.5 && (
                  <Circle cx="80" cy="110" r="5" fill="#6366F1" />
                )}
                {animationProgress > 0.7 && (
                  <Circle cx="100" cy="110" r="5" fill="#6366F1" />
                )}
                {animationProgress > 0.9 && (
                  <Circle cx="120" cy="110" r="5" fill="#6366F1" />
                )}
              </Svg>
            </View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={styles.waitingText}>Calculating...</Text>
            </Animated.View>
            <Text style={styles.waitingSubtext}>
              Let's see whose art was actually recognizable
            </Text>
          </View>
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>WHAT EVEN IS THIS?</Text>
            <Text style={styles.drawerName} numberOfLines={1}>{drawer?.name}'s masterpiece</Text>
          </View>
          <View style={styles.headerTopRight}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
            <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.currentPlayerContainer}>
          <Text style={styles.currentPlayerLabel}>YOUR TURN TO GUESS:</Text>
          <View style={styles.playerBadge}>
            <Text style={styles.playerBadgeInitial}>{currentGuesser.name.charAt(0).toUpperCase()}</Text>
            <Text style={styles.currentPlayerName} numberOfLines={1}>{currentGuesser.name}</Text>
          </View>
          <Text style={styles.playerHint} numberOfLines={2}>Pass the device to {currentGuesser.name} if it's not you</Text>
        </View>
      </View>

      <View style={styles.guessesContainer}>
        <Text style={styles.guessesLabel}>Wild Guesses So Far:</Text>
        <FlatList
          data={game.currentRound.guesses}
          keyExtractor={(item, index) => `${item.playerId}-${index}`}
          renderItem={({ item, index }) => {
            const player = game.players.find((p) => p.id === item.playerId);
            const isCorrect = item.isCorrect;
            return (
              <View style={[styles.guessItem, isCorrect && styles.guessItemCorrect]}>
                <View style={styles.guessHeader}>
                  <View style={styles.guessPlayerBadge}>
                    <Text style={styles.guessPlayerInitial}>{player?.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.guessPlayer}>{player?.name}</Text>
                  {isCorrect && (
                    <View style={styles.correctBadge}>
                      <Text style={styles.correctMark}>CORRECT</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.guessText, isCorrect && styles.guessTextCorrect]}>
                  "{item.guess}"
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.noGuesses}>Be the first to take a wild stab at this</Text>
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What do you think this is?"
          placeholderTextColor="#999"
          value={guess}
          onChangeText={setGuess}
          autoCapitalize="words"
          autoCorrect={false}
          onSubmitEditing={handleSubmitGuess}
          editable={!hasGuessed}
        />
        <TouchableOpacity
          style={[styles.submitButton, (!guess.trim() || hasGuessed) && styles.submitButtonDisabled]}
          onPress={handleSubmitGuess}
          disabled={!guess.trim() || hasGuessed}
        >
          <Text style={styles.submitButtonText}>
            {hasGuessed ? 'YOU ALREADY GUESSED' : 'LOCK IT IN'}
          </Text>
        </TouchableOpacity>
        {hasGuessed && (
          <Text style={styles.alreadyGuessedText}>
            You've already submitted your guess. Wait for others.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 80,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    minHeight: 50,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: Math.min(24, width * 0.06),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  drawerName: {
    fontSize: 14,
    color: '#6B7280',
  },
  currentPlayerContainer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  currentPlayerLabel: {
    fontSize: 14,
    color: '#6366F1',
    marginBottom: 4,
  },
  playerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  playerBadgeInitial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 12,
  },
  currentPlayerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  playerHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  correctText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignSelf: 'flex-start',
  },
  exitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  animationBox: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingSvg: {
    opacity: 0.9,
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
    padding: 12,
    minHeight: 150,
  },
  guessesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  guessItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guessItemCorrect: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  guessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  guessPlayerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  guessPlayerInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  guessPlayer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  correctBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  correctMark: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  guessText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 42, // Align with player name
  },
  guessTextCorrect: {
    color: '#059669',
    fontWeight: '600',
  },
  alreadyGuessedText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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
    padding: 12,
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

