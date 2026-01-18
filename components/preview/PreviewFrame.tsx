import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors, radius, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

const frameWidth = Math.min(width * 0.82, 380);
const frameHeight = Math.min(height * 0.7, 760);

export default function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
      <View style={styles.screen}>{children}</View>
      <View style={styles.notch} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: '#0B0B0F',
    borderRadius: radius.xl + 8,
    padding: 10,
    ...shadows.md,
    transform: [{ rotate: '-2.5deg' }],
  },
  screen: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  notch: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 100,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1C1C23',
    opacity: 0.9,
  },
});

