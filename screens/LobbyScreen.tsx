import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function LobbyScreen({ navigation }: any) {
  const { game, addPlayer, startGame, setRoundsPerGame } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  
  const roundOptions = [3, 5, 7, 10];

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
    if (game.players.length < 2) {
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>WHO'S PLAYING?</Text>
          <Text style={styles.subtitle}>
          {game.players.length === 1 
            ? "Just you? That's... sad." 
            : game.players.length === 2 
            ? "Two players. Someone's going down."
            : `${game.players.length} legends ready to embarrass themselves`}
        </Text>
      </View>

      <View style={styles.playersContainer}>
        {game.players.map((item) => (
          <View key={item.id} style={styles.playerCard}>
            <View style={styles.playerAvatar}>
              <Text style={styles.playerAvatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.playerName}>{item.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.addPlayerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add another victim"
          placeholderTextColor="#999"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          maxLength={20}
          autoCapitalize="words"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
        />
        <TouchableOpacity
          style={[styles.addButton, !newPlayerName.trim() && styles.addButtonDisabled]}
          onPress={handleAddPlayer}
          disabled={!newPlayerName.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.roundsContainer}>
        <Text style={styles.roundsLabel}>HOW MANY ROUNDS?</Text>
        <View style={styles.roundsOptions}>
          {roundOptions.map((rounds) => (
            <TouchableOpacity
              key={rounds}
              style={[
                styles.roundButton,
                game.settings.roundsPerGame === rounds && styles.roundButtonSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setRoundsPerGame(rounds);
              }}
            >
              <Text
                style={[
                  styles.roundButtonText,
                  game.settings.roundsPerGame === rounds && styles.roundButtonTextSelected,
                ]}
              >
                {rounds}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.roundsHint}>
          Playing {game.settings.roundsPerGame} {game.settings.roundsPerGame === 1 ? 'round' : 'rounds'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          game.players.length < 2 && styles.startButtonDisabled,
        ]}
        onPress={handleStart}
        disabled={game.players.length < 2}
      >
        <Text style={styles.startButtonText}>
          {game.players.length < 2 
            ? 'You need friends for this...' 
            : 'START THE CHAOS'}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Math.max(20, height * 0.03),
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  playersContainer: {
    marginBottom: 24,
  },
  playerCard: {
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
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  playerAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addPlayerContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 12,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  roundsContainer: {
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  roundsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  roundsOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  roundButtonSelected: {
    backgroundColor: '#10B981',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  roundButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  roundButtonTextSelected: {
    color: '#FFFFFF',
  },
  roundsHint: {
    fontSize: 14,
    color: '#E0E7FF',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

