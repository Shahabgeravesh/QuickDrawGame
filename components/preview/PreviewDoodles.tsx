import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { colors } from '../../theme';

export default function PreviewDoodles() {
  return (
    <Svg pointerEvents="none" style={styles.canvas}>
      <G opacity="0.35">
        <Path
          d="M40 110 C 90 60, 160 60, 210 110"
          stroke={colors.brand}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M260 90 C 300 40, 360 40, 400 90"
          stroke={colors.accent}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </G>
      <G opacity="0.4">
        <Circle cx="60" cy="220" r="6" fill={colors.warning} />
        <Circle cx="86" cy="240" r="4" fill={colors.brand} />
        <Circle cx="120" cy="230" r="5" fill={colors.success} />
      </G>
      <G opacity="0.3">
        <Path
          d="M300 260 l18 6 -10 16 18 -6 -6 18 -12 -12 -12 12 -6 -18 18 6 -10 -16 z"
          fill={colors.brandDark}
        />
      </G>
      <G opacity="0.35">
        <Path
          d="M30 360 C 110 340, 180 360, 250 410"
          stroke={colors.success}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

