import { getFavorites } from '@/src/db/actions';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Item = {
  id: number;
  title: string;
  price: number;
  isFavorite: boolean | null;
};

export default function MyFavorites() {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos ❤️</Text>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Você ainda não favoritou nenhum item.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.price}>R$ {item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});

