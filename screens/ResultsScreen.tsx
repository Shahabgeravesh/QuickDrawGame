import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';
import { getScoreTitle } from '../utils/rewards';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { colors, spacing, typography, radius, shadows } from '../theme';
import PreviewCanvas from '../components/preview/PreviewCanvas';

const { width, height } = Dimensions.get('window');

export default function ResultsScreen({ navigation, route }: any) {
  const { game, resetGame, startRound } = useGame();
  const [showRewards, setShowRewards] = useState(false);
  const hasNavigatedAway = useRef(false); // Track if we've already navigated away
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    // Early return if we've already navigated away - don't process anything
    if (hasNavigatedAway.current) {
      return;
    }
    
    console.log('[DEBUG ResultsScreen] useEffect triggered');
    console.log('[DEBUG ResultsScreen] Game state:', game?.state);
    console.log('[DEBUG ResultsScreen] Has game:', !!game);
    console.log('[DEBUG ResultsScreen] Has currentRound:', !!game?.currentRound);
    console.log('[DEBUG ResultsScreen] Rounds completed:', game?.rounds?.length);
    console.log('[DEBUG ResultsScreen] Rounds per game:', game?.settings?.roundsPerGame);
    
    if (!game) {
      console.log('[DEBUG ResultsScreen] No game - skipping navigation');
      return;
    }
    
    // If game is in lobby state, navigate to lobby or home (shouldn't be on results screen)
    if (game.state === 'lobby') {
      console.log('[DEBUG ResultsScreen] Game in lobby state - skipping navigation');
      return;
    }
    
    // If game is finished, show final results (don't navigate away)
    // Finished games don't have currentRound, which is expected
    if (game.state === 'finished') {
      console.log('[DEBUG ResultsScreen] Game finished - showing final results');
      setShowRewards(true);
      return;
    }
    
    // If no current round and not finished/results, navigate home
    // (For results state, we should have currentRound)
    if (!game.currentRound) {
      console.log('[DEBUG ResultsScreen] No currentRound and not finished - skipping navigation');
      console.log('[DEBUG ResultsScreen] Game state was:', game.state);
      return;
    }
    
    console.log('[DEBUG ResultsScreen] Showing rewards for round:', game.currentRound?.roundNumber);
    // Show rewards immediately for faster feedback
    setShowRewards(true);
  }, [game, navigation, isFocused]);

  // Watch for round start and navigate when ready
  useEffect(() => {
    if (!isFocused) {
      return;
    }
    // Don't navigate if game is finished
    if (game?.state === 'finished') {
      console.log('[DEBUG ResultsScreen] Game finished - not navigating to Drawing');
      return;
    }
    
    if (game && game.currentRound && game.state === 'drawing') {
      console.log('[DEBUG ResultsScreen] Navigating to Drawing screen for round:', game.currentRound.roundNumber);
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        navigation.navigate('Drawing');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [game?.state, game?.currentRound?.roundNumber, navigation, isFocused]);

  // Reset navigation flag when component mounts (for new games)
  // IMPORTANT: This hook must be before any early returns to follow React rules of hooks
  useEffect(() => {
    // Reset the flag when component mounts with a valid game state
    if (game && (game.state === 'results' || game.state === 'finished')) {
      hasNavigatedAway.current = false;
      console.log('[DEBUG ResultsScreen] Mounted with valid game state, reset navigation flag');
    }
  }, []); // Only run on mount

  // Early returns must come AFTER all hooks
  if (!game) {
    console.log('[DEBUG ResultsScreen] Render: No game - returning null');
    return null;
  }
  
  // If game is in lobby or drawing state, shouldn't be on results screen
  if (game.state === 'lobby' || game.state === 'drawing') {
    console.log('[DEBUG ResultsScreen] Render: Invalid state for ResultsScreen - returning null');
    console.log('[DEBUG ResultsScreen] Render: Game state was:', game.state);
    return null;
  }
  
  // For finished games, show final results even without currentRound
  // For in-progress games, we need currentRound
  if (game.state !== 'finished' && !game.currentRound) {
    console.log('[DEBUG ResultsScreen] Render: Not finished and no currentRound - returning null');
    console.log('[DEBUG ResultsScreen] Render: Game state was:', game.state);
    return null;
  }

  console.log('[DEBUG ResultsScreen] Render: Rendering with state:', game.state);

  const handleNextRound = async () => {
    console.log('[DEBUG ResultsScreen] handleNextRound called');
    console.log('[DEBUG ResultsScreen] Current game state:', game?.state);
    console.log('[DEBUG ResultsScreen] Current round:', game?.currentRound?.roundNumber);
    console.log('[DEBUG ResultsScreen] Completed rounds:', game?.rounds?.length);
    console.log('[DEBUG ResultsScreen] Rounds per game:', game?.settings?.roundsPerGame);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowRewards(false);
    
    if (game.state === 'finished') {
      console.log('[DEBUG ResultsScreen] Game is finished - resetting and going to Home');
      hasNavigatedAway.current = true; // Mark as navigated to prevent loops
      resetGame();
      // Use replace to remove this screen from the stack
      navigation.replace('Home');
    } else {
      console.log('[DEBUG ResultsScreen] Starting next round...');
      // Show ad between rounds (except first round)
      if (game.currentRound && game.currentRound.roundNumber > 0) {
        try {
        } catch (error) {
          console.error('Error showing ad:', error);
          // Continue even if ad fails
        }
      }
      
      // Start the next round - navigation will happen via useEffect when state updates
      console.log('[DEBUG ResultsScreen] Calling startRound()');
      startRound();
    }
  };

  const handlePlayAgain = () => {
    console.log('[DEBUG ResultsScreen] ========== handlePlayAgain CALLED ==========');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowRewards(false);
    hasNavigatedAway.current = true; // Mark as navigated to prevent loops
    console.log('[DEBUG ResultsScreen] Resetting game before navigating...');
    resetGame();
    // Wait a moment to ensure game is reset before navigating
    setTimeout(() => {
      console.log('[DEBUG ResultsScreen] Navigating to Home with clearPlayerName param');
      // Reset stack to fully remove ResultsScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { clearPlayerName: true } }],
      });
    }, 50);
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

  // For finished games, use the last round from rounds array
  // For in-progress games, use currentRound
  const displayRound = game.state === 'finished' && game.rounds && game.rounds.length > 0
    ? game.rounds[game.rounds.length - 1]
    : game.currentRound;
  
  if (!displayRound) {
    console.log('[DEBUG ResultsScreen] No displayRound available - returning null');
    console.log('[DEBUG ResultsScreen] Game state:', game.state);
    console.log('[DEBUG ResultsScreen] Rounds array length:', game.rounds?.length);
    console.log('[DEBUG ResultsScreen] Has currentRound:', !!game.currentRound);
    return null;
  }
  
  console.log('[DEBUG ResultsScreen] Using displayRound:', displayRound.roundNumber);

  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const correctGuesses = (displayRound.guesses || []).filter((g) => g.isCorrect);
  const drawer = game.players.find((p) => p.id === displayRound.drawerId);
  const rewards = displayRound.rewards || [];
  const hasGuesses = correctGuesses.length > 0;
  
  console.log('[DEBUG ResultsScreen] Render data:', {
    displayRoundNumber: displayRound.roundNumber,
    guessesCount: displayRound.guesses?.length || 0,
    hasDrawer: !!drawer,
    rewardsCount: rewards.length
  });
  
  const getResultTitle = () => {
    if (hasGuesses) {
      if (correctGuesses.length === 1) {
        return 'ONE PERSON GOT IT';
      }
      if (correctGuesses.length === game.players.length - 1) {
        return 'EVERYONE GOT IT (WOW)';
      }
      return 'SOME OF YOU GOT IT';
    }
    return 'NOBODY GUESSED IT';
  };
  
  const getResultMessage = () => {
    if (hasGuesses) {
      const count = correctGuesses.length;
      const total = game.players.length - 1;
      if (count === 1) {
        return 'One person outsmarted all of you. Congrats to them, I guess.';
      }
      if (count === total) {
        return 'Everyone got it! Either the drawing was amazing or the word was too easy.';
      }
      return `${count} out of ${total} people got it. The rest of you need to work on your guessing skills.`;
    }
    return 'Nobody got it. That drawing must have been... abstract. Very abstract.';
  };

  const content = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.roundProgressContainer}>
            <Text style={styles.roundProgressText}>
              {game.state === 'finished' 
                ? `Game Finished - ${game.settings.roundsPerGame} Rounds`
                : `Round ${displayRound.roundNumber} of ${game.settings.roundsPerGame}`}
        </Text>
          </View>
          <Button
            title="Exit"
            variant="ghost"
            onPress={handleExit}
            style={styles.exitButton}
            textStyle={styles.exitButtonText}
          />
        </View>
        {game.state === 'finished' ? (
          <Text style={styles.title}>{sortedPlayers[0]?.name.toUpperCase() || 'WINNER'} WIN</Text>
        ) : (
          <>
            <Text style={styles.title}>{getResultTitle()}</Text>
            <Text style={styles.message}>{getResultMessage()}</Text>
          </>
        )}
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>THE WORD WAS:</Text>
          <Text style={styles.answerWord}>{displayRound.prompt.word.toUpperCase()}</Text>
          <Text style={styles.answerCategory}>
            Category: {displayRound.prompt.category}
        </Text>
        </View>
        <Text style={styles.drawerText}>Drawn by: {drawer?.name} (we're not judging... much)</Text>
      </View>

      {showRewards && rewards.length > 0 && (
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>ACHIEVEMENTS UNLOCKED</Text>
          {rewards.map((reward, index) => (
            <Card key={index} style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardMessage}>{reward.message}</Text>
              <Text style={styles.rewardPoints}>+{reward.points} points</Text>
            </Card>
          ))}
        </View>
      )}

      <View style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>THE SCOREBOARD</Text>
        {sortedPlayers.map((player, index) => {
          const scoreInfo = getScoreTitle(player.score);
          const isWinner = index === 0 && sortedPlayers.length > 1;
          
          return (
            <Card 
              key={player.id} 
              style={[
                styles.scoreCard,
                isWinner && styles.winnerCard
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>
                  {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.playerScore}>{player.score} pts</Text>
                  {player.correctGuesses > 0 && (
                    <Text style={styles.statsText}>
                      {player.correctGuesses} correct
                      {player.streak > 0 && ` • ${player.streak} streak`}
                    </Text>
                  )}
                </View>
                {player.achievements && player.achievements.length > 0 && (
                  <View style={styles.achievementsRow}>
                    {player.achievements.slice(0, 3).map((achievement, aIndex) => (
                      <View key={aIndex} style={styles.achievementBadge}>
                        <Text style={styles.achievementText}>{achievement.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </View>

      <View style={styles.actionsContainer}>
        {game.state === 'finished' ? (
          <Button
            title="Play Again"
            onPress={handlePlayAgain}
            style={styles.playAgainButton}
          />
        ) : (
          <Button
            title="Next Round"
            onPress={handleNextRound}
            style={styles.nextRoundButton}
          />
        )}
      </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roundProgressContainer: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roundProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  answerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  answerWord: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.brand,
    marginTop: spacing.xs,
  },
  answerCategory: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  drawerText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  rewardsContainer: {
    padding: spacing.xxl,
    backgroundColor: '#FFFBEB',
    margin: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  rewardsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  rewardCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  rewardMessage: {
    fontSize: 14,
    color: '#78350F',
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  rewardMultiplier: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 2,
  },
  scoresContainer: {
    padding: spacing.xxl,
  },
  scoresTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  winnerCard: {
    borderWidth: 4,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  rankContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 32,
    fontWeight: '900',
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
  winnerBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  statsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  achievementBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.brand,
  },
  achievementText: {
    fontSize: 10,
    color: colors.brand,
    fontWeight: '600',
  },
  actionsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextRoundButton: {
    backgroundColor: colors.brand,
  },
  playAgainButton: {
    backgroundColor: colors.accent,
  },
  exitButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  exitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

