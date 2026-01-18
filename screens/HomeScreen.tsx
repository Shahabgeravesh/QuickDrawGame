import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import * as Haptics from 'expo-haptics';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import { colors, spacing, typography, radius } from '../theme';
import PreviewCanvas from '../components/preview/PreviewCanvas';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }: any) {
  const [playerName, setPlayerName] = useState('');
  const { createGame, game, resetGame } = useGame();
  const [drawProgress, setDrawProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const isCreatingGameRef = useRef(false); // Track if we're in the middle of creating a game
  
  // Check if we should clear player name from navigation params
  // Use a ref to track if we've already cleared it to prevent multiple clears
  const hasClearedPlayerNameRef = useRef(false);
  
  useEffect(() => {
    // Check if we should clear player name (only once per navigation with this param)
    if (route?.params?.clearPlayerName && !hasClearedPlayerNameRef.current) {
      console.log('[DEBUG HomeScreen] Clearing player name from navigation params');
      setPlayerName('');
      hasClearedPlayerNameRef.current = true;
      // Reset navigation flags for a clean restart
      setIsNavigating(false);
      isCreatingGameRef.current = false;
    } else if (!route?.params?.clearPlayerName) {
      // Reset the flag when param is not present
      hasClearedPlayerNameRef.current = false;
    }
  }, [route?.params?.clearPlayerName]);

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

  // Reset navigation state when game is reset (game becomes null)
  useEffect(() => {
    if (!game && !isCreatingGameRef.current) {
      setIsNavigating(false);
    }
  }, [game]);

  const handleStart = () => {
    console.log('[DEBUG HomeScreen] handleStart called');
    console.log('[DEBUG HomeScreen] Player name:', playerName);
    console.log('[DEBUG HomeScreen] Is navigating:', isNavigating);
    console.log('[DEBUG HomeScreen] Current game state:', game?.state);
    
    if (playerName.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    // Prevent multiple rapid clicks
    if (isNavigating) {
      console.log('[DEBUG HomeScreen] Already navigating, ignoring click');
      return;
    }

    // Mark game creation to prevent reset effects from interfering
    isCreatingGameRef.current = true;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('[DEBUG HomeScreen] About to create game for player:', playerName.trim());
    // IMPORTANT: Set navigating BEFORE creating game to ensure proper order
    setIsNavigating(true);
    const startNewGame = () => {
    createGame(playerName.trim());
      navigation.replace('Lobby');
      setTimeout(() => {
        setIsNavigating(false);
        isCreatingGameRef.current = false;
      }, 0);
      console.log('[DEBUG HomeScreen] createGame called, navigating to Lobby');
  };

    if (game) {
      resetGame();
      setTimeout(startNewGame, 50);
    } else {
      startNewGame();
    }
  };

  // Simple funny doodle path - a wacky face
  const doodlePath = 'M 100 150 Q 120 130 140 150 Q 120 170 100 150 M 160 150 Q 180 130 200 150 Q 180 170 160 150 M 80 180 Q 100 200 120 190 Q 140 200 160 190 Q 180 200 200 190 Q 220 200 240 180 M 100 80 Q 120 70 140 60 Q 160 50 180 60 Q 200 70 220 80';

  const content = (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Quick Draw</Text>
          
          <View style={styles.animationContainer}>
            <Svg width={400} height={340} style={styles.doodleSvg} viewBox="0 0 400 340">
              <Defs>
                <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#6366F1" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#6366F1" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              
              {/* Sky background */}
              <Rect
                x="0"
                y="0"
                width="400"
                height="340"
                fill="url(#skyGradient)"
              />
              
              {/* Traditional cloud shape - ellipse with half-circles on edges */}
              
              {/* Main ellipse cloud body - drawn outline */}
              <Path
                d="M 30 190 A 50 60 0 0 1 80 165 A 60 50 0 0 1 130 150 A 55 55 0 0 1 200 140 A 60 60 0 0 1 270 150 A 55 50 0 0 1 320 165 A 50 60 0 0 1 370 190 A 45 70 0 0 1 360 240 A 60 60 0 0 1 320 265 A 55 55 0 0 1 280 270 A 60 60 0 0 1 240 280 A 60 60 0 0 1 200 270 A 60 60 0 0 1 160 270 A 55 55 0 0 1 120 265 A 45 70 0 0 1 30 190 Z"
                stroke="#FFFFFF"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="780"
                strokeDashoffset={Math.max(0, 780 - (Math.max(0, drawProgress - 0.2) * 780))}
                opacity={drawProgress > 0.2 ? 1 : 0}
              />
              
              {/* Left eye - winking (closed eye line) */}
              <Path
                d="M 140 200 Q 160 196 175 200"
                stroke="#FFFFFF"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="35"
                strokeDashoffset={Math.max(0, 35 - (Math.max(0, drawProgress - 0.7) * 35))}
                opacity={drawProgress > 0.7 ? 1 : 0}
              />
              
              {/* Right eye - happy crescent */}
              <Path
                d="M 260 200 Q 240 195 230 200 Q 240 205 260 200"
                stroke="#FFFFFF"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="45"
                strokeDashoffset={Math.max(0, 45 - (Math.max(0, drawProgress - 0.75) * 45))}
                opacity={drawProgress > 0.75 ? 1 : 0}
              />
              
              {/* Big happy smile */}
              <Path
                d="M 130 230 Q 170 260 200 255 Q 230 260 270 230"
                stroke="#FFFFFF"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="180"
                strokeDashoffset={Math.max(0, 180 - (Math.max(0, drawProgress - 0.8) * 180))}
                opacity={drawProgress > 0.8 ? 1 : 0}
              />
              
              {/* Tongue sticking out */}
              <Path
                d="M 200 255 Q 193 275 200 285 Q 207 275 200 255"
                stroke="#FFFFFF"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="40"
                strokeDashoffset={Math.max(0, 40 - (Math.max(0, drawProgress - 0.88) * 40))}
                opacity={drawProgress > 0.88 ? 1 : 0}
              />
              
              {/* Simple sparkle in the open eye when complete */}
              {drawProgress >= 1 && (
                <Path
                  d="M 255 197 L 250 200 L 255 203"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </Svg>
          </View>

        <View style={styles.inputContainer}>
            <TextField
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

          <Button
            title="Start Game"
          onPress={handleStart}
          disabled={!playerName.trim()}
            style={styles.primaryButton}
            textStyle={{ color: colors.brand }}
          />

          <View style={styles.bottomButtons}>
            <Button
              title="Tutorial"
              variant="ghost"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Tutorial');
              }}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
            
            <Button
              title="History"
              variant="ghost"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('History');
              }}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </View>

          {__DEV__ && (
            <View style={styles.devButtons}>
              <Button
                title="Preview Screenshots"
                variant="ghost"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('PreviewScreens');
                }}
                style={styles.previewButton}
                textStyle={styles.previewButtonText}
              />
            </View>
          )}

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
    backgroundColor: colors.brand,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    paddingTop: Math.max(spacing.huge, height * 0.05),
    paddingBottom: Math.max(spacing.xxl, height * 0.05),
  },
  title: {
    ...typography.title,
    color: colors.white,
    fontSize: Math.min(40, width * 0.1),
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  animationContainer: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    height: Math.min(340, height * 0.42),
  },
  doodleSvg: {
    opacity: 1,
    width: Math.min(380, width * 0.85),
    height: Math.min(340, height * 0.42),
  },
  inputContainer: {
    width: Math.min(width - spacing.xxxl, 420),
    marginBottom: spacing.lg,
  },
  primaryButton: {
    width: Math.min(width - spacing.xxxl, 420),
    backgroundColor: colors.white,
    borderRadius: radius.lg,
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  devButtons: {
    marginTop: spacing.md,
  },
  secondaryButton: {
    minWidth: 140,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.white,
  },
  secondaryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  previewButton: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.white,
  },
  previewButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});

