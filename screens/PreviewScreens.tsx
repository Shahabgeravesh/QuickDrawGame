import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import Header from '../components/ui/Header';
import { colors, spacing, typography, radius } from '../theme';
import { useGame } from '../context/GameContext';
import {
  getLobbyPreviewGame,
  getDrawingPreviewGame,
  getResultsPreviewGame,
  getPreviewHistory,
} from '../utils/previewData';

const { width, height } = Dimensions.get('window');

const PREVIEW_META = {
  home: {
    title: 'Draw. Guess. Laugh.',
    caption: 'Fast party rounds',
    accent: colors.brand,
    accentSecondary: colors.accent,
  },
  lobby: {
    title: 'Two players',
    caption: 'Instant setup',
    accent: colors.accent,
    accentSecondary: colors.brand,
  },
  drawing: {
    title: 'Sketch fast',
    caption: 'Beat the timer',
    variant: 'arrow' as const,
    accent: colors.warning,
    accentSecondary: colors.brand,
  },
  results: {
    title: 'Big wins',
    caption: 'Score + rewards',
    variant: 'confetti' as const,
    accent: colors.success,
    accentSecondary: colors.accent,
  },
  history: {
    title: 'Saved games',
    caption: 'Replay highlights',
    accent: colors.brandDark,
    accentSecondary: colors.accent,
  },
};

export default function PreviewScreens({ navigation }: any) {
  const { setPreviewGame } = useGame();

  const openPreview = (route: string, meta: any, previewGame?: () => any, previewHistory?: any) => {
    setPreviewGame(previewGame ? previewGame() : null);
    navigation.navigate(route, {
      previewMode: true,
      previewMeta: meta,
      previewHistory,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Screenshot Studio" subtitle="Tap each screen and capture a screenshot." />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Store-ready screenshots</Text>
        <Text style={styles.heroSubtitle}>
          Each preview opens the real UI with bold captions and playful accents.
        </Text>
      </View>

      <View style={styles.grid}>
        <Button
          title="Home Screen"
          onPress={() => openPreview('Home', PREVIEW_META.home)}
          style={styles.primaryButton}
        />
        <Button
          title="Player Setup"
          variant="secondary"
          onPress={() => openPreview('Lobby', PREVIEW_META.lobby, getLobbyPreviewGame)}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
        <Button
          title="Gameplay"
          variant="secondary"
          onPress={() => openPreview('Drawing', PREVIEW_META.drawing, getDrawingPreviewGame)}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
        <Button
          title="Results"
          variant="secondary"
          onPress={() => openPreview('Results', PREVIEW_META.results, getResultsPreviewGame)}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
        <Button
          title="Feature Highlight"
          variant="secondary"
          onPress={() => openPreview('History', PREVIEW_META.history, undefined, getPreviewHistory())}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      </View>

      <Text style={styles.note}>
        Tip: Capture 5–7 screenshots per platform. Center the phone and leave breathing space.
      </Text>

      <Button
        title="Back to Home"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        textStyle={styles.backButtonText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  heroTitle: {
    ...typography.title,
    fontSize: Math.min(30, width * 0.08),
  },
  heroSubtitle: {
    ...typography.subtitle,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  grid: {
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.brand,
  },
  secondaryButton: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.brand,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.brand,
  },
  note: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
  },
  backButtonText: {
    color: colors.textSecondary,
  },
});

