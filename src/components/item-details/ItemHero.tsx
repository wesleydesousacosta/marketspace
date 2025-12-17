import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ItemHeroProps {
  imageUri: string;
  isFav: boolean;
  onToggleFav: () => void;
}

export function ItemHero({ imageUri, isFav, onToggleFav }: ItemHeroProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.imageOverlay} />

      <TouchableOpacity 
        style={[styles.headerBtnBack, { top: (Platform.OS === 'ios' ? 50 : 20) + insets.top }]} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.headerBtnFav, { top: (Platform.OS === 'ios' ? 50 : 20) + insets.top }]} 
        onPress={onToggleFav}
      >
        <Ionicons 
          name={isFav ? "heart" : "heart-outline"} 
          size={24} 
          color={isFav ? "#FF3B30" : "#1A1A1A"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: { width: '100%', height: 380, position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: '#E9ECEF' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  headerBtnBack: {
    position: 'absolute', left: 20,
    backgroundColor: 'rgba(255,255,255,0.95)', width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5,
    zIndex: 10
  },
  headerBtnFav: {
    position: 'absolute', right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)', width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5,
    zIndex: 10
  },
});