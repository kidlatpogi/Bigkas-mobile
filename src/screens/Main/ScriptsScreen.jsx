import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../components/common/Typography';
import PrimaryButton from '../../components/common/PrimaryButton';
import FilterTabs from '../../components/common/FilterTabs';
import ScriptCard from '../../components/common/ScriptCard';
import { fetchScripts, deleteScript } from '../../api/scriptsApi';
import { colors } from '../../styles/colors';
import { spacing, borderRadius } from '../../styles/spacing';

/**
 * Scripts management screen for viewing, creating, and editing practice scripts.
 *
 * State Variables:
 * - filterType: selected filter ('self-authored' | 'auto-generated')
 * - scripts: array of script objects from Supabase `scripts` table
 * - isLoading: boolean loading state
 *
 * Derived Variables:
 * - filteredScripts: scripts filtered by current filterType
 * - filterTabs: array of tab options for FilterTabs component
 *
 * Script Object (from Supabase):
 * - id: uuid
 * - user_id: uuid
 * - title: text
 * - content: text (full script body)
 * - type: 'self-authored' | 'auto-generated'
 * - created_at: timestamptz
 * - updated_at: timestamptz
 *
 * Handlers:
 * - handleGoBack: navigate back to previous screen
 * - handleWriteScript: navigate to script creation screen
 * - handleGenerateScript: navigate to GenerateScript screen
 * - handleEditScript: navigate to script editor with script ID
 * - handleDeleteScript: confirm + delete script from Supabase
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

  // Reload scripts when screen gains focus (after editing / generating)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadScripts();
    });
    return unsubscribe;
  }, [navigation]);

  const loadScripts = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchScripts();
    if (result.success) {
      setScripts(result.scripts || []);
    } else {
      console.warn('Failed to load scripts:', result.error);
    }
    setIsLoading(false);
  }, []);

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
    navigation.navigate('GenerateScript', { entryPoint: 'scripts' });
  };

  const handleEditScript = (scriptId) => {
    const script = scripts.find((s) => s.id === scriptId);
    navigation.navigate('ScriptEditor', { scriptId, script });
  };

  const handleDeleteScript = (scriptId) => {
    Alert.alert(
      'Delete Script',
      'Are you sure you want to delete this script? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteScript(scriptId);
            if (result.success) {
              setScripts((prev) => prev.filter((s) => s.id !== scriptId));
            } else {
              Alert.alert('Error', 'Failed to delete script');
            }
          },
        },
      ]
    );
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const formatEditedTime = (isoTimestamp) => {
    if (!isoTimestamp) return '';
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
          {isLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : filteredScripts.length === 0 ? (
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
                description={script.content}
                type={script.type}
                editedTime={formatEditedTime(script.updated_at)}
                onEdit={() => handleEditScript(script.id)}
                onDelete={() => handleDeleteScript(script.id)}
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
