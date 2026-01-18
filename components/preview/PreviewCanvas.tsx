import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PreviewBackdrop from './PreviewBackdrop';
import PreviewCaption from './PreviewCaption';
import PreviewFrame from './PreviewFrame';
import PreviewDoodles from './PreviewDoodles';
import { colors, spacing } from '../../theme';

type PreviewMeta = {
  title: string;
  subtitle?: string;
  caption: string;
  badge?: string;
  accent?: string;
  accentSecondary?: string;
  emoji?: string;
  variant?: 'default' | 'confetti' | 'arrow';
};

export default function PreviewCanvas({
  meta,
  children,
}: {
  meta: PreviewMeta;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <PreviewBackdrop accent={meta.accent} accentSecondary={meta.accentSecondary} />
      <PreviewDoodles />
      <PreviewCaption
        title={meta.title}
        subtitle={meta.subtitle}
        caption={meta.caption}
        badge={meta.badge}
        accent={meta.accent}
        accentSecondary={meta.accentSecondary}
        emoji={meta.emoji}
      />
      <View style={styles.frameContainer}>
        <PreviewFrame>{children}</PreviewFrame>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
});

