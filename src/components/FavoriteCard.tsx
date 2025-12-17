import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../db/schema'; // Ajuste o caminho conforme necessário

interface FavoriteCardProps {
  item: Item;
  onPress: () => void;
  onRemove: () => void;
}

export function FavoriteCard({ item, onPress, onRemove }: FavoriteCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>
          R$ {(item.price / 100).toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {item.description}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={onRemove}
      >
        <Ionicons name="heart" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: 'white', borderRadius: 16,
    padding: 12, marginBottom: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)'
  },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F0F0F0' },
  infoContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#212529', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '700', color: '#007AFF', marginBottom: 2 },
  desc: { fontSize: 13, color: '#868E96' },
  removeBtn: { padding: 10, backgroundColor: '#FFF0F0', borderRadius: 12 },
});