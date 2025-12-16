import { getFavorites } from '@/src/db/actions';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

type Item = {
  id: number;
  title: string;
  price: number;
  isFavorite: boolean;
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
