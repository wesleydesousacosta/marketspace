import { useAuth } from '@clerk/clerk-expo';
import { DrawerActions } from '@react-navigation/native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';

// Database e Types
import { deleteItem, getMyItems } from '@/src/db/actions';
import { Item } from '@/src/db/schema';

// Componentes Refatorados
import { FloatingButton } from '@/src/components/FloatingButton';
import { EmptyList } from '@/src/components/my-items/EmptyList';
import { MyItemCard } from '@/src/components/my-items/MyItemCard';
import { MyItemsHeader } from '@/src/components/my-items/MyItemsHeader';

export default function MyItemsScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!userId) return;
    setRefreshing(true); // Opcional: ativar loading visual no pull-to-refresh
    const data = await getMyItems(userId);
    setItems(data);
    setRefreshing(false);
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

  const handleEdit = (id: number) => {
    router.push(`/(app)/edit/${id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <MyItemsHeader 
        itemCount={items.length} 
        onOpenDrawer={() => navigation.dispatch(DrawerActions.openDrawer())} 
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        
        // Renderiza a lista vazia se não houver itens
        ListEmptyComponent={() => (
          <EmptyList onCreate={() => router.push('/(app)/(tabs)/add')} />
        )}
        
        renderItem={({ item }) => (
          <MyItemCard 
            item={item} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
        
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData} 
            colors={['#007AFF']}
          />
        }
      />
      
      <FloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContent: { padding: 16, paddingBottom: 100, flexGrow: 1 },
});