import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native';

// Componentes Refatorados
import { EditItemForm } from '@/src/components/edit-item/EditItemForm';
import { EditItemImage } from '@/src/components/edit-item/EditItemImage';

// Database Actions
import { getItemById, updateItem } from '@/src/db/actions';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    if (!id) return;
    const item = await getItemById(Number(id));
    if (item) {
      setForm({
        title: item.title,
        price: (item.price / 100).toFixed(2).replace('.', ','), 
        description: item.description || '',
        image: item.image,
      });
    }
    setInitialLoading(false);
  };

  // --- Lógica de Imagem ---
  const handleImagePick = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return Alert.alert("Erro", "Permissão de câmera negada.");
    }

    const result = type === 'camera' 
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5 });

    if (!result.canceled) {
      setForm(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // --- Lógica de Update ---
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const formattedPrice = parseFloat(form.price.replace(',', '.'));
      
      if (isNaN(formattedPrice)) {
        Alert.alert("Erro", "Preço inválido.");
        setSaving(false);
        return;
      }

      await updateItem(Number(id), {
        title: form.title,
        price: Math.floor(formattedPrice * 100),
        description: form.description,
        image: form.image,
      });
      
      Alert.alert("Sucesso", "Anúncio atualizado!");
      router.back();
    } catch (e) {
      Alert.alert("Erro", "Falha ao atualizar o item.");
    } finally {
      setSaving(false);
    }
  };

  // Helper para atualizar o form
  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (initialLoading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#FFF' }}
    >
      <Stack.Screen options={{ title: 'Editar Anúncio', headerShadowVisible: false }} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Componente de Imagem */}
        <EditItemImage 
          imageUri={form.image} 
          onPickImage={() => handleImagePick('library')} 
          onTakePhoto={() => handleImagePick('camera')} 
        />

        {/* Componente de Formulário */}
        <EditItemForm 
          data={form} 
          onChange={handleFormChange} 
        />

        {/* Botão de Salvar (Mantido na tela principal pois dispara a ação final) */}
        <TouchableOpacity 
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]} 
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  saveBtn: { 
    backgroundColor: '#007AFF', padding: 16, borderRadius: 12, 
    alignItems: 'center', marginTop: 10,
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3
  },
  saveBtnDisabled: { backgroundColor: '#99C2FF' },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});