import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function LobbyScreen({ navigation }: any) {
  const { game, addPlayer, startGame } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');

  if (!game) {
    navigation.navigate('Home');
    return null;
  }

  const handleAddPlayer = () => {
    if (newPlayerName.trim().length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addPlayer(newPlayerName.trim());
    setNewPlayerName('');
  };

  const handleStart = () => {
    if (game.players.length < 2) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startGame();
    navigation.navigate('Drawing');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game Lobby</Text>
        <Text style={styles.subtitle}>{game.players.length} Player{game.players.length !== 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.playersContainer}>
        <FlatList
          data={game.players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.playerCard}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.playerName}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.playersList}
        />
      </View>

      <View style={styles.addPlayerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add player name"
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

      <TouchableOpacity
        style={[
          styles.startButton,
          game.players.length < 2 && styles.startButtonDisabled,
        ]}
        onPress={handleStart}
        disabled={game.players.length < 2}
      >
        <Text style={styles.startButtonText}>
          {game.players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366F1',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E7FF',
  },
  playersContainer: {
    flex: 1,
    marginBottom: 24,
  },
  playersList: {
    paddingBottom: 16,
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
});

