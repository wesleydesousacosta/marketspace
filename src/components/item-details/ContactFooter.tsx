import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ContactFooterProps {
  onContact: () => void;
}

export function ContactFooter({ onContact }: ContactFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footerAction, { paddingBottom: 16 + insets.bottom }]}>
      <TouchableOpacity style={styles.contactBtn} onPress={onContact}>
        <Ionicons name="logo-whatsapp" size={24} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.contactBtnText}>Tenho Interesse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerAction: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    paddingTop: 16, paddingHorizontal: 24,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 20
  },
  contactBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 16, borderRadius: 16,
    shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  contactBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});