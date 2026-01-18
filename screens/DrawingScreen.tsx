import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import DrawingCanvas from '../components/DrawingCanvas';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, radius, shadows } from '../theme';
import PreviewCanvas from '../components/preview/PreviewCanvas';
import PreviewSketch from '../components/preview/PreviewSketch';

const { width, height } = Dimensions.get('window');

export default function DrawingScreen({ navigation, route }: any) {
  const { game, endRound, resetGame } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [isEraser, setIsEraser] = useState(false);
  const [isWordVisible, setIsWordVisible] = useState(true);
  const hasHandledTimeUp = useRef(false);

  // Fixed black pen settings
  const selectedColor = '#000000';
  const strokeWidth = 4;

  const isPreview = route?.params?.previewMode === true;

  useEffect(() => {
    if (isPreview) {
      setTimeLeft(45);
      return;
    }
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
  }, [game?.currentRound?.roundNumber, navigation, isPreview]);

  // Handle time up separately
  useEffect(() => {
    if (isPreview) {
      return;
    }
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
  }, [timeLeft, game, endRound, navigation, isPreview]);

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

  // Get the drawer
  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);
  
  // Only show the prompt to the drawer
  // In pass-and-play, we assume the drawer has the device at drawing time
  // Set currentPlayerId to drawer when drawing starts
  const isDrawer = game.currentPlayerId === drawer?.id || 
                   (!game.currentPlayerId && drawer?.isDrawing);
  
  // If we're not the drawer, show a message to pass device
  if (!isDrawer || !drawer?.isDrawing) {
    const waitingContent = (
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

    if (route?.params?.previewMeta) {
      return <PreviewCanvas meta={route.params.previewMeta}>{waitingContent}</PreviewCanvas>;
    }

    return waitingContent;
  }

  const content = (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <View style={styles.roundProgressContainer}>
            <Text style={styles.roundProgressText} numberOfLines={1}>
              Round {game.currentRound.roundNumber} of {game.settings.roundsPerGame}
            </Text>
        </View>
          <View style={styles.topBarRight}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
            <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
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
        {isPreview ? <PreviewSketch /> : null}
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
    </SafeAreaView>
  );

  if (route?.params?.previewMeta) {
    return <PreviewCanvas meta={route.params.previewMeta}>{content}</PreviewCanvas>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 40,
  },
  secretPromptContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  secretLabel: {
    ...typography.caption,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  hideButton: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 0,
  },
  hideButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  wordDisplay: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.brand,
    alignItems: 'center',
  },
  secretWord: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: '900',
    color: colors.brand,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  hiddenWordDisplay: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  hiddenWordText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  hiddenHint: {
    ...typography.caption,
    textAlign: 'center',
  },
  roundProgressContainer: {
    flex: 1,
    marginRight: 12,
    minWidth: 100,
  },
  roundProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerContainer: {
    backgroundColor: colors.danger,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exitButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  waitingContainer: {
    margin: spacing.xxl,
    padding: spacing.xxl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.md,
  },
  waitingText: {
    ...typography.title,
    color: colors.brand,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  waitingSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  secretNote: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
  },
  canvasContainer: {
    flex: 1,
    padding: spacing.lg,
    minHeight: 200,
    position: 'relative',
  },
  controlsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toolSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  toolButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    maxWidth: 150,
    marginHorizontal: spacing.sm,
  },
  toolButtonActive: {
    borderColor: colors.brand,
    backgroundColor: colors.surfaceAlt,
  },
  toolButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toolButtonTextActive: {
    color: colors.brand,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  doneButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  doneButtonDisabled: {
    backgroundColor: colors.danger,
    opacity: 0.9,
  },
  timeoutContainer: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
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

