import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uploadIcon from 'assets/image.png';

interface PhotoUploadProps {
  onSelect: (uri: string | null) => void;
}

export default function PhotoUpload({ onSelect }: PhotoUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isPickerLoading, setIsPickerLoading] = useState(false);

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
    setIsPickerLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        onSelect(uri);
      }
    } finally {
      setIsPickerLoading(false);
    }
  };

  const openGallery = async () => {
    if (!(await requestPermissions())) return;
    setIsPickerLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        onSelect(uri);
      }
    } finally {
      setIsPickerLoading(false);
    }
  };

  const handlePress = () => {
    if (image) {
      Alert.alert('Replace or Delete?', '', [
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Replace from Gallery', onPress: openGallery },
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
    <Pressable
      className="w-full"
      onPress={handlePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      accessibilityLabel="Upload photo"
      accessibilityRole="button"
    >
      {isPickerLoading ? (
        <View className="w-full h-[70px] rounded-xl bg-neutral-100 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : image ? (
        <View className="w-full overflow-hidden" style={{ aspectRatio: 4 / 3 }}>
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
        </View>
      ) : (
        <View className="w-full h-[70px] rounded-xl bg-neutral-100 justify-center items-center">
          <Image
            source={uploadIcon}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
      )}
    </Pressable>
  );
}
