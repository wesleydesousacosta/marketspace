import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditItemImageProps {
  imageUri: string;
  onPickImage: () => void;
  onTakePhoto: () => void;
}

export function EditItemImage({ imageUri, onPickImage, onTakePhoto }: EditItemImageProps) {
  return (
    <View style={styles.imageSection}>
      <Text style={styles.sectionTitle}>Foto do Produto</Text>
      
      <View style={styles.imagePreviewWrapper}>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        <View style={styles.imageOverlay}>
           <Text style={styles.imageOverlayText}>Imagem Atual</Text>
        </View>
      </View>
      
      <View style={styles.imageButtonsRow}>
         <TouchableOpacity style={styles.changeImageBtn} onPress={onPickImage}>
           <Ionicons name="images-outline" size={18} color="#333" />
           <Text style={styles.changeImageText}>Galeria</Text>
         </TouchableOpacity>
         
         <TouchableOpacity style={styles.changeImageBtn} onPress={onTakePhoto}>
           <Ionicons name="camera-outline" size={18} color="#333" />
           <Text style={styles.changeImageText}>Câmera</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  imageSection: { marginBottom: 24 },
  imagePreviewWrapper: { position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  imagePreview: { width: '100%', height: 200, backgroundColor: '#F0F0F0' },
  imageOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, alignItems: 'center'
  },
  imageOverlayText: { color: 'white', fontSize: 12, fontWeight: '600' },
  imageButtonsRow: { flexDirection: 'row', gap: 10 },
  changeImageBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF',
    paddingVertical: 10, borderRadius: 8, gap: 6
  },
  changeImageText: { color: '#333', fontWeight: '500', fontSize: 13 },
});