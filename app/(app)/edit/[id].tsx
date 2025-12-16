import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { getItemById, updateItem } from '../../../src/db/actions';

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
        // Garante que o preço venha formatado com 2 casas decimais
        price: (item.price / 100).toFixed(2).replace('.', ','), 
        description: item.description,
        image: item.image,
      });
    }
    setInitialLoading(false);
  };

   // Funções de Imagem (Reaproveitadas da tela de Add)
   const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setForm({ ...form, image: result.assets[0].uri });
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setForm({ ...form, image: result.assets[0].uri });
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      // Tratamento robusto para preço (aceita vírgula ou ponto)
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

  if (initialLoading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando informações...</Text>
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
        
        {/* Seção da Imagem */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Foto do Produto</Text>
          <View style={styles.imagePreviewWrapper}>
            <Image source={{ uri: form.image }} style={styles.imagePreview} />
            <View style={styles.imageOverlay}>
               <Text style={styles.imageOverlayText}>Imagem Atual</Text>
            </View>
          </View>
          
          <View style={styles.imageButtonsRow}>
             <TouchableOpacity style={styles.changeImageBtn} onPress={pickImage}>
               <Ionicons name="images-outline" size={18} color="#333" />
               <Text style={styles.changeImageText}>Trocar pela Galeria</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.changeImageBtn} onPress={takePhoto}>
               <Ionicons name="camera-outline" size={18} color="#333" />
               <Text style={styles.changeImageText}>Tirar Nova Foto</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput 
              style={styles.input} 
              value={form.title} 
              onChangeText={t => setForm({...form, title: t})} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preço (R$)</Text>
            <TextInput 
              style={styles.input} 
              value={form.price} 
              onChangeText={t => setForm({...form, price: t})} 
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={form.description} 
              onChangeText={t => setForm({...form, description: t})} 
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  
  // --- Estilos de Imagem ---
  imageSection: { marginBottom: 24 },
  imagePreviewWrapper: { position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  imagePreview: { width: '100%', height: 200, backgroundColor: '#F0F0F0' },
  imageOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, alignItems: 'center'
  },
  imageOverlayText: { color: 'white', fontSize: 12, fontWeight: '600' },
  imageButtonsRow: { flexDirection: 'row', gap: 10 },
  changeImageBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF',
    paddingVertical: 10, borderRadius: 8, gap: 6
  },
  changeImageText: { color: '#333', fontWeight: '500', fontSize: 13 },

  // --- Estilos de Formulário ---
  formSection: { marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  textArea: { minHeight: 100 },

  // --- Botão Salvar ---
  saveBtn: { 
    backgroundColor: '#007AFF', padding: 16, borderRadius: 12, 
    alignItems: 'center', marginTop: 10,
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3
  },
  saveBtnDisabled: { backgroundColor: '#99C2FF' },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});