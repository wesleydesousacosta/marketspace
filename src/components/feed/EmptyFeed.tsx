import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyFeedProps {
  searchQuery: string;
  onAddItem: () => void;
}

export function EmptyFeed({ searchQuery, onAddItem }: EmptyFeedProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="search" size={40} color="#ADB5BD" />
      </View>
      <Text style={styles.emptyTitle}>Nenhum item encontrado</Text>
      <Text style={styles.emptySub}>
        {searchQuery 
          ? `Não achamos nada com "${searchQuery}".` 
          : "Nenhum móvel foi anunciado ainda."}
      </Text>
      
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyBtn} onPress={onAddItem}>
           <Text style={styles.emptyBtnText}>Seja o primeiro a vender!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconBg: { 
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#E9ECEF', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 16 
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#343A40', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#868E96', textAlign: 'center', lineHeight: 22 },
  emptyBtn: { marginTop: 20, backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  emptyBtnText: { color: 'white', fontWeight: 'bold' }
});