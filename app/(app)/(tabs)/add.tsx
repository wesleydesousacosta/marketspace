import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

// Serviços e Actions
import { convertImageToBase64 } from '@/src/services/convert-to-base64.service';
import { iaImageDescription } from '@/src/services/ia-image-description.service';
import { addItem } from '../../../src/db/actions';

// Novos Componentes
import { DescriptionInput } from '@/src/components/add-item/DescriptionInput';
import { ImagePickerSection } from '@/src/components/add-item/ImagePickerSection';
import { PriceInput } from '@/src/components/add-item/PriceInput';

export default function AddItemScreen() {
  const { user } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    whatsapp: (user?.unsafeMetadata?.whatsapp as string) || '',
  });

  useEffect(() => {
    if (user?.unsafeMetadata?.whatsapp) {
      setForm(prev => ({ ...prev, whatsapp: user.unsafeMetadata.whatsapp as string }));
    }
  }, [user]);

  // --- Lógica da IA ---
  const handleGenerateAIDescription = async () => {
    if (!form.image) return Alert.alert("Atenção", "Selecione uma imagem primeiro.");

    setAiLoading(true);
    try {
      const imageBase64 = await convertImageToBase64(form.image);
      const descriptionResponse = await iaImageDescription(imageBase64);
      setForm(prev => ({ ...prev, description: descriptionResponse }));
    } catch (error) {
      console.error("Erro na IA:", error);
      Alert.alert("Erro", "Não foi possível gerar a descrição com IA.");
    } finally {
      setAiLoading(false);
    }
  };

  // --- Lógica de Salvar ---
  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.image) {
      return Alert.alert("Atenção", "Preencha título, preço e imagem.");
    }
    if (!userId) return;

    setLoading(true);
    try {
      await addItem({
        title: form.title,
        price: Math.floor(parseFloat(form.price.replace(/\./g, '').replace(',', '.')) * 100),
        description: form.description || 'Sem descrição',
        image: form.image,
        id: 0,
        whatsapp: form.whatsapp,
        ownerId: userId,
      });
      Alert.alert("Sucesso", "Item anunciado!");
      setForm({ title: '', price: '', description: '', image: '', whatsapp: form.whatsapp });
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível salvar.");
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

        {/* Componente 1: Imagem */}
        <ImagePickerSection 
          imageUri={form.image}
          onImageSelected={(uri) => setForm({ ...form, image: uri })}
          onClearImage={() => setForm({ ...form, image: '' })}
        />

        {/* Campos Simples (Título) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título do Anúncio *</Text>
          <TextInput 
            style={styles.input} 
            value={form.title} 
            onChangeText={t => setForm({...form, title: t})} 
            placeholder="Ex: Mesa de Escritório"
          />
        </View>

        {/* Componente 2: Preço */}
        <PriceInput 
          value={form.price}
          onChangeText={(val) => setForm({ ...form, price: val })}
        />

        {/* Componente 3: Descrição + IA */}
        <DescriptionInput 
          value={form.description}
          onChangeText={(val) => setForm({ ...form, description: val })}
          onGenerateAI={handleGenerateAIDescription}
          isAiLoading={aiLoading}
          isAiEnabled={!!form.image}
        />

        {/* Botão Salvar */}
        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Publicar Agora</Text>
          )}
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#FFFFFF', flexGrow: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 24 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#343A40', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, padding: 16, fontSize: 16, color: '#212529' },
  submitBtn: { backgroundColor: '#007AFF', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitBtnDisabled: { backgroundColor: '#A0C4FF' },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});