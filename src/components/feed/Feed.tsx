import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FeedProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export function Feed({ searchQuery, onSearchChange }: FeedProps) {
  const insets = useSafeAreaInsets();

  return (
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="O que você procura?"
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
        {/* Botão limpar manual para Android */}
        {searchQuery.length > 0 && Platform.OS === 'android' && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { marginHorizontal: 24, paddingHorizontal: 4 }, // Pequeno ajuste lateral se necessário
  headerTopRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 16 
  },
  welcomeText: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', letterSpacing: -1 },
  subText: { fontSize: 16, color: '#6C757D' },
  menuBtn: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  searchBar: {
    margin: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12, paddingHorizontal: 16, height: 50,
    borderWidth: 1, borderColor: '#E9ECEF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
});