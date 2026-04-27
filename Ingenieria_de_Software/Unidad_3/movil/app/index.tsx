// app/index.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Ajusta la ruta a '../../' si moviste el archivo a (tabs)
import handleLogin from '../logic/handleLogin';

// 1. DEFINIMOS COLORS (Para que no marque error en COLORS.muted)
const COLORS = {
  primary: '#1976D2',
  muted: '#A0AEC0',
  text: '#0F172A',
  border: '#E2E8F0'
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 2. DECLARAMOS EL ESTADO QUE FALTABA
  const [showPass, setShowPass] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.main}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>

          {/* LOGO DE ONDA (ECG) */}
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="pulse" size={70} color={COLORS.primary} />
            <Text style={styles.logoText}>DIGICLIN</Text>
            <Text style={styles.subText}>Gestión de Expedientes Clínicos</Text>
          </View>

          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color={COLORS.muted} />
            <TextInput
              placeholder="usuario@ejemplo.com"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={COLORS.muted}
              // Ahora sí detectará showPass
              secureTextEntry={!showPass} 
              style={styles.input}
              onChangeText={setPass} 
              value={pass}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {/* 3. ENVOLVEMOS EL ICONO EN BOTÓN PARA QUE FUNCIONE */}
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 5 }}>
                <Ionicons 
                  name={showPass ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color={COLORS.muted} 
                />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.btn} 
            onPress={() => handleLogin(email, pass, setLoading)}
          >
            <Text style={styles.btnText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE CARGA */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modal}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Cargando...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    padding: 30, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 20 
  },
  logoBox: { alignItems: 'center', marginBottom: 30 },
  logoText: { fontSize: 34, fontWeight: 'bold', color: '#1976D2' },
  subText: { color: '#64748B', fontSize: 16, textAlign: 'center' },
  label: { fontWeight: 'bold', fontSize: 16, marginTop: 15, marginBottom: 8 },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 55 
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#0F172A' },
  btn: { 
    backgroundColor: '#1976D2', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 30 
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modal: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loader: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center' }
});