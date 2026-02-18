import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Typography from './Typography';
import { colors } from '../../styles/colors';
import { borderRadius } from '../../styles/spacing';

/**
 * Reusable avatar display and picker component.
 * @param {Object} props
 * @param {string} [props.uri] - Avatar image URI.
 * @param {string} [props.username] - Fallback username for initial display.
 * @param {number} [props.size] - Avatar diameter in pixels.
 * @param {boolean} [props.editable] - Show camera icon if true.
 * @param {Function} [props.onImageSelect] - Callback when image is picked (uri) => void.
 * @param {Function} [props.onImageSelectAndUpload] - Callback to handle auto-upload (uri, onProgress?) => Promise<void>.
 * @param {Object} [props.style] - Additional container styles.
 */
const AvatarPicker = ({
  uri,
  username = 'U',
  size = 120,
  editable = false,
  onImageSelect,
  onImageSelectAndUpload,
  style,
}) => {
  const handlePickImage = async () => {
    if (!editable || (!onImageSelect && !onImageSelectAndUpload)) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedUri = result.assets[0].uri;
      
      // Call onImageSelect if provided (form field update)
      if (onImageSelect) {
        onImageSelect(selectedUri);
      }
      
      // Call onImageSelectAndUpload if provided (auto-save to Supabase)
      if (onImageSelectAndUpload) {
        await onImageSelectAndUpload(selectedUri);
      }
    }
  };

  const containerSize = { width: size, height: size, borderRadius: size / 2 };
  const iconSize = Math.floor(size * 0.267); // ~32px for 120px avatar
  const iconContainerSize = Math.floor(size * 0.267);

  return (
    <TouchableOpacity
      style={[styles.container, containerSize, style]}
      onPress={handlePickImage}
      disabled={!editable}
      activeOpacity={editable ? 0.7 : 1}
    >
      {uri ? (
        <Image source={{ uri }} style={[styles.image, containerSize]} />
      ) : (
        <View style={[styles.placeholder, containerSize]}>
          <Typography variant="h1" color="textInverse">
            {username.charAt(0).toUpperCase()}
          </Typography>
        </View>
      )}
      {editable && (
        <View
          style={[
            styles.cameraIcon,
            {
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerSize / 2,
            },
          ]}
        >
          <Ionicons name="camera" size={Math.floor(iconSize * 0.67)} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderWidth: 3,
    borderColor: colors.white,
  },
  placeholder: {
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default AvatarPicker;
