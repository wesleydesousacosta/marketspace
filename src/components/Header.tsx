import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MyItemsHeaderProps {
  title: string;
  subtitle: string | null;
}

export function Header({ title, subtitle }: MyItemsHeaderProps) {
  // Usamos insets para garantir que o header não cole na StatusBar
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (  
    <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>
          {subtitle}
        </Text>}
      </View>

      <TouchableOpacity 
        style={styles.menuBtn}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    // Sombras
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#6C757D', marginTop: 2 },
  menuBtn: {
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E9ECEF'
  },
});