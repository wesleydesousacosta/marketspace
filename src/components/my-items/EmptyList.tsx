import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyListProps {
  onCreate: () => void;
}

export function EmptyList({ onCreate }: EmptyListProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="pricetags-outline" size={48} color="#ADB5BD" />
      </View>
      <Text style={styles.emptyTitle}>Nada por aqui ainda</Text>
      <Text style={styles.emptySub}>
        Você ainda não criou nenhum anúncio. Comece a vender hoje mesmo!
      </Text>
      <TouchableOpacity 
        style={styles.createBtn} 
        onPress={onCreate}
      >
        <Text style={styles.createBtnText}>Criar Primeiro Anúncio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 60 },
  emptyIconBg: { 
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#E9ECEF', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20 
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#343A40', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#868E96', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  createBtn: { 
    backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 14, 
    borderRadius: 12, elevation: 2 
  },
  createBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});