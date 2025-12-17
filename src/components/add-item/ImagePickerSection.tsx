import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerSectionProps {
  imageUri: string;
  onImageSelected: (uri: string) => void;
  onClearImage: () => void;
}

export function ImagePickerSection({ imageUri, onImageSelected, onClearImage }: ImagePickerSectionProps) {
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) onImageSelected(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) return Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) onImageSelected(result.assets[0].uri);
  };

  return (
    <View style={styles.imageSection}>
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeImageBtn} onPress={onClearImage}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="image-outline" size={64} color="#ccc" />
          <Text style={styles.placeholderText}>Adicione uma foto do produto</Text>
        </View>
      )}

      <View style={styles.imageButtonsRow}>
        <TouchableOpacity style={styles.imageActionBtn} onPress={pickImage}>
          <Ionicons name="images" size={20} color="#007AFF" />
          <Text style={styles.imageActionText}>Galeria</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.imageActionBtn} onPress={takePhoto}>
          <Ionicons name="camera" size={20} color="#007AFF" />
          <Text style={styles.imageActionText}>Câmera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageSection: { marginBottom: 32, alignItems: 'center' },
  placeholderContainer: {
    width: '100%', height: 200, backgroundColor: '#F8F9FA', borderWidth: 2, borderColor: '#E9ECEF',
    borderStyle: 'dashed', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  placeholderText: { color: '#ADB5BD', marginTop: 8, fontWeight: '500' },
  imagePreviewContainer: { position: 'relative', width: '100%', marginBottom: 16 },
  imagePreview: { width: '100%', height: 250, borderRadius: 16 },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  imageButtonsRow: { flexDirection: 'row', gap: 12 },
  imageActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, gap: 8 },
  imageActionText: { color: '#007AFF', fontWeight: '600' },
});