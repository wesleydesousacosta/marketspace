import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
      "Excluir Item",
      "Tem certeza que deseja remover este anúncio?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            await deleteItem(id);
            loadData(); // Recarrega a lista após excluir
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>R$ {(item.price / 100).toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, styles.editBtn]} 
          onPress={() => router.push(`/(app)/edit/${item.id}`)}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, styles.deleteBtn]} 
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Você ainda não tem anúncios.</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/(app)/(tabs)/add')}>
            <Text style={styles.createBtnText}>Criar Anúncio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 16, padding: 12, elevation: 2 },
  row: { flexDirection: 'row', marginBottom: 12 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#ddd' },
  info: { marginLeft: 12, flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 15, color: '#007AFF', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  btn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 6, marginHorizontal: 4 },
  editBtn: { backgroundColor: '#007AFF' },
  deleteBtn: { backgroundColor: '#FF3B30' },
  btnText: { color: 'white', fontWeight: 'bold', marginLeft: 6 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666', marginBottom: 20 },
  createBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  createBtnText: { color: 'white', fontWeight: 'bold' },
});