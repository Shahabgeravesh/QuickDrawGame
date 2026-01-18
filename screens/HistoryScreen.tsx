import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadGameHistory, deleteGameHistory, clearAllGameHistory } from '../utils/storage';
import type { GameHistory } from '../types/game';
import * as Haptics from 'expo-haptics';
import Header from '../components/ui/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { colors, spacing, typography, radius, shadows } from '../theme';
import PreviewCanvas from '../components/preview/PreviewCanvas';

const { width, height } = Dimensions.get('window');

export default function HistoryScreen({ navigation, route }: any) {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const previewHistory = route?.params?.previewHistory as GameHistory[] | undefined;
  const isPreview = !!previewHistory;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  useEffect(() => {
    if (previewHistory) {
      setHistory(previewHistory);
      setLoading(false);
      return;
    }
    loadHistory();
  }, [previewHistory]);

  const loadHistory = async () => {
    setLoading(true);
    const loadedHistory = await loadGameHistory();
    setHistory(loadedHistory);
    setLoading(false);
  };

  const handleDelete = async (historyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Game?',
      'Are you sure you want to delete this game from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteGameHistory(historyId);
            await loadHistory();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Clear All History?',
      'This will delete ALL your game history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearAllGameHistory();
            await loadHistory();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    const loadingContent = (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header title="Game History" onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );

    if (route?.params?.previewMeta) {
      return <PreviewCanvas meta={route.params.previewMeta}>{loadingContent}</PreviewCanvas>;
    }

    return loadingContent;
  }

  if (history.length === 0) {
    const emptyContent = (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header title="Game History" onBack={handleBack} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>NO HISTORY YET</Text>
          <Text style={styles.emptyText}>
            Your completed games will show up here
          </Text>
        </View>
      </SafeAreaView>
    );

    if (route?.params?.previewMeta) {
      return <PreviewCanvas meta={route.params.previewMeta}>{emptyContent}</PreviewCanvas>;
    }

    return emptyContent;
  }

  const mainContent = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header
        title="Game History"
        onBack={handleBack}
        rightAction={!isPreview ? (
          <Button
            title="Clear All"
            variant="ghost"
            onPress={handleClearAll}
            style={styles.clearButton}
            textStyle={styles.clearButtonText}
          />
        ) : null}
      />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const winner = item.winner;
          const sortedPlayers = [...item.players].sort((a, b) => b.score - a.score);

          return (
            <Card style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.dateText}>{formatDate(item.completedAt)}</Text>
                  <Text style={styles.roundsText}>{item.totalRounds} rounds</Text>
                </View>
                {!isPreview ? (
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {winner && (
                <View style={styles.winnerSection}>
                  <Text style={styles.winnerLabel}>Winner:</Text>
                  <Text style={styles.winnerName}>{winner.name}</Text>
                  <Text style={styles.winnerScore}>{winner.score} pts</Text>
                </View>
              )}

              <View style={styles.playersSection}>
                <Text style={styles.playersLabel}>Final Scores:</Text>
                {sortedPlayers.map((player, index) => (
                  <View key={player.id} style={styles.playerRow}>
                    <Text style={styles.playerRank}>
                      {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}.`}
                    </Text>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerScore}>{player.score} pts</Text>
                    {player.correctGuesses > 0 && (
                      <Text style={styles.playerStats}>
                        {player.correctGuesses} correct
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );

  if (route?.params?.previewMeta) {
    return <PreviewCanvas meta={route.params.previewMeta}>{mainContent}</PreviewCanvas>;
  }

  return mainContent;
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearButtonText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.title,
    fontSize: 22,
    color: colors.brand,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  historyCard: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  roundsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  winnerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  winnerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginRight: spacing.sm,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginRight: 8,
  },
  winnerScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  playersSection: {
    marginTop: 8,
  },
  playersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  playerRank: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 40,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  playerScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginRight: 8,
  },
  playerStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

