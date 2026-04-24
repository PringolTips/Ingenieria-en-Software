import { Activity, Eye, EyeOff, Lock, Mail } from 'lucide-react-native'; // Versión para móvil
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import handleLogin from '../logic/handleLogin';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    // KeyboardAvoidingView evita que el teclado tape los inputs al escribir
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Activity size={40} color="#1565C0" />
          <Text style={styles.title}>DIGICLIN</Text>
        </View>

        <Text style={styles.subtitle}>Gestión de Expedientes Clínicos</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="usuario@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#666" style={styles.icon} />
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleLogin(email, password)}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// En móvil usamos StyleSheet, que es como CSS pero en objetos de JS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 15, elevation: 5 }, // elevation es para sombras en Android
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1565C0', marginLeft: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50 },
  button: { backgroundColor: '#1565C0', height: 55, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});