import { Item } from '@/src/db/schema';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MyItemCardProps {
  item: Item;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function MyItemCard({ item, onEdit, onDelete }: MyItemCardProps) {
  
  const formatPrice = (val: number) => 
    (val / 100).toFixed(2).replace('.', ',');

  return (
    <View style={styles.card}>
      {/* Corpo do Card */}
      <View style={styles.cardBody}>
        <Image source={{ uri: item.image }} style={styles.image} />
        
        <View style={styles.info}>
          <View>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.itemPrice}>R$ {formatPrice(item.price)}</Text>
          </View>
          
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Ativo</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />

      {/* Ações */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.editBtn]} 
          onPress={() => onEdit(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color="#007AFF" />
          <Text style={styles.editBtnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]} 
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <Text style={styles.deleteBtnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  cardBody: { flexDirection: 'row', padding: 12 },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F1F3F5' },
  info: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#212529' },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#007AFF', marginTop: 2 },
  statusBadge: { 
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: '#E6FCF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#20C997', marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#0CA678' },
  divider: { height: 1, backgroundColor: '#F1F3F5' },
  actions: { flexDirection: 'row', height: 48 },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  editBtn: { borderBottomLeftRadius: 16 },
  deleteBtn: { borderBottomRightRadius: 16 },
  editBtnText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  deleteBtnText: { color: '#FF3B30', fontWeight: '600', fontSize: 14 },
});