import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert, FlatList, Image, RefreshControl,
  StatusBar,
  StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';

import { FloatingButton } from '../../../src/components/FloatingButton'; // Ajuste o caminho se necessário
import { deleteItem, getMyItems } from '../../../src/db/actions';
import { Item } from '../../../src/db/schema';

export default function MyItemsScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!userId) return;
    const data = await getMyItems(userId);
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [userId])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      "Excluir Anúncio",
      "Essa ação não pode ser desfeita. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            await deleteItem(id);
            loadData();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      {/* Corpo do Card: Imagem e Dados */}
      <View style={styles.cardBody}>
        <Image source={{ uri: item.image }} style={styles.image} />
        
        <View style={styles.info}>
          <View>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.itemPrice}>
              R$ {(item.price / 100).toFixed(2).replace('.', ',')}
            </Text>
          </View>
          
          {/* Badge de Status (Visual apenas) */}
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Ativo</Text>
          </View>
        </View>
      </View>
      
      {/* Linha Divisória */}
      <View style={styles.divider} />

      {/* Ações */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.editBtn]} 
          onPress={() => router.push(`/(app)/edit/${item.id}`)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color="#007AFF" />
          <Text style={styles.editBtnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]} 
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <Text style={styles.deleteBtnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Anúncios</Text>
        <Text style={styles.headerSubtitle}>
          Gerencie o que você está vendendo ({items.length})
        </Text>
      </View>

      {items.length === 0 ? (
        // --- EMPTY STATE ---
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
            onPress={() => router.push('/(app)/(tabs)/add')} // Link direto para add (sem tabs)
          >
            <Text style={styles.createBtnText}>Criar Primeiro Anúncio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // --- LISTA ---
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={loadData} 
              colors={['#007AFF']}
            />
          }
        />
      )}
      
      <FloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#6C757D', marginTop: 4 },

  // List Styles
  listContent: { padding: 16, paddingBottom: 100 },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBody: { flexDirection: 'row', padding: 12 },
  image: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F1F3F5' },
  
  info: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#212529' },
  itemPrice: { fontSize: 16, fontWeight: '600', color: '#007AFF', marginTop: 2 },
  
  // Badge "Ativo"
  statusBadge: { 
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: '#E6FCF5', paddingHorizontal: 8, paddingVertical: 4, 
    borderRadius: 6 
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#20C997', marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#0CA678' },

  divider: { height: 1, backgroundColor: '#F1F3F5' },

  // Actions Styles
  actions: { flexDirection: 'row', height: 48 },
  actionBtn: { 
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 6 
  },
  editBtn: { borderBottomLeftRadius: 16 }, // Arredondar canto inferior esquerdo
  deleteBtn: { borderBottomRightRadius: 16 }, // Arredondar canto inferior direito
  
  editBtnText: { color: '#007AFF', fontWeight: '600', fontSize: 14 },
  deleteBtnText: { color: '#FF3B30', fontWeight: '600', fontSize: 14 },

  // Empty State Styles
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: -60 },
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