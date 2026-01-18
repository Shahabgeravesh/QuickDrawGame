import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';

type PreviewCaptionProps = {
  title: string;
  subtitle?: string;
  caption?: string;
  badge?: string;
  accent?: string;
  accentSecondary?: string;
  emoji?: string;
};

export default function PreviewCaption({
  title,
  subtitle,
  caption,
  badge,
  accent = colors.brand,
  accentSecondary = colors.accent,
  emoji,
}: PreviewCaptionProps) {
  return (
    <View style={styles.container}>
      {badge ? (
        <Text style={[styles.badge, { color: accent }]}>{badge}</Text>
      ) : null}
      <View style={styles.titleWrap}>
        <View style={[styles.titleSticker, { backgroundColor: accentSecondary }]} />
        <Text style={[styles.title, { color: accent }]}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {caption ? (
        <View style={[styles.captionPill, { backgroundColor: accentSecondary }]}>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      ) : null}
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    zIndex: 10,
  },
  badge: {
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: spacing.xs,
  },
  titleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  titleSticker: {
    position: 'absolute',
    height: 36,
    width: '88%',
    borderRadius: 18,
    opacity: 0.2,
    transform: [{ rotate: '-4deg' }],
  },
  title: {
    ...typography.title,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '800',
    fontFamily: Platform.select({
      ios: 'AvenirNext-Heavy',
      android: 'sans-serif-condensed',
      default: undefined,
    }),
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.textPrimary,
    fontWeight: '600',
  },
  captionPill: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  caption: {
    ...typography.caption,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.white,
    fontFamily: Platform.select({
      ios: 'AvenirNext-DemiBold',
      android: 'sans-serif-medium',
      default: undefined,
    }),
  },
  emoji: {
    marginTop: spacing.sm,
    fontSize: 18,
  },
});

