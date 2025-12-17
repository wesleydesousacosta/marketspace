import { Item } from '@/src/db/schema';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeedCardProps {
  item: Item & { isFavorite?: boolean | null };
  onPress: (id: number) => void;
  onToggleFav: (id: number) => void;
}

function FeedCardComponent({ item, onPress, onToggleFav }: FeedCardProps) {
  
  const formattedPrice = (item.price / 100).toFixed(2).replace('.', ',');

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => onPress(item.id)} 
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      
      <View style={styles.info}>
        <View style={styles.rowBetween}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.price}>R$ {formattedPrice}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      </View>

      <TouchableOpacity 
        style={styles.favBtn} 
        onPress={() => onToggleFav(item.id)}
      >
        <Ionicons 
          name={!!item.isFavorite ? "heart" : "heart-outline"} 
          size={22} 
          color={!!item.isFavorite ? "#FF3B30" : "#1A1A1A"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export const FeedCard = memo(FeedCardComponent);

const styles = StyleSheet.create({
  card: { 
    margin: 20,
    backgroundColor: 'white', borderRadius: 16, marginBottom: 20, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  image: { width: '100%', height: 220, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: '#E9ECEF' },
  info: { padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#212529', flex: 1, marginRight: 8 },
  price: { fontSize: 18, fontWeight: '700', color: '#007AFF' },
  desc: { fontSize: 14, color: '#868E96', lineHeight: 20 },
  favBtn: { 
    position: 'absolute', top: 12, right: 12, 
    backgroundColor: 'white', borderRadius: 20, width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
  },
});