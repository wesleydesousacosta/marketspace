import { useUser } from '@clerk/clerk-expo';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Imports do Banco
import { getItemById, toggleFavorite } from '@/src/db/actions';
import { Item } from '@/src/db/schema';

// Imports dos Componentes
import { ContactFooter } from '@/src/components/item-details/ContactFooter';
import { ItemContent } from '@/src/components/item-details/ItemContent';
import { ItemHero } from '@/src/components/item-details/ItemHero';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const insets = useSafeAreaInsets();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const itemId = id ? Number(Array.isArray(id) ? id[0] : id) : null;

  useEffect(() => {
    if (isLoaded && user && itemId) {
      loadData();
    }
  }, [itemId, isLoaded, user]);

  const loadData = async () => {
    if (!itemId || !user) return;
    setLoading(true);
    try {
      const data = await getItemById(itemId, user.id);
      if (data) {
        setItem(data);
        setIsFav(!!data.isFavorite);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFav = async () => {
    if (!item || !user) return;
    const newStatus = !isFav;
    setIsFav(newStatus);
    try {
      await toggleFavorite(item.id, user.id);
    } catch (e) {
      setIsFav(!newStatus);
    }
  };

  const handleContact = () => {
    if (!item?.whatsapp) return Alert.alert("Erro", "Sem WhatsApp cadastrado.");
    const phoneClean = item.whatsapp.replace(/\D/g, ''); 
    const message = `Olá! Vi seu anúncio "${item.title}" e tenho interesse.`;
    const url = `whatsapp://send?phone=55${phoneClean}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then(supported => {
      supported ? Linking.openURL(url) : Linking.openURL(`tel:${phoneClean}`);
    });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;

  if (!item) return (
    <View style={styles.center}>
      <Text style={{ marginBottom: 20 }}>Anúncio não encontrado.</Text>
      <TouchableOpacity onPress={() => router.back()}><Text style={{color: 'blue'}}>Voltar</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }} showsVerticalScrollIndicator={false}>
        
        <ItemHero 
          imageUri={item.image} 
          isFav={isFav} 
          onToggleFav={handleToggleFav} 
        />

        <ItemContent 
          title={item.title} 
          price={item.price} 
          description={item.description} 
        />

      </ScrollView>

      <ContactFooter onContact={handleContact} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
});