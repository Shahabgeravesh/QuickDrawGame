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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [playerName, setPlayerName] = useState('');
  const { createGame, game } = useGame();
  const [drawProgress, setDrawProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Draw animation once, then stay stable
    let progress = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const animate = () => {
      progress += 0.015; // Slightly faster for one-time draw
      
      if (progress >= 1) {
        progress = 1; // Stop at completion, don't loop
        setDrawProgress(progress);
        return; // Stop animation
      }
      
      setDrawProgress(progress);
      timeoutId = setTimeout(animate, 60);
    };

    animate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Navigate to Lobby when game is created
  useEffect(() => {
    if (game && game.state === 'lobby' && isNavigating) {
      // Small delay to ensure state is fully set
      const timer = setTimeout(() => {
        setIsNavigating(false);
        navigation.navigate('Lobby');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [game, isNavigating, navigation]);

  const handleStart = () => {
    if (playerName.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    // Prevent multiple rapid clicks
    if (isNavigating) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsNavigating(true);
    createGame(playerName.trim());
  };

  // Simple funny doodle path - a wacky face
  const doodlePath = 'M 100 150 Q 120 130 140 150 Q 120 170 100 150 M 160 150 Q 180 130 200 150 Q 180 170 160 150 M 80 180 Q 100 200 120 190 Q 140 200 160 190 Q 180 200 200 190 Q 220 200 240 180 M 100 80 Q 120 70 140 60 Q 160 50 180 60 Q 200 70 220 80';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
          <Text style={styles.title}>QUICK DRAW</Text>
          
          <View style={styles.animationContainer}>
            <Svg width={300} height={280} style={styles.doodleSvg} viewBox="0 0 300 280">
              {/* Devilish mischievous face with horns */}
              
              {/* Left horn */}
              <Path
                d="M 110 90 L 95 70 L 100 75 L 105 65 L 110 75 L 115 70 L 110 90"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="80"
                strokeDashoffset={Math.max(0, 80 - (drawProgress * 80))}
                opacity={drawProgress > 0 ? 1 : 0}
              />
              
              {/* Right horn */}
              <Path
                d="M 190 90 L 205 70 L 200 75 L 195 65 L 190 75 L 185 70 L 190 90"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="80"
                strokeDashoffset={Math.max(0, 80 - (Math.max(0, drawProgress - 0.1) * 80))}
                opacity={drawProgress > 0.1 ? 1 : 0}
              />
              
              {/* Head circle */}
              <Path
                d="M 150 120 Q 110 120 110 160 Q 110 200 150 200 Q 190 200 190 160 Q 190 120 150 120"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="320"
                strokeDashoffset={Math.max(0, 320 - (Math.max(0, drawProgress - 0.2) * 320))}
                opacity={drawProgress > 0.2 ? 1 : 0}
              />
              
              {/* Left eye - mischievous squint */}
              <Path
                d="M 130 150 Q 135 145 140 150"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="20"
                strokeDashoffset={Math.max(0, 20 - (Math.max(0, drawProgress - 0.55) * 20))}
                opacity={drawProgress > 0.55 ? 1 : 0}
              />
              
              {/* Right eye - mischievous squint */}
              <Path
                d="M 160 150 Q 165 145 170 150"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="20"
                strokeDashoffset={Math.max(0, 20 - (Math.max(0, drawProgress - 0.6) * 20))}
                opacity={drawProgress > 0.6 ? 1 : 0}
              />
              
              {/* Devilish grin - wide mischievous smile */}
              <Path
                d="M 120 175 Q 135 190 150 185 Q 165 190 180 175"
                stroke="#FFFFFF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={Math.max(0, 100 - (Math.max(0, drawProgress - 0.65) * 100))}
                opacity={drawProgress > 0.65 ? 1 : 0}
              />
              
              {/* Small teeth/points in grin */}
              <Path
                d="M 135 180 L 135 175 M 150 178 L 150 173 M 165 180 L 165 175"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="15"
                strokeDashoffset={Math.max(0, 15 - (Math.max(0, drawProgress - 0.8) * 15))}
                opacity={drawProgress > 0.8 ? 1 : 0}
              />
              
              {/* Sparkle in eyes for mischief - appears when complete */}
              {drawProgress >= 1 && (
                <>
                  <Path
                    d="M 135 148 L 137 150 L 135 152 L 133 150 Z"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    fill="#FFFFFF"
                  />
                  <Path
                    d="M 165 148 L 167 150 L 165 152 L 163 150 Z"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    fill="#FFFFFF"
                  />
                </>
              )}
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

          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Tutorial');
              }}
            >
              <Text style={styles.secondaryButtonText}>📖 Tutorial</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('History');
              }}
            >
              <Text style={styles.secondaryButtonText}>History</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Math.max(40, height * 0.05),
    paddingBottom: Math.max(20, height * 0.05),
  },
  title: {
    fontSize: Math.min(48, width * 0.12),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  animationContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: Math.min(250, height * 0.3),
  },
  doodleSvg: {
    opacity: 0.95,
    width: Math.min(280, width * 0.7),
    height: Math.min(250, height * 0.3),
  },
  inputContainer: {
    width: Math.min(width - 40, 400),
    marginBottom: 16,
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
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    minWidth: 120,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

