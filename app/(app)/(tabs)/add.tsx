import { convertImageToBase64 } from '@/src/services/convert-to-base64.service';
import { iaImageDescription } from '@/src/services/ia-image-description.service';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert, Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { addItem } from '../../../src/db/actions';

// Pega a chave do arquivo .env
const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export default function AddItemScreen() {
  const { user } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // <--- Novo estado para o loading da IA
  
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    whatsapp: (user?.unsafeMetadata?.whatsapp as string) || '',
  });

  function formatPrice(value: string) {
  // Remove tudo que não for número
  const numericValue = value.replace(/\D/g, '');

  // Converte para centavos
  const floatValue = Number(numericValue) / 100;

  // Formata para pt-BR
  return floatValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


  useEffect(() => {
    if (user?.unsafeMetadata?.whatsapp) {
      setForm(prev => ({ ...prev, whatsapp: user.unsafeMetadata.whatsapp as string }));
    }
  }, [user]);

  // --- Funções de Imagem (Mantidas) ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setForm({ ...form, image: result.assets[0].uri });
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) return Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setForm({ ...form, image: result.assets[0].uri });
  };

  // --- NOVA FUNÇÃO: GERAR DESCRIÇÃO COM IA ---
  const generateAIDescription = async () => {
    if (!form.image) {
      Alert.alert("Atenção", "Selecione uma imagem primeiro para a IA analisar.");
      return;
    }

    setAiLoading(true);
    try {

      const imageBase64 = await convertImageToBase64(form.image);
      const descriptionResponse = await iaImageDescription(imageBase64);
      setForm({ ...form, description: descriptionResponse });

    } catch (error) {
      console.error("Erro na IA:", error);
      Alert.alert("Erro", "Não foi possível gerar a descrição com IA. Tente novamente.");
    } finally {
      setAiLoading(false);
    }
  };

  // --- Função de Salvar (Mantida) ---
  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.image || !form.whatsapp) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    if (!userId) return;
    setLoading(true);
    try {
      await addItem({
        title: form.title,
        price: Math.floor(parseFloat(form.price.replace(',', '.')) * 100),
        description: form.description || 'Sem descrição',
        image: form.image,
        ownerId: userId,
        isFavorite: false,
        whatsapp: form.whatsapp,
      });
      Alert.alert("Sucesso", "Item anunciado com sucesso!");
      setForm({ title: '', price: '', description: '', image: '', whatsapp: form.whatsapp });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível salvar o item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>O que você vai vender hoje?</Text>

        {/* Área de Seleção de Imagem */}
        <View style={styles.imageSection}>
          {form.image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: form.image }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setForm({...form, image: ''})}>
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={64} color="#ccc" />
              <Text style={styles.placeholderText}>Adicione uma foto do produto</Text>
            </View>
          )}

          <View style={styles.imageButtonsRow}>
            <TouchableOpacity style={styles.imageActionBtn} onPress={pickImage}>
              <Ionicons name="images" size={20} color="#007AFF" />
              <Text style={styles.imageActionText}>Galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageActionBtn} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#007AFF" />
              <Text style={styles.imageActionText}>Câmera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título do Anúncio *</Text>
          <TextInput 
            style={styles.input} 
            value={form.title} 
            onChangeText={t => setForm({...form, title: t})} 
            placeholder="Ex: Mesa de Escritório"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(text) =>
              setForm({
                ...form,
                price: formatPrice(text),
              })
            }
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor="#999"
          />
        </View>


        <View style={styles.formGroup}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Descrição</Text>
            
            {/* BOTÃO MÁGICO DA IA */}
            <TouchableOpacity 
              style={[styles.aiButton, (!form.image || aiLoading) && styles.aiButtonDisabled]} 
              onPress={generateAIDescription}
              disabled={!form.image || aiLoading}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.aiButtonText}>Gerar com IA</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={form.description} 
            onChangeText={t => setForm({...form, description: t})} 
            multiline
            textAlignVertical="top"
            placeholder="Conte detalhes sobre o estado de conservação..."
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Publicar Agora</Text>}
        </TouchableOpacity>

        <View style={{ height: 40 }} /> 
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#FFFFFF', flexGrow: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 24 },
  
  // Estilos da Imagem (Mantidos)
  imageSection: { marginBottom: 32, alignItems: 'center' },
  placeholderContainer: {
    width: '100%', height: 200, backgroundColor: '#F8F9FA', borderWidth: 2, borderColor: '#E9ECEF',
    borderStyle: 'dashed', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  placeholderText: { color: '#ADB5BD', marginTop: 8, fontWeight: '500' },
  imagePreviewContainer: { position: 'relative', width: '100%', marginBottom: 16 },
  imagePreview: { width: '100%', height: 250, borderRadius: 16 },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  imageButtonsRow: { flexDirection: 'row', gap: 12 },
  imageActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, gap: 8 },
  imageActionText: { color: '#007AFF', fontWeight: '600' },

  // Estilos do Formulário
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#343A40', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, padding: 16, fontSize: 16, color: '#212529' },
  textArea: { minHeight: 120 },

  // Estilos do Botão IA
  aiButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8A2BE2', // Cor roxa/mágica
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
  },
  aiButtonDisabled: { backgroundColor: '#C7A0E8' },
  aiButtonText: { color: '#FFF', fontWeight: '600', fontSize: 12 },

  // Botão Final
  submitBtn: { backgroundColor: '#007AFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitBtnDisabled: { backgroundColor: '#A0C4FF' },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});