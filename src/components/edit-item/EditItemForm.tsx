import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FormData {
  title: string;
  price: string;
  description: string;
}

interface EditItemFormProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export function EditItemForm({ data, onChange }: EditItemFormProps) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Informações</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Título</Text>
        <TextInput 
          style={styles.input} 
          value={data.title} 
          onChangeText={(t) => onChange('title', t)} 
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput 
          style={styles.input} 
          value={data.price} 
          onChangeText={(t) => onChange('price', t)} 
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={data.description} 
          onChangeText={(t) => onChange('description', t)} 
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 6, marginLeft: 4 },
  input: {
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 16, color: '#212529',
  },
  textArea: { minHeight: 100 },
});