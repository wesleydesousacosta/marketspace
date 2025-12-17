import React, { useState } from 'react';
import { 
  ActivityIndicator, Alert, Image, StyleSheet, Text, 
  TextInput, TouchableOpacity, View, StatusBar, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router'; // Para controlar o Drawer
import { DrawerActions } from '@react-navigation/native'; // Ações do Drawer

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const navigation = useNavigation();

  // Puxa o whatsapp salvo nos metadados ou inicia vazio
  const [whatsapp, setWhatsapp] = useState(user?.unsafeMetadata?.whatsapp as string || '');
  const [isSaving, setIsSaving] = useState(false);

  // Formata o telefone enquanto digita
  const handlePhoneChange = (text: string) => {
    // Remove tudo que não é número
    let clean = text.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (clean.length > 11) clean = clean.substring(0, 11);
    
    let formatted = clean;
    if (clean.length > 2) {
      formatted = `(${clean.substring(0, 2)}) ${clean.substring(2)}`;
    }
    if (clean.length > 7) {
      formatted = `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
    }

    setWhatsapp(formatted);
  };

  const handleSaveProfile = async () => {
    if (!isLoaded || !user) return;

    // Validação simples
    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (whatsapp.length > 0 && cleanPhone.length < 10) {
      return Alert.alert("Atenção", "Digite um número de WhatsApp válido com DDD.");
    }

    setIsSaving(true);
    try {
      await user.update({
        unsafeMetadata: {
          whatsapp: whatsapp,
        },
      });
      
      Alert.alert("Sucesso", "Perfil atualizado! Seus próximos anúncios usarão este contato.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* --- HEADER COM MENU --- */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <Text style={styles.headerSubtitle}>Gerencie seus dados e conta</Text>
        </View>

        {/* Botão do Menu Lateral */}
        <TouchableOpacity 
          style={styles.menuBtn}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Seção de Avatar */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
              <View style={styles.editIconBadge}>
                <Ionicons name="pencil" size={14} color="white" />
              </View>
            </View>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
          </View>

          {/* Formulário */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
               <Ionicons name="settings-outline" size={20} color="#007AFF" />
               <Text style={styles.sectionTitle}>Preferências de Venda</Text>
            </View>
            
            <Text style={styles.label}>WhatsApp Padrão</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                value={whatsapp}
                onChangeText={handlePhoneChange}
                placeholder="(DD) 99999-9999"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
            <Text style={styles.helperText}>
              Este número será preenchido automaticamente quando você criar um novo anúncio.
            </Text>

            <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Botão de Sair */}
          <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: 20 },

  // --- Header Superior ---
  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E9ECEF',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 14, color: '#6C757D', marginTop: 2 },
  menuBtn: { padding: 8, backgroundColor: '#F8F9FA', borderRadius: 50, borderWidth: 1, borderColor: '#E9ECEF' },

  // --- Perfil Visual ---
  profileHeader: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: 'white' },
  editIconBadge: { 
    position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', 
    width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'white'
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  email: { fontSize: 14, color: '#6C757D' },

  // --- Card do Formulário ---
  sectionCard: { 
    backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 8 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 12, 
    paddingHorizontal: 16, height: 50, backgroundColor: '#F8F9FA' 
  },
  input: { flex: 1, fontSize: 16, color: '#212529' },
  helperText: { fontSize: 12, color: '#868E96', marginTop: 8, marginBottom: 20, lineHeight: 18 },
  
  saveBtn: { 
    backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 12, alignItems: 'center',
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3
  },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // --- Botão de Sair ---
  logoutBtn: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#FFF5F5', padding: 16, borderRadius: 12, gap: 8 
  },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 16 }
});