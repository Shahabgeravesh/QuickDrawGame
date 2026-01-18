import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Header from '../components/ui/Header';
import { colors, spacing, radius, shadows } from '../theme';

const { width, height } = Dimensions.get('window');

export default function TutorialScreen({ navigation }: any) {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header title="How to Play" onBack={handleBack} />

        {/* Game Flow Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Flow</Text>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Setup</Text>
              <Text style={styles.stepDescription}>
                Add players (game is 3 rounds)
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Drawing</Text>
              <Text style={styles.stepDescription}>
                One player draws the secret word. Only they see it - others only see the drawing
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Guessing</Text>
              <Text style={styles.stepDescription}>
                Players take turns guessing. One guess per round per player
              </Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepNumberCircle}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Results</Text>
              <Text style={styles.stepDescription}>
                Check scores and pass to the next drawer
              </Text>
            </View>
          </View>
        </View>

        {/* Points System Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scoring</Text>
          
          <View style={styles.pointsCard}>
            <Text style={styles.pointsTitle}>Correct Guess Points</Text>
            
            <View style={styles.pointItem}>
              <View style={styles.pointBadge}>
                <Text style={styles.pointValue}>10</Text>
              </View>
              <Text style={styles.pointLabel}>Base points</Text>
            </View>

            <View style={styles.pointItem}>
              <View style={styles.pointBadge}>
                <Text style={styles.pointValue}>1-5</Text>
              </View>
              <Text style={styles.pointLabel}>Time bonus (1 per 10 seconds remaining, max 5)</Text>
            </View>

            <View style={styles.pointItem}>
              <View style={styles.pointBadge}>
                <Text style={styles.pointValue}>+</Text>
              </View>
              <Text style={styles.pointLabel}>Bonus rewards for achievements</Text>
            </View>
          </View>

          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>Example</Text>
            <Text style={styles.exampleText}>
              Correct guess in 12 seconds:{'\n'}
              Base: 10 points{'\n'}
              Time bonus: 4 points{'\n'}
              Speed reward: 8 points{'\n'}
              <Text style={styles.exampleTotal}>Total: 22 points</Text>
            </Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>Lightning Brain</Text>
            <Text style={styles.achievementPoints}>+8 points</Text>
            <Text style={styles.achievementDesc}>Guess in less than 15% of time</Text>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>Quick on the Draw</Text>
            <Text style={styles.achievementPoints}>+5 points</Text>
            <Text style={styles.achievementDesc}>Guess in less than 35% of time</Text>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>First Try</Text>
            <Text style={styles.achievementPoints}>+5 points</Text>
            <Text style={styles.achievementDesc}>Correct on your first guess</Text>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>Hot Streak</Text>
            <Text style={styles.achievementPoints}>+5 points</Text>
            <Text style={styles.achievementDesc}>3 correct guesses in a row</Text>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>Unstoppable</Text>
            <Text style={styles.achievementPoints}>+10 points</Text>
            <Text style={styles.achievementDesc}>5+ correct guesses in a row</Text>
          </View>

          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>Never Give Up</Text>
            <Text style={styles.achievementPoints}>+3 points</Text>
            <Text style={styles.achievementDesc}>Correct after 3+ wrong guesses</Text>
          </View>
        </View>

        {/* Drawer Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drawer Rewards</Text>
          <Text style={styles.drawerIntro}>
            When players guess correctly, the drawer earns points too
          </Text>

          <View style={styles.drawerCard}>
            <Text style={styles.drawerTitle}>Perfect Recognition</Text>
            <Text style={styles.drawerPoints}>+8 points</Text>
            <Text style={styles.drawerDesc}>Everyone guessed correctly</Text>
          </View>

          <View style={styles.drawerCard}>
            <Text style={styles.drawerTitle}>Artistic Legend</Text>
            <Text style={styles.drawerPoints}>+5 points</Text>
            <Text style={styles.drawerDesc}>At least half guessed correctly</Text>
          </View>

          <View style={styles.drawerCard}>
            <Text style={styles.drawerTitle}>Decent Effort</Text>
            <Text style={styles.drawerPoints}>+3 points</Text>
            <Text style={styles.drawerDesc}>At least one person guessed correctly</Text>
          </View>

          <View style={styles.drawerCard}>
            <Text style={styles.drawerTitle}>Consolation</Text>
            <Text style={styles.drawerPoints}>+2 points</Text>
            <Text style={styles.drawerDesc}>No one guessed correctly</Text>
          </View>
        </View>

        {/* Important Rules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          
          <View style={styles.ruleItem}>
            <View style={styles.ruleBullet} />
            <Text style={styles.ruleText}>One guess per round per player</Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleBullet} />
            <Text style={styles.ruleText}>Round ends when someone guesses correctly</Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleBullet} />
            <Text style={styles.ruleText}>Wrong guesses reset your streak</Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleBullet} />
            <Text style={styles.ruleText}>Drawer cannot guess their own drawing</Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleBullet} />
            <Text style={styles.ruleText}>Secret word is only visible to the drawer</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneButton} onPress={handleBack}>
            <Text style={styles.doneButtonText}>Got it, let's play</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'left',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.brand,
    ...shadows.sm,
  },
  stepNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  pointsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pointsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pointBadge: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 14,
    minWidth: 50,
    alignItems: 'center',
  },
  pointValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointLabel: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 20,
  },
  exampleCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  exampleTotal: {
    fontWeight: '600',
    color: '#1F2937',
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 6,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  drawerIntro: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 22,
  },
  drawerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  drawerPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 6,
  },
  drawerDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brand,
    marginRight: spacing.lg,
    marginTop: spacing.sm,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  doneButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
    ...shadows.sm,
  },
  doneButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});

