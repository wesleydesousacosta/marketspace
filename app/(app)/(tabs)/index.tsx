import { useUser } from '@clerk/clerk-expo';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';

// Componentes Separados
import { EmptyFeed } from '@/src/components/feed/EmptyFeed';
import { Feed } from '@/src/components/feed/Feed';
import { FeedCard } from '@/src/components/feed/FeedCard';

// Database
import { Header } from '@/src/components/Header';
import { getItems, toggleFavorite } from '@/src/db/actions';
import { Item } from '@/src/db/schema';

// Tipo auxiliar
interface ListItem extends Item {
  isFavorite?: boolean | null;
}

export default function FeedScreen() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useUser();

  const loadData = async () => {
    const data = await getItems(user?.id);
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.id])
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [items, searchQuery]);

  const handleToggleFav = useCallback(async (id: number) => {
    if (!user) return;
    await toggleFavorite(id, user.id);
    loadData();
  }, [user]);

  const handleCardPress = useCallback((id: number) => {
    router.push(`/(app)/details/${id}`);
  }, [router]);

  return (
    <View >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        
        // Header Renderizado como componente
        ListHeaderComponent={
          <>
          <Header 
            title="Explorar Itens" 
            subtitle={null}
          />
          <Feed 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            />
          </>
        }
        
        // Empty State Renderizado como componente
        ListEmptyComponent={
          <EmptyFeed 
            searchQuery={searchQuery}
            onAddItem={() => router.push('/(app)/(tabs)/add')}
          />
        }
        
        // Card Renderizado como componente
        renderItem={({ item }) => (
          <FeedCard 
            item={item}
            onPress={handleCardPress}
            onToggleFav={handleToggleFav}
          />
        )}

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
  listContent: { paddingBottom: 100 },
});