import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

const MAX_WIDTH = 1280;
const COMPRESSION = 0.7;

/**
 * Resizes an image to a max width and re-encodes as JPEG, returning a
 * base64 string suitable for the GPT Vision endpoint.
 */
export const compressForVision = async (
  uri: string
): Promise<{ base64: string; mime: 'image/jpeg' }> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_WIDTH } }],
    {
      compress: COMPRESSION,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );
  if (!result.base64) throw new Error('compression_failed');
  return { base64: result.base64, mime: 'image/jpeg' };
};

/**
 * Prompts the user to take a photo or pick from library, returning the URI of
 * the chosen image (or null if cancelled / permission denied).
 */
export const captureReceipt = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Receipt',
      'Pick a source',
      [
        {
          text: 'Take photo',
          onPress: async () => {
            const perm = await ImagePicker.requestCameraPermissionsAsync();
            if (!perm.granted) return resolve(null);
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              quality: 0.9,
              allowsEditing: false,
            });
            resolve(result.canceled ? null : result.assets[0].uri);
          },
        },
        {
          text: 'Choose from library',
          onPress: async () => {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) return resolve(null);
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              quality: 0.9,
              allowsEditing: false,
            });
            resolve(result.canceled ? null : result.assets[0].uri);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
};
