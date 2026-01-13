import React from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../styles/colors';
import { borderRadius } from '../../styles/spacing';

/**
 * Audio record button component
 * @param {Object} props
 * @param {boolean} props.isRecording - Whether recording is active
 * @param {boolean} [props.isProcessing] - Whether audio is being processed
 * @param {boolean} [props.disabled] - Disable button
 * @param {Function} props.onPress - Press handler (start/stop recording)
 * @param {number} [props.size] - Button size
 * @param {Object} [props.style] - Additional styles
 */
const AudioRecordButton = ({
  isRecording = false,
  isProcessing = false,
  disabled = false,
  onPress,
  size = 80,
  style,
  ...props
}) => {
  const isDisabled = disabled || isProcessing;

  const containerSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const innerSize = {
    width: isRecording ? size * 0.35 : size * 0.6,
    height: isRecording ? size * 0.35 : size * 0.6,
    borderRadius: isRecording ? 4 : (size * 0.6) / 2,
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        containerSize,
        isRecording && styles.container_recording,
        isDisabled && styles.container_disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {isProcessing ? (
        <ActivityIndicator color={colors.white} size="large" />
      ) : (
        <View
          style={[
            styles.inner,
            innerSize,
            isRecording && styles.inner_recording,
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  container_recording: {
    backgroundColor: colors.error,
  },
  container_disabled: {
    backgroundColor: colors.gray400,
  },
  inner: {
    backgroundColor: colors.white,
  },
  inner_recording: {
    backgroundColor: colors.white,
  },
});

export default AudioRecordButton;
