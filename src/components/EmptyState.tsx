import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  iconName?: keyof typeof Ionicons.glyphMap; // Permite qualquer ícone do Ionicons
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title, 
  subtitle, 
  iconName = "search", 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Ionicons name={iconName} size={40} color="#ADB5BD" />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{subtitle}</Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
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
  actionBtn: { 
    marginTop: 24, backgroundColor: '#007AFF', 
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 
  },
  actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});