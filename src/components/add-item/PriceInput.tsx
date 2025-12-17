import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function PriceInput({ value, onChangeText }: PriceInputProps) {
  
  function formatPrice(inputValue: string) {
    const numericValue = inputValue.replace(/\D/g, '');
    const floatValue = Number(numericValue) / 100;
    return floatValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const handleChange = (text: string) => {
    onChangeText(formatPrice(text));
  };

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>Preço (R$)</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        keyboardType="numeric"
        placeholder="0,00"
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#343A40', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, padding: 16, fontSize: 16, color: '#212529' },
});