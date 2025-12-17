import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DescriptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onGenerateAI: () => void;
  isAiLoading: boolean;
  isAiEnabled: boolean; // Só habilita se tiver imagem
}

export function DescriptionInput({ value, onChangeText, onGenerateAI, isAiLoading, isAiEnabled }: DescriptionInputProps) {
  return (
    <View style={styles.formGroup}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={[styles.label, { marginBottom: 0 }]}>Descrição</Text>
        
        <TouchableOpacity 
          style={[styles.aiButton, (!isAiEnabled || isAiLoading) && styles.aiButtonDisabled]} 
          onPress={onGenerateAI}
          disabled={!isAiEnabled || isAiLoading}
        >
          {isAiLoading ? (
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
        value={value} 
        onChangeText={onChangeText} 
        multiline
        textAlignVertical="top"
        placeholder="Conte detalhes sobre o estado de conservação..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#343A40', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, padding: 16, fontSize: 16, color: '#212529' },
  textArea: { minHeight: 120 },
  aiButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8A2BE2',
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
  },
  aiButtonDisabled: { backgroundColor: '#C7A0E8' },
  aiButtonText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
});