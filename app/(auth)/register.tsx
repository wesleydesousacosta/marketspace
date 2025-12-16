import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- LÓGICA (Mantida igual, apenas com ajustes de feedback) ---

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    
    if (!form.email || !form.password || !form.confirmPassword) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      // Tratamento básico de erro do Clerk
      const errorMessage = err.errors?.[0]?.message || "Ocorreu um erro ao criar a conta.";
      Alert.alert("Erro no cadastro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded || !code) return;
    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        // O redirecionamento ocorre automaticamente pelo _layout
      } else {
        Alert.alert("Erro", "Verificação incompleta. Verifique o código.");
      }
    } catch (err: any) {
      Alert.alert("Erro", err.errors?.[0]?.message || "Código inválido");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERIZAÇÃO ---

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>
             {pendingVerification ? "Verificar E-mail" : "Criar Conta"}
          </Text>
          <Text style={styles.subtitle}>
            {pendingVerification 
              ? `Enviamos um código para ${form.email}` 
              : "Preencha seus dados para começar a vender"}
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          
          {pendingVerification ? (
            // --- TELA DE CÓDIGO (OTP) ---
            <View>
                <View style={styles.otpContainer}>
                    <Ionicons name="shield-checkmark-outline" size={64} color="#007AFF" style={{marginBottom: 20}} />
                    <View style={styles.inputContainer}>
                        <Ionicons name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                        style={styles.input}
                        value={code}
                        placeholder="Digite o código de 6 dígitos"
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        placeholderTextColor="#999"
                        maxLength={6}
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.btnPrimary} 
                    onPress={onPressVerify}
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                    ) : (
                    <Text style={styles.btnText}>Verificar Código</Text>
                    )}
                </TouchableOpacity>
            </View>

          ) : (
            // --- TELA DE CADASTRO ---
            <View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu melhor e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(t) => setForm({ ...form, email: t })}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha (mín. 8 caracteres)"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(t) => setForm({ ...form, password: t })}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme sua senha"
                  secureTextEntry
                  value={form.confirmPassword}
                  onChangeText={(t) => setForm({ ...form, confirmPassword: t })}
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity 
                style={styles.btnPrimary} 
                onPress={onSignUpPress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnText}>Cadastrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerLink}>
                <Text style={styles.footerText}>Já possui uma conta? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.linkText}>Faça Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  
  // Header
  header: { marginBottom: 32 },
  backBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 22 },

  // Form Styles
  form: { width: '100%' },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    borderWidth: 1, borderColor: '#E9ECEF',
    marginBottom: 16, 
    paddingHorizontal: 16, height: 56
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },

  // Botão Principal
  btnPrimary: { 
    backgroundColor: '#007AFF', 
    height: 56, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // Link de Rodapé
  footerLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#007AFF', fontWeight: 'bold', fontSize: 15 },

  // Estilos específicos da área de OTP
  otpContainer: { alignItems: 'center', marginBottom: 20 },
});