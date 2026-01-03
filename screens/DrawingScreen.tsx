import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';
import DrawingCanvas from '../components/DrawingCanvas';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function DrawingScreen({ navigation }: any) {
  const { game, endRound } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [isEraser, setIsEraser] = useState(false);
  const [isWordVisible, setIsWordVisible] = useState(true);
  const hasHandledTimeUp = useRef(false);

  // Fixed black pen settings
  const selectedColor = '#000000';
  const strokeWidth = 4;

  useEffect(() => {
    if (!game || !game.currentRound) {
      navigation.navigate('Home');
      return;
    }

    // Reset timer and flag when round changes
    const roundDuration = game.settings.roundDuration;
    setTimeLeft(roundDuration);
    hasHandledTimeUp.current = false;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game?.currentRound?.roundNumber, navigation]);

  // Handle time up separately
  useEffect(() => {
    if (timeLeft === 0 && game && game.currentRound && game.state === 'drawing' && !hasHandledTimeUp.current) {
      hasHandledTimeUp.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // Show timeout message briefly before navigating
      setTimeout(() => {
        endRound();
        setTimeout(() => {
          navigation.navigate('Results');
        }, 1500); // Give 1.5 seconds to see the timeout message
      }, 500);
    }
  }, [timeLeft, game, endRound, navigation]);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    endRound();
    // Navigate to guessing screen after state updates
    setTimeout(() => {
      navigation.navigate('Guessing');
    }, 50);
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setClearTrigger((prev) => prev + 1);
  };

  if (!game || !game.currentRound) {
    return null;
  }

  // Get the drawer
  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);
  
  // Only show the prompt to the drawer
  // In pass-and-play, we assume the drawer has the device at drawing time
  // Set currentPlayerId to drawer when drawing starts
  const isDrawer = game.currentPlayerId === drawer?.id || 
                   (!game.currentPlayerId && drawer?.isDrawing);
  
  // If we're not the drawer, show a message to pass device
  if (!isDrawer || !drawer?.isDrawing) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>
            Yo, {drawer?.name}!
          </Text>
          <Text style={styles.waitingSubtext}>
            It's your turn to draw. Get over here and do your thing.
          </Text>
          <Text style={styles.secretNote}>
            The word is TOP SECRET. Don't let anyone peek. Seriously.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View style={styles.roundProgressContainer}>
            <Text style={styles.roundProgressText}>
              Round {game.currentRound.roundNumber} of {game.settings.roundsPerGame}
            </Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>
        
        <View style={styles.secretPromptContainer}>
          <View style={styles.wordHeader}>
            <Text style={styles.secretLabel}>SECRET WORD</Text>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsWordVisible(!isWordVisible);
              }}
            >
              <Text style={styles.hideButtonText}>
                {isWordVisible ? 'HIDE' : 'SHOW'}
              </Text>
            </TouchableOpacity>
          </View>
          {isWordVisible ? (
            <View style={styles.wordDisplay}>
              <Text style={styles.secretWord}>{game.currentRound.prompt.word.toUpperCase()}</Text>
              <Text style={styles.categoryText}>{game.currentRound.prompt.category}</Text>
            </View>
          ) : (
            <View style={styles.hiddenWordDisplay}>
              <Text style={styles.hiddenWordText}>Word Hidden</Text>
              <Text style={styles.hiddenHint}>Tap SHOW to reveal</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <DrawingCanvas
          color={selectedColor}
          strokeWidth={strokeWidth}
          enabled={true}
          clearTrigger={clearTrigger}
          isEraser={isEraser}
        />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.toolSelector}>
          <TouchableOpacity
            style={[styles.toolButton, !isEraser && styles.toolButtonActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsEraser(false);
            }}
          >
            <Text style={[styles.toolButtonText, !isEraser && styles.toolButtonTextActive]}>
              DRAW
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toolButton, isEraser && styles.toolButtonActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsEraser(true);
            }}
          >
            <Text style={[styles.toolButtonText, isEraser && styles.toolButtonTextActive]}>
              ERASE
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClear}
            disabled={timeLeft <= 0}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.doneButton, timeLeft <= 0 && styles.doneButtonDisabled]} 
            onPress={handleDone}
            disabled={timeLeft <= 0}
          >
            <Text style={styles.doneButtonText}>
              {timeLeft <= 0 ? 'TIME OUT!' : 'I\'M DONE'}
            </Text>
          </TouchableOpacity>
        </View>
        {timeLeft <= 0 && (
          <View style={styles.timeoutContainer}>
            <Text style={styles.timeoutMessage}>⏰ Time's up! Moving to results...</Text>
          </View>
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
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  secretPromptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  secretLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  hideButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 0,
  },
  hideButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  wordDisplay: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
  },
  secretWord: {
    fontSize: 36,
    fontWeight: '900',
    color: '#6366F1',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#8B5CF6',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  hiddenWordDisplay: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  hiddenWordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 6,
  },
  hiddenHint: {
    fontSize: 12,
    color: '#9CA3AF',
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
    marginBottom: 12,
  },
  secretNote: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  canvasContainer: {
    flex: 1,
    padding: 20,
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  toolSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toolButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    maxWidth: 150,
    marginHorizontal: 4,
  },
  toolButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  toolButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  toolButtonTextActive: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneButtonDisabled: {
    backgroundColor: '#EF4444',
    opacity: 0.9,
  },
  timeoutContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  timeoutMessage: {
    fontSize: 15,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: '600',
  },
});

