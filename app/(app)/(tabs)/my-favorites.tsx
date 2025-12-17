import { useUser } from '@clerk/clerk-expo';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, View } from 'react-native';

// Actions e Schema
import { getFavorites, toggleFavorite } from '@/src/db/actions';
import { Item } from '@/src/db/schema';

// Novos Componentes Reutilizáveis
import { EmptyState } from '@/src/components/EmptyState';
import { FavoriteCard } from '@/src/components/FavoriteCard';
import { Header } from '@/src/components/Header';

export default function MyFavorites() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getFavorites(user.id);
      setFavorites(data);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [user])
  );

  const handleRemoveFavorite = async (id: number) => {
    if (!user) return;
    await toggleFavorite(id, user.id);
    setFavorites(current => current.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* Componente de Cabeçalho */}
      <Header 
        title="Meus Favoritos" 
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'item salvo' : 'itens salvos'}`}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          
          // Renderiza o Componente do Cartão
          renderItem={({ item }) => (
            <FavoriteCard 
              item={item} 
              onPress={() => router.push(`/(app)/details/${item.id}`)}
              onRemove={() => handleRemoveFavorite(item.id)}
            />
          )}
          
          // Renderiza o Componente de Estado Vazio
          ListEmptyComponent={
            <EmptyState 
              title="Sua lista está vazia"
              subtitle="Explore o feed e salve os móveis que você mais gostar aqui."
              iconName="heart-dislike-outline"
              actionLabel="Explorar Agora"
              onAction={() => router.push('/(app)/(tabs)')}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
});