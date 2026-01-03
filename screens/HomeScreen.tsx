import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [playerName, setPlayerName] = useState('');
  const { createGame } = useGame();
  const [drawProgress, setDrawProgress] = useState(0);

  useEffect(() => {
    // Slower, more relaxed drawing animation with pause at end
    let progress = 0;
    let isPaused = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let pausedTimeoutId: NodeJS.Timeout | null = null;
    
    const animate = () => {
      if (isPaused) {
        // Pause for 2 seconds at the end before restarting
        pausedTimeoutId = setTimeout(() => {
          isPaused = false;
          progress = 0;
          setDrawProgress(0);
          animate();
        }, 2000);
        return;
      }

      progress += 0.012; // Slower increment for more relaxed feel
      
      if (progress >= 1) {
        progress = 1;
        setDrawProgress(1);
        isPaused = true;
        return;
      }
      
      setDrawProgress(progress);
      timeoutId = setTimeout(animate, 60); // Slower frame rate (~16fps) for relaxed animation
    };

    animate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (pausedTimeoutId) clearTimeout(pausedTimeoutId);
    };
  }, []);

  const handleStart = () => {
    if (playerName.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createGame(playerName.trim());
    navigation.navigate('Lobby');
  };

  // Simple funny doodle path - a wacky face
  const doodlePath = 'M 100 150 Q 120 130 140 150 Q 120 170 100 150 M 160 150 Q 180 130 200 150 Q 180 170 160 150 M 80 180 Q 100 200 120 190 Q 140 200 160 190 Q 180 200 200 190 Q 220 200 240 180 M 100 80 Q 120 70 140 60 Q 160 50 180 60 Q 200 70 220 80';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>QUICK DRAW</Text>
          
          <View style={styles.animationContainer}>
            <Svg width={300} height={250} style={styles.doodleSvg}>
              {/* Funny doodle - wacky face being drawn */}
              <Path
                d={`M 100 150 Q 120 130 140 150 Q 120 170 100 150`}
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={200}
                strokeDashoffset={200 - (drawProgress * 200)}
                opacity={drawProgress > 0.1 ? 1 : 0}
              />
              <Path
                d={`M 160 150 Q 180 130 200 150 Q 180 170 160 150`}
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={200}
                strokeDashoffset={200 - ((drawProgress - 0.15) * 200)}
                opacity={drawProgress > 0.25 ? 1 : 0}
              />
              <Path
                d={`M 80 180 Q 100 200 120 190 Q 140 200 160 190 Q 180 200 200 190 Q 220 200 240 180`}
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={400}
                strokeDashoffset={400 - ((drawProgress - 0.3) * 400)}
                opacity={drawProgress > 0.4 ? 1 : 0}
              />
              <Path
                d={`M 100 80 Q 120 70 140 60 Q 160 50 180 60 Q 200 70 220 80`}
                stroke="#FFFFFF"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={300}
                strokeDashoffset={300 - ((drawProgress - 0.7) * 300)}
                opacity={drawProgress > 0.75 ? 1 : 0}
              />
            </Svg>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !playerName.trim() && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={!playerName.trim()}
          >
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366F1',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  animationContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doodleSvg: {
    opacity: 0.9,
  },
  inputContainer: {
    width: width - 48,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

