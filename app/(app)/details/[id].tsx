import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, 
  TouchableOpacity, Linking, Alert, Platform, StatusBar 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getItemById, toggleFavorite } from '../../../src/db/actions';
import { Item } from '../../../src/db/schema';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (id) {
      const data = await getItemById(Number(id));
      if (data) {
        setItem(data);
        setIsFav(data.isFavorite || false);
      }
      setLoading(false);
    }
  };

  const handleToggleFav = async () => {
    if (!item) return;
    try {
      await toggleFavorite(item.id, isFav);
      setIsFav(!isFav);
    } catch (e) {
      console.error("Erro ao favoritar", e);
    }
  };

  // --- AQUI ESTA A MÁGICA DO WHATSAPP ---
  const handleContact = () => {
    if (!item?.whatsapp) {
      Alert.alert("Ops", "Este vendedor não cadastrou um número de contato.");
      return;
    }

    // 1. Limpa o número (remove parênteses, traços e espaços)
    const phoneClean = item.whatsapp.replace(/\D/g, ''); 
    
    // 2. Mensagem personalizada
    const message = `Olá! Vi seu anúncio "${item.title}" no App de Móveis e tenho interesse.`;

    // 3. Monta a URL (Código 55 é Brasil, ajuste se precisar internacionalizar)
    const whatsappUrl = `whatsapp://send?phone=55${phoneClean}&text=${encodeURIComponent(message)}`;

    // 4. Tenta abrir
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        // Fallback: Se não tiver WhatsApp, tenta abrir o discador normal
        Alert.alert(
          "WhatsApp não instalado", 
          "Deseja ligar para o vendedor?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Ligar", onPress: () => Linking.openURL(`tel:${phoneClean}`) }
          ]
        );
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Item não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnSimple}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Imagem */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          
          <TouchableOpacity style={styles.headerBtnBack} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerBtnFav} onPress={handleToggleFav}>
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={24} 
              color={isFav ? "#FF3B30" : "#333"} 
            />
          </TouchableOpacity>
        </View>

        {/* Detalhes */}
        <View style={styles.detailsContainer}>
          <View style={styles.handleBar} />
          
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              {/* Mostramos o contato visualmente também, gera confiança */}
              <View style={styles.sellerInfo}>
                 <Ionicons name="person-circle-outline" size={18} color="#666" />
                 <Text style={styles.sellerText}>Vendedor verificado</Text>
              </View>
            </View>
            <Text style={styles.price}>R$ {(item.price / 100).toFixed(2).replace('.', ',')}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ScrollView>

      {/* Botão Flutuante de Contato */}
      <View style={styles.footerAction}>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContact}>
          <Ionicons name="logo-whatsapp" size={22} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.contactBtnText}>Conversar no WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#666', marginBottom: 20 },
  backBtnSimple: { padding: 10 },

  imageContainer: { width: '100%', height: 350, position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: '#ddd' },
  
  headerBtnBack: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', elevation: 4
  },
  headerBtnFav: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', elevation: 4
  },

  detailsContainer: {
    flex: 1, backgroundColor: 'white',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -30, padding: 24, minHeight: 500,
  },
  handleBar: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', lineHeight: 30, marginBottom: 4 },
  price: { fontSize: 22, fontWeight: '600', color: '#007AFF' },
  
  sellerInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  sellerText: { color: '#666', fontSize: 14, marginLeft: 4 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 26, color: '#555' },

  footerAction: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'white', paddingVertical: 16, paddingHorizontal: 24,
    borderTopWidth: 1, borderTopColor: '#F0F0F0', elevation: 10
  },
  contactBtn: {
    backgroundColor: '#25D366', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 16, borderRadius: 16, elevation: 4
  },
  contactBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});