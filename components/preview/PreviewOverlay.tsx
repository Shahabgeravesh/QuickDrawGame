import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../../theme';

type PreviewOverlayProps = {
  title: string;
  subtitle?: string;
  caption: string;
  bullets?: string[];
  badge?: string;
  accent?: string;
  accentSecondary?: string;
  emoji?: string;
  variant?: 'default' | 'confetti' | 'arrow';
};

export default function PreviewOverlay({
  title,
  subtitle,
  caption,
  bullets = [],
  badge,
  accent = colors.brand,
  accentSecondary = colors.accent,
  emoji,
  variant = 'default',
}: PreviewOverlayProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={[styles.card, { borderColor: accent }]}>
        <View style={[styles.topStripe, { backgroundColor: accent }]} />
        <View style={styles.headerRow}>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: accent }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          <View style={[styles.pill, { backgroundColor: accentSecondary }]}>
            <Text style={styles.pillText}>PLAYFUL • FAST</Text>
          </View>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <View style={styles.captionRow}>
              <View style={[styles.captionDot, { backgroundColor: accentSecondary }]} />
              <Text style={styles.caption}>{caption}</Text>
            </View>
            {bullets.length > 0 ? (
              <View style={styles.bullets}>
                {bullets.map((bullet) => (
                  <View key={bullet} style={styles.bulletRow}>
                    <View style={[styles.bulletIcon, { backgroundColor: accent }]} />
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
          <View style={styles.rightColumn}>
            <View style={[styles.emojiBubble, { backgroundColor: accent }]}>
              <Text style={styles.emoji}>{emoji || '✨'}</Text>
            </View>
            {variant === 'arrow' ? <Text style={styles.arrow}>⬇︎</Text> : null}
          </View>
        </View>
        {variant === 'confetti' ? (
          <View style={styles.confetti}>
            <Text style={styles.confettiText}>🎉</Text>
            <Text style={styles.confettiText}>✨</Text>
            <Text style={styles.confettiText}>🎊</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.xxxl,
    left: spacing.xxxl,
    right: spacing.xxxl,
    zIndex: 20,
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxxl,
    borderWidth: 2,
    ...shadows.md,
    maxWidth: 440,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  topStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  pillText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    paddingRight: spacing.lg,
  },
  rightColumn: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    fontSize: 30,
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  captionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  caption: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  bullets: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bulletIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bulletText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  emojiBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  emoji: {
    fontSize: 24,
  },
  confetti: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  confettiText: {
    fontSize: 20,
  },
  arrow: {
    fontSize: 22,
    color: colors.textMuted,
  },
});

