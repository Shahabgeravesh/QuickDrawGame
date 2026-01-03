import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useGame } from '../context/GameContext';
import DrawingCanvas from '../components/DrawingCanvas';

const { width } = Dimensions.get('window');

export default function ViewingScreen({ navigation }: any) {
  const { game } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!game || !game.currentRound) {
      navigation.navigate('Home');
      return;
    }

    // Navigate to guessing when drawing is done
    if (game.state !== 'drawing') {
      navigation.navigate('Guessing');
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

  if (!game || !game.currentRound) {
    return null;
  }

  const drawer = game.players.find((p) => p.id === game.currentRound!.drawerId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.viewerLabel}>Watching {drawer?.name} draw...</Text>
          <Text style={styles.hintText}>Try to guess what it is!</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <DrawingCanvas
          enabled={false} // Viewers can't draw
          clearTrigger={0}
          isEraser={false}
        />
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          Watch carefully! You'll get to guess soon.
        </Text>
        <Text style={styles.instructionSubtext}>
          The drawing will disappear when it's your turn to guess
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoContainer: {
    flex: 1,
  },
  viewerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
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
  canvasContainer: {
    flex: 1,
    padding: 20,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

