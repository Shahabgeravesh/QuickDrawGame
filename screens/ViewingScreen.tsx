import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import DrawingCanvas from '../components/DrawingCanvas';
import { colors, spacing, typography, radius } from '../theme';

const { width, height } = Dimensions.get('window');

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.viewerLabel} numberOfLines={1}>Watching {drawer?.name} draw...</Text>
          <Text style={styles.hintText} numberOfLines={1}>Try to guess what it is!</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 60,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  viewerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.brand,
    marginBottom: spacing.xs,
  },
  hintText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  canvasContainer: {
    flex: 1,
    padding: spacing.lg,
    minHeight: 200,
  },
  instructionsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  instructionText: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  instructionSubtext: {
    ...typography.caption,
    textAlign: 'center',
  },
});


