import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../../theme';

export default function PreviewSketch() {
  return (
    <Svg pointerEvents="none" style={styles.canvas} viewBox="0 0 320 220">
      <Path
        d="M84 130 C 110 90, 150 70, 195 78 C 235 85, 265 120, 256 160 C 248 196, 214 214, 174 210 C 138 206, 108 186, 98 156"
        stroke={colors.textPrimary}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M164 210 C 164 178, 168 150, 176 126"
        stroke={colors.textPrimary}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="138" cy="122" r="5" fill={colors.brand} />
      <Circle cx="200" cy="128" r="5" fill={colors.brand} />
      <Path
        d="M120 90 C 128 70, 150 60, 178 66"
        stroke={colors.brand}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M230 110 C 250 110, 270 120, 284 136"
        stroke={colors.accent}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
});

