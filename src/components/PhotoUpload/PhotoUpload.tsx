import { useState } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadIcon from 'assets/image.png';
import { styles } from './styles';

interface PhotoUploadProps {
  onSelect: (uri: string | null) => void;
}

export default function PhotoUpload({ onSelect }: PhotoUploadProps) {
  const [image, setImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { granted: cameraGranted } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { granted: galleryGranted } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cameraGranted || !galleryGranted) {
      Alert.alert(
        'Permission needed',
        'Please allow camera and photo library access.',
      );
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    if (!(await requestPermissions())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onSelect(uri);
    }
  };

  const openGallery = async () => {
    if (!(await requestPermissions())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onSelect(uri);
    }
  };

  const handlePress = () => {
    if (image) {
      Alert.alert('Replace or Delete?', '', [
        { text: 'Replace', onPress: openGallery },
        {
          text: 'Delete',
          style: 'destructive' as const,
          onPress: () => {
            setImage(null);
            onSelect(null);
          },
        },
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    } else {
      Alert.alert('Add Photo', '', [
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {image ? (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Image source={uploadIcon} style={styles.icon} resizeMode="contain" />
        </View>
      )}
    </TouchableOpacity>
  );
}
