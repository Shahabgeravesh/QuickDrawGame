import React, { useState, useEffect } from 'react';
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
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [clearTrigger, setClearTrigger] = useState(0);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  const strokeWidths = [2, 4, 6, 8];

  useEffect(() => {
    if (!game || !game.currentRound) {
      navigation.navigate('Home');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game]);

  const handleTimeUp = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    endRound();
    navigation.navigate('Results');
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    endRound();
    navigation.navigate('Guessing');
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setClearTrigger((prev) => prev + 1);
  };

  if (!game || !game.currentRound) {
    return null;
  }

  const currentPlayer = game.players.find((p) => p.id === game.currentRound!.drawerId);
  const isCurrentPlayerDrawing = currentPlayer?.isDrawing;

  if (!isCurrentPlayerDrawing) {
    // This player is not drawing, show waiting screen
    return (
      <View style={styles.container}>
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>
            {currentPlayer?.name} is drawing...
          </Text>
          <Text style={styles.waitingSubtext}>
            Pass the device to {currentPlayer?.name}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.promptLabel}>Draw:</Text>
          <Text style={styles.promptText}>{game.currentRound.prompt.word}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <DrawingCanvas
          color={selectedColor}
          strokeWidth={strokeWidth}
          enabled={true}
          clearTrigger={clearTrigger}
        />
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.colorButtonSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedColor(color);
              }}
            />
          ))}
        </View>

        <View style={styles.strokeWidthPicker}>
          {strokeWidths.map((width) => (
            <TouchableOpacity
              key={width}
              style={[
                styles.strokeButton,
                strokeWidth === width && styles.strokeButtonSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setStrokeWidth(width);
              }}
            >
              <View style={[styles.strokeIndicator, { width: width * 2, height: width * 2 }]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
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
  promptLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  promptText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
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
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  colorButtonSelected: {
    borderColor: '#6366F1',
    borderWidth: 3,
    transform: [{ scale: 1.2 }],
  },
  strokeWidthPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  strokeButton: {
    padding: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  strokeButtonSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  strokeIndicator: {
    backgroundColor: '#000000',
    borderRadius: 999,
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
});

