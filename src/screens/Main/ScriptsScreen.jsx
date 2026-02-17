import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import FilterTabs from '../../components/common/FilterTabs';
import ScriptCard from '../../components/common/ScriptCard';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Scripts management screen for viewing, creating, and editing practice scripts.
 * 
 * Screen Variables (for web version reuse):
 * 
 * State Variables:
 * - filterType: selected filter ('self-authored' | 'auto-generated')
 * - scripts: array of script objects
 * - isLoading: boolean loading state
 * 
 * Derived Variables:
 * - filteredScripts: scripts filtered by current filterType
 * - filterTabs: array of tab options for FilterTabs component
 * 
 * Script Object Structure:
 * - id: unique script identifier
 * - title: script title/name
 * - description: script body preview text
 * - type: 'self-authored' | 'auto-generated'
 * - editedAt: ISO timestamp of last edit
 * - content: full script content
 * - createdAt: ISO timestamp of creation
 * 
 * Handlers:
 * - handleGoBack: navigate back to previous screen
 * - handleWriteScript: navigate to script creation screen
 * - handleGenerateScript: trigger AI script generation
 * - handleEditScript: navigate to script editor with script ID
 * - handleUseInPractice: start practice session with selected script
 * - handleFilterChange: update filterType state
 */
const ScriptsScreen = ({ navigation }) => {
  const [filterType, setFilterType] = useState('self-authored');
  const [scripts, setScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter tabs configuration
  const filterTabs = useMemo(
    () => [
      { value: 'self-authored', label: 'Self-Authored' },
      { value: 'auto-generated', label: 'Auto-Generated' },
    ],
    []
  );

  // Mock data - replace with Supabase API call
  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    setIsLoading(true);
    
    // Simulate API call - replace with actual Supabase query
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Mock script data
    const mockScripts = [
      {
        id: '1',
        title: 'Graduation Speech Draft 1',
        description:
          'Fellow students, teachers, and parents. Today marks the end of long journey, but also the beginning of an exciting new...',
        type: 'self-authored',
        editedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        content: 'Full script content here...',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '2',
        title: 'Graduation Speech Draft 1',
        description:
          'Fellow students, teachers, and parents. Today marks the end of long journey, but also the beginning of an exciting new...',
        type: 'self-authored',
        editedAt: new Date(Date.now() - 86400000).toISOString(),
        content: 'Full script content here...',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: '3',
        title: 'Graduation Speech Draft 1',
        description:
          'Fellow students, teachers, and parents. Today marks the end of long journey, but also the beginning of an exciting new...',
        type: 'self-authored',
        editedAt: new Date(Date.now() - 86400000).toISOString(),
        content: 'Full script content here...',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: '4',
        title: 'AI Generated Speech',
        description:
          'Welcome everyone to this momentous occasion. As we gather here today, we celebrate achievements and look forward to...',
        type: 'auto-generated',
        editedAt: new Date(Date.now() - 43200000).toISOString(),
        content: 'Full AI-generated script content here...',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ];

    setScripts(mockScripts);
    setIsLoading(false);
  };

  // Filter scripts based on selected type
  const filteredScripts = useMemo(() => {
    return scripts.filter((script) => script.type === filterType);
  }, [scripts, filterType]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleWriteScript = () => {
    navigation.navigate('ScriptEditor', { isNew: true });
  };

  const handleGenerateScript = () => {
    // Navigate to AI script generation screen
    Alert.alert('Generate Script', 'AI script generation will be available soon');
  };

  const handleEditScript = (scriptId) => {
    const script = scripts.find((s) => s.id === scriptId);
    navigation.navigate('ScriptEditor', { scriptId, script });
  };

  const handleUseInPractice = (scriptId) => {
    const script = scripts.find((s) => s.id === scriptId);
    if (!script) return;

    // Navigate to practice screen with script content
    navigation.navigate('Practice', { 
      scriptContent: script.content,
      scriptTitle: script.title 
    });
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const formatEditedTime = (isoTimestamp) => {
    const now = new Date();
    const edited = new Date(isoTimestamp);
    const diffMs = now - edited;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return 'EDITED TODAY';
    } else if (diffDays === 1) {
      return 'EDITED YESTERDAY';
    } else if (diffDays < 7) {
      return `EDITED ${diffDays} DAYS AGO`;
    } else {
      return `EDITED ${edited.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.black} />
          </TouchableOpacity>
          <Typography variant="h3">Scripts</Typography>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scripts List - includes action buttons + filter + scripts */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Action Buttons */}
          <PrimaryButton
            title="Write Script"
            onPress={handleWriteScript}
            variant="outline"
            style={styles.writeButton}
          />
          <Typography variant="body" color="textSecondary" style={styles.orText}>
            or
          </Typography>
          <PrimaryButton
            title="Generate Script"
            onPress={handleGenerateScript}
            variant="primary"
            style={styles.generateButton}
          />

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <FilterTabs
              tabs={filterTabs}
              selected={filterType}
              onSelect={handleFilterChange}
            />
          </View>

          {/* Scripts Cards */}
          {filteredScripts.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography variant="body" color="textSecondary" align="center">
                No {filterType === 'self-authored' ? 'self-authored' : 'auto-generated'} scripts yet
              </Typography>
              <Typography variant="bodySmall" color="textSecondary" align="center" style={styles.emptySubtext}>
                {filterType === 'self-authored'
                  ? 'Tap "Write Script" to create your first script'
                  : 'Tap "Generate Script" to create an AI-generated script'}
              </Typography>
            </View>
          ) : (
            filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                title={script.title}
                description={script.description}
                type={script.type}
                editedTime={formatEditedTime(script.editedAt)}
                onEdit={() => handleEditScript(script.id)}
                onUseInPractice={() => handleUseInPractice(script.id)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    paddingBottom: 100,
  },
  writeButton: {
    width: '100%',
    marginBottom: spacing.xs,
  },
  orText: {
    textAlign: 'center',
    marginVertical: spacing.xs,
    fontSize: 12,
  },
  generateButton: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  filterContainer: {
    marginBottom: spacing.sm,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptySubtext: {
    marginTop: spacing.xs,
  },
});

export default ScriptsScreen;
