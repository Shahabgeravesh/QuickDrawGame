import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { colors } from '../../theme';

type PreviewBackdropProps = {
  accent?: string;
  accentSecondary?: string;
};

export default function PreviewBackdrop({
  accent = colors.brand,
  accentSecondary = colors.accent,
}: PreviewBackdropProps) {
  return (
    <Svg pointerEvents="none" style={styles.canvas}>
      <Defs>
        <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <Stop offset="45%" stopColor={accentSecondary} stopOpacity="0.45" />
          <Stop offset="100%" stopColor={colors.surfaceAlt} stopOpacity="0.9" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#bgGradient)" />
      <Circle cx="85%" cy="15%" r="140" fill={accentSecondary} opacity={0.28} />
      <Circle cx="10%" cy="80%" r="160" fill={accent} opacity={0.26} />
      <Circle cx="28%" cy="28%" r="90" fill={colors.warning} opacity={0.22} />
      <Circle cx="72%" cy="70%" r="80" fill={colors.success} opacity={0.24} />
      <Circle cx="55%" cy="40%" r="36" fill="#FFFFFF" opacity={0.35} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});

