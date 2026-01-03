import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';
import { getScoreTitle } from '../utils/rewards';

const { width } = Dimensions.get('window');

export default function ResultsScreen({ navigation }: any) {
  const { game, resetGame, startRound } = useGame();
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (!game || !game.currentRound) {
      navigation.navigate('Home');
    } else {
      // Show rewards immediately for faster feedback
      setShowRewards(true);
    }
  }, [game, navigation]);

  if (!game || !game.currentRound) {
    return null;
  }

  const handleNextRound = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowRewards(false);
    if (game.state === 'finished') {
      resetGame();
      navigation.navigate('Home');
    } else {
      // Start the next round
      startRound();
      navigation.navigate('Drawing');
    }
  };

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowRewards(false);
    resetGame();
    navigation.navigate('Home');
  };

  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const correctGuesses = game.currentRound.guesses.filter((g) => g.isCorrect);
  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);
  const rewards = game.currentRound.rewards || [];
  const hasGuesses = correctGuesses.length > 0;
  
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.roundProgressContainer}>
          <Text style={styles.roundProgressText}>
            Round {game.currentRound.roundNumber} of {game.settings.roundsPerGame}
          </Text>
        </View>
        <Text style={styles.title}>{getResultTitle()}</Text>
        <Text style={styles.message}>{getResultMessage()}</Text>
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>THE WORD WAS:</Text>
          <Text style={styles.answerWord}>{game.currentRound.prompt.word.toUpperCase()}</Text>
          <Text style={styles.answerCategory}>
            Category: {game.currentRound.prompt.category}
          </Text>
        </View>
        <Text style={styles.drawerText}>Drawn by: {drawer?.name} (we're not judging... much)</Text>
      </View>

      {showRewards && rewards.length > 0 && (
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>ACHIEVEMENTS UNLOCKED</Text>
          {rewards.map((reward, index) => (
            <View key={index} style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardMessage}>{reward.message}</Text>
              <Text style={styles.rewardPoints}>+{reward.points} points</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>THE SCOREBOARD</Text>
        {sortedPlayers.map((player, index) => {
          const scoreInfo = getScoreTitle(player.score);
          const isWinner = index === 0 && sortedPlayers.length > 1;
          
          return (
            <View 
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
            </View>
          );
        })}
      </View>

      <View style={styles.actionsContainer}>
        {game.state === 'finished' ? (
          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <Text style={styles.playAgainButtonText}>PLAY AGAIN?</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextRoundButton} onPress={handleNextRound}>
            <Text style={styles.nextRoundButtonText}>NEXT ROUND</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  roundProgressContainer: {
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roundProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  answerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  answerWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366F1',
    marginTop: 4,
  },
  answerCategory: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  drawerText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  rewardsContainer: {
    padding: 16,
    backgroundColor: '#FFFBEB',
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  rewardsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
    padding: 16,
  },
  scoresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
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
    marginTop: 8,
  },
  achievementBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  achievementText: {
    fontSize: 10,
    color: '#6366F1',
    fontWeight: '600',
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

