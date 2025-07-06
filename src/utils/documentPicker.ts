import { Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import DocumentPicker, { DocumentPickerResponse } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';

export interface DocumentPickerResult {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

// Custom rationale and permission request for image picker
export async function requestImagePickerPermission() {
  if (Platform.OS !== 'android') return true;

  const permission =
    Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  // Check if we should show rationale (guard for RN versions that don't support it)
  let shouldShow = false;
  const rationaleFn = (PermissionsAndroid as any).shouldShowRequestPermissionRationale;
  if (typeof rationaleFn === 'function') {
    shouldShow = await rationaleFn(permission);
  }

  if (shouldShow) {
    const proceed = await new Promise(resolve => {
      Alert.alert(
        'Permission Required',
        'We need access to your images to let you pick a photo. Please grant permission.',
        [
          { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
          { text: 'OK', onPress: () => resolve(true) },
        ]
      );
    });
    if (!proceed) return false;
  }

  try {
    const granted = await PermissionsAndroid.request(permission, {
      title: Platform.Version >= 33 ? 'Image Access Permission' : 'Storage Permission',
      message:
        Platform.Version >= 33
          ? 'App needs access to your images to pick a photo.'
          : 'App needs access to your storage to pick a photo.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Permission Denied',
        'You have permanently denied this permission. Please enable it from app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return false;
    } else {
      Alert.alert('Permission Denied', 'Storage/Image permission is required to pick a photo.');
      return false;
    }
  } catch (err) {
    Alert.alert('Permission Error', 'Failed to request permission');
    return false;
  }
}

// Pick document using document picker
export const pickDocument = async (
  type: string | string[] = '*/*',
  title?: string
): Promise<DocumentPickerResult | null> => {
  try {
    const result = await DocumentPicker.pick({
      type: type,
      copyTo: 'cachesDirectory',
    });

    if (result && result.length > 0) {
      const file = result[0];
      return {
        uri: file.uri,
        name: file.name || 'document',
        size: file.size || undefined,
        mimeType: file.type || 'application/octet-stream',
      };
    }

    return null;
  } catch (error: any) {
    if (error.code === 'E_DOCUMENT_PICKER_CANCELED') {
      // User cancelled the picker
      return null;
    }
    console.error('Document picker error:', error);
    Alert.alert('Error', 'Failed to pick document');
    return null;
  }
};

// Pick image using react-native-image-picker
export const pickImage = async (): Promise<DocumentPickerResult | null> => {
  try {
    const hasPermission = await requestImagePickerPermission();
    if (!hasPermission) {
      return null;
    }

    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      includeBase64: false,
    });

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      return null;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri || '',
        name: asset.fileName || 'image.jpg',
        size: asset.fileSize,
        mimeType: asset.type,
      };
    }

    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    Alert.alert('Error', 'Failed to pick image');
    return null;
  }
};

// Pick PDF using document picker
export const pickPDF = async (): Promise<DocumentPickerResult | null> => {
  try {
    console.log('Starting PDF picker...');
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
      copyTo: 'cachesDirectory',
      allowMultiSelection: false,
    });

    console.log('PDF picker result:', result);

    if (result && result.length > 0) {
      const file = result[0];
      console.log('Selected PDF file:', file);
      return {
        uri: file.uri,
        name: file.name || 'document.pdf',
        size: file.size || undefined,
        mimeType: file.type || 'application/pdf',
      };
    }

    return null;
  } catch (error: any) {
    console.error('PDF picker error details:', error);
    if (error.code === 'E_DOCUMENT_PICKER_CANCELED') {
      // User cancelled the picker
      return null;
    }
    
    // Try alternative approach for PDF picking
    try {
      console.log('Trying alternative PDF picker approach...');
      const result = await DocumentPicker.pick({
        type: '*/*',
        allowMultiSelection: false,
      });
      
      if (result && result.length > 0) {
        const file = result[0];
        // Check if it's actually a PDF
        if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')) {
          return {
            uri: file.uri,
            name: file.name || 'document.pdf',
            size: file.size || undefined,
            mimeType: 'application/pdf',
          };
        } else {
          Alert.alert('Error', 'Please select a PDF file');
          return null;
        }
      }
    } catch (altError: any) {
      console.error('Alternative PDF picker also failed:', altError);
    }
    
    Alert.alert('Error', `Failed to pick PDF: ${error.message || error}`);
    return null;
  }
};

export const pickAnyDocument = async (): Promise<DocumentPickerResult | null> => {
  return pickDocument(['*/*'], 'Select Document');
}; 