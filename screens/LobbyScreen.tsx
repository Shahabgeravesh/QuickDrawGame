import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TextField from '../components/ui/TextField';
import Header from '../components/ui/Header';
import { colors, spacing, typography, radius } from '../theme';
import PreviewCanvas from '../components/preview/PreviewCanvas';

const { width, height } = Dimensions.get('window');

export default function LobbyScreen({ navigation, route }: any) {
  const { game, addPlayer, startGame } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    // Only navigate back if game is null and we're actually on this screen
    // Add a small delay to prevent race conditions during game creation
  if (!game) {
      const timer = setTimeout(() => {
        // Double-check game is still null before navigating
        // This prevents navigation during game creation
    navigation.navigate('Home');
      }, 300);
      return () => clearTimeout(timer);
  }
  }, [game, navigation]);

  const handleAddPlayer = () => {
    if (!game) return;
    if (newPlayerName.trim().length === 0) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addPlayer(newPlayerName.trim());
    setNewPlayerName('');
  };

  const handleStart = () => {
    if (!game) return;
    if (game.players.length !== 2) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startGame();
    // Navigation will happen via useEffect in DrawingScreen when state is ready
    setTimeout(() => {
    navigation.navigate('Drawing');
    }, 100);
  };

  // Show loading state while game is being created
  if (!game) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const content = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          title="Who's Playing?"
          subtitle={
            game.players.length === 1
              ? "Just you? That's... sad."
              : game.players.length === 2
              ? "Two players. Someone's going down."
              : `${game.players.length} legends ready to embarrass themselves`
          }
        />

        <View style={styles.playersContainer}>
          {game.players.map((item) => (
            <Card key={item.id} style={styles.playerCard}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.playerName}>{item.name}</Text>
            </Card>
          ))}
        </View>

        {game.players.length < 2 ? (
          <View style={styles.addPlayerContainer}>
            <TextField
              placeholder="Add player 2"
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              maxLength={20}
              autoCapitalize="words"
              autoCorrect={false}
              onSubmitEditing={handleAddPlayer}
            />
            <Button
              title="Add"
              onPress={handleAddPlayer}
              disabled={!newPlayerName.trim()}
              style={styles.addButton}
            />
          </View>
        ) : (
          <Text style={styles.limitText}>Only 2 players are allowed</Text>
        )}

        <Button
          title={game.players.length !== 2 ? 'You need exactly 2 players' : 'Start the Chaos'}
          onPress={handleStart}
          disabled={game.players.length !== 2}
          style={styles.startButton}
        />
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
    padding: spacing.xxl,
    paddingTop: Math.max(spacing.xl, height * 0.03),
    paddingBottom: spacing.xxxl,
  },
  playersContainer: {
    marginBottom: spacing.xxl,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  playerAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerName: {
    ...typography.body,
    fontWeight: '600',
  },
  addPlayerContainer: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  limitText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  addButton: {
    borderRadius: radius.lg,
  },
  startButton: {
    marginTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

