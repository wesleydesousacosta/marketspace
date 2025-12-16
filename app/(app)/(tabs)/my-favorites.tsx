import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getFavorites, toggleFavorite } from '../../../src/db/actions'; // Ajuste o caminho conforme sua estrutura
import { Item } from '../../../src/db/schema'; // Ajuste o caminho

export default function MyFavorites() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadFavorites = async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveFavorite = async (id: number) => {
    // Como está na tela de favoritos, o status atual é sempre TRUE
    await toggleFavorite(id, true);
    // Recarrega a lista para o item sumir
    loadFavorites();
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push(`/(app)/details/${item.id}`)}
    >
      {/* Imagem Pequena à Esquerda */}
      <Image source={{ uri: item.image }} style={styles.image} />
      
      {/* Informações no Centro */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>
          R$ {(item.price / 100).toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {item.description}
        </Text>
      </View>

      {/* Botão de Remover (Coração) à Direita */}
      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="heart" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <Text style={styles.subtitle}>{favorites.length} itens salvos</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="heart-dislike-outline" size={40} color="#ADB5BD" />
              </View>
              <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
              <Text style={styles.emptySub}>
                Explore o feed e salve os móveis que você mais gostar aqui.
              </Text>
              <TouchableOpacity 
                style={styles.goFeedBtn} 
                onPress={() => router.push('/(app)/(tabs)')}
              >
                <Text style={styles.goFeedText}>Explorar Agora</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#6C757D', marginTop: 4 },

  // Lista
  listContent: { padding: 16 },

  // Card Estilizado
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    // Sombra suave
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)'
  },
  image: {
    width: 80, height: 80, borderRadius: 12, backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    flex: 1, marginLeft: 16, justifyContent: 'center'
  },
  name: { fontSize: 16, fontWeight: '700', color: '#212529', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '700', color: '#007AFF', marginBottom: 2 },
  desc: { fontSize: 13, color: '#868E96' },

  removeBtn: {
    padding: 10,
    backgroundColor: '#FFF0F0', // Fundo vermelhinho claro
    borderRadius: 12,
  },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconBg: { 
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#E9ECEF', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 16 
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#343A40', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#868E96', textAlign: 'center', lineHeight: 22 },
  goFeedBtn: { 
    marginTop: 24, backgroundColor: '#007AFF', 
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 
  },
  goFeedText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});