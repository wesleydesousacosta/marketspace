import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';

import {
  FlatList, Image,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { getItems, toggleFavorite } from '../../../src/db/actions';
import { Item } from '../../../src/db/schema';

export default function FeedScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Estado da busca
  const router = useRouter();

  const loadData = async () => {
    // Aqui poderíamos buscar filtrado do banco, mas para MVP 
    // filtrar no front-end é super rápido e responsivo.
    const data = await getItems();
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Lógica de filtragem
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleToggleFav = async (id: number, currentStatus: boolean | null) => {
    await toggleFavorite(id, !!currentStatus);
    loadData();
  };

  // --- COMPONENTES VISUAIS ---

  // 2. Estado Vazio (Nenhum item encontrado)
  const EmptyList = () => (
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
        <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(app)/(tabs)/add')}>
           <Text style={styles.emptyBtnText}>Seja o primeiro a vender!</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => router.push(`/(app)/details/${item.id}`)} 
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      
      {/* Overlay gradiente ou simples para destacar o texto se necessário, mas aqui faremos clean */}
      
      <View style={styles.info}>
        <View style={styles.rowBetween}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.price}>R$ {(item.price / 100).toFixed(2).replace('.', ',')}</Text>
        </View>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      </View>

      <TouchableOpacity 
        style={styles.favBtn} 
        onPress={() => handleToggleFav(item.id, item.isFavorite)}
      >
        <Ionicons 
          name={item.isFavorite ? "heart" : "heart-outline"} 
          size={22} 
          color={item.isFavorite ? "#FF3B30" : "#1A1A1A"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Descubra</Text>
            <Text style={styles.subText}>Móveis únicos para sua casa</Text>
            
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="O que você procura?"
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && Platform.OS === 'android' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
          </View>} // Adiciona o topo rolável
        ListEmptyComponent={EmptyList}   // Adiciona o estado vazio
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData} 
            colors={['#007AFF']} 
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' }, // Cor de fundo mais moderna
  listContent: { padding: 16, paddingBottom: 100 },

  // --- Header Styles ---
  headerContainer: { marginBottom: 24, marginTop: 10 },
  welcomeText: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', letterSpacing: -1 },
  subText: { fontSize: 16, color: '#6C757D', marginBottom: 20 },
  
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12, paddingHorizontal: 16, height: 50,
    borderWidth: 1, borderColor: '#E9ECEF',
    // Sombra suave
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },

  // --- Card Styles ---
  card: { 
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

  // --- Empty State Styles ---
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