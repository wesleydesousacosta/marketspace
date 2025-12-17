import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ItemContentProps {
  title: string;
  price: number;
  description: string | null;
}

export function ItemContent({ title, price, description }: ItemContentProps) {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.handleBar} />
      
      <View style={styles.headerRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.sellerInfo}>
             <Ionicons name="shield-checkmark" size={16} color="#0CA678" />
             <Text style={styles.sellerText}>Vendedor verificado</Text>
          </View>
        </View>
        <Text style={styles.price}>
          {formatCurrency(price)}
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.description}>
         {description || "O vendedor não forneceu uma descrição detalhada."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1, backgroundColor: 'white',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    marginTop: -40, paddingHorizontal: 24, paddingTop: 24,
    minHeight: 600, 
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
  },
  handleBar: { width: 48, height: 5, backgroundColor: '#E9ECEF', borderRadius: 3, alignSelf: 'center', marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', lineHeight: 32, marginBottom: 6, flexShrink: 1 },
  price: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  sellerInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sellerText: { color: '#666', fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F3F5', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 26, color: '#495057' },
});