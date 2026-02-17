import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import Card from '../../components/common/Card';
import PrimaryButton from '../../components/common/PrimaryButton';
import FilterTabs from '../../components/common/FilterTabs';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * PracticeScreen — Practice Setup screen.
 *
 * Layout (top -> bottom):
 * 1. Back button
 * 2. "Practice Setup" title + helper text
 * 3. Pre-written / Generate tabs
 * 4. Script list cards
 * 5. Cancel button
 *
 * State Variables (for web version reuse):
 * - selectedTab: 'prewritten' | 'generate'
 * - preWrittenScripts: array of script objects for the Pre-written tab
 * - generatedScripts: array of script objects for the Generate tab
 * - isLoading: boolean loading flag for data fetch
 */
const PracticeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('prewritten');
  const [preWrittenScripts, setPreWrittenScripts] = useState([]);
  const [generatedScripts, setGeneratedScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPracticeScripts = async () => {
      setIsLoading(true);
      // TODO: Replace with Supabase query (practice_scripts) and map to UI fields.
      setPreWrittenScripts([
        {
          id: '1',
          title: 'Graduation Speech',
          body:
            'Fellow students, teachers, and parents. Today marks the end of long journey, but also the beginning of an exciting new...',
        },
        {
          id: '2',
          title: 'Graduation Speech',
          body:
            'Fellow students, teachers, and parents. Today marks the end of long journey, but also the beginning of an exciting new...',
        },
        {
          id: '3',
          title: 'Graduation Speech',
          body:
            'Fellow students, teachers, and parents. Today marks the end of long journey, but also the beginning of an exciting new...',
        },
      ]);
      setGeneratedScripts([]);
      setIsLoading(false);
    };

    loadPracticeScripts();
  }, []);

  /** @type {Array<{value: string, label: string}>} */
  const tabOptions = useMemo(
    () => [
      { value: 'prewritten', label: 'Pre-written' },
      { value: 'generate', label: 'Generate' },
    ],
    []
  );

  /** @type {Array<{id: string, title: string, body: string}>} */
  const visibleScripts = selectedTab === 'prewritten' ? preWrittenScripts : generatedScripts;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleCancel = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleScriptPress = (script) => {
    // TODO: Navigate to practice session with selected script.
    console.info('Selected script:', script?.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.black} />
          </TouchableOpacity>

          {/* Title */}
          <Typography variant="h1" style={styles.title}>
            Practice{"\n"}Setup
          </Typography>
          <Typography variant="body" weight="medium" color="textSecondary" style={styles.subtitle}>
            Choose one of these pre-written speech or{"\n"}
            generate your own to start.
          </Typography>

          {/* Tabs */}
          <FilterTabs
            tabs={tabOptions}
            selected={selectedTab}
            onSelect={setSelectedTab}
            containerStyle={styles.tabsContainer}
            tabStyle={styles.tab}
            activeTabStyle={styles.tabActive}
            labelStyle={styles.tabLabel}
            activeLabelStyle={styles.tabLabelActive}
          />

          {/* List */}
          <View style={styles.listWrap}>
            {isLoading ? (
              <Typography variant="bodySmall" color="textSecondary" align="center">
                Loading scripts...
              </Typography>
            ) : visibleScripts.length === 0 ? (
              <Typography variant="bodySmall" color="textSecondary" align="center">
                No scripts yet.
              </Typography>
            ) : (
              visibleScripts.map((script) => (
                <TouchableOpacity
                  key={script.id}
                  activeOpacity={0.9}
                  onPress={() => handleScriptPress(script)}
                >
                  <Card style={styles.scriptCard} padding={spacing.md}>
                    <Typography variant="body" weight="bold" style={styles.scriptTitle}>
                      {script.title}
                    </Typography>
                    <Typography
                      variant="bodySmall"
                      color="textSecondary"
                      numberOfLines={3}
                      style={styles.scriptBody}
                    >
                      {script.body}
                    </Typography>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Footer */}
          <PrimaryButton
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  tabsContainer: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  tab: {
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.black,
  },
  listWrap: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  scriptCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  scriptTitle: {
    marginBottom: spacing.xs,
  },
  scriptBody: {
    lineHeight: 18,
  },
  cancelButton: {
    width: '100%',
  },
});

export default PracticeScreen;
