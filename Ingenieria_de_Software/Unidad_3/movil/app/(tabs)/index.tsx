import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
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
// Ruta corregida para subir dos niveles desde (tabs)
import handleLogin from '../../logic/handleLogin';

// Colores extraídos del código web (Estilo Shadcn/Tailwind)
const COLORS = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  white: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  bg: '#F8FAFC'
};

export default function LoginWebStyle() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} bounces={false} keyboardShouldPersistTaps="handled">
        
        {/* PARTE SUPERIOR: Branding con degradado premium */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.header}
        >
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="pulse" size={45} color={COLORS.primary} />
          </View>
          <Text style={styles.brandTitle}>DIGICLIN</Text>
          <Text style={styles.brandSub}>Sistema de Gestión Clínica</Text>
          
          <View style={styles.webInfoBox}>
             <View style={styles.infoLine}>
                <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.infoText}>Protección de datos nivel hospitalario</Text>
             </View>
          </View>
        </LinearGradient>

        {/* PARTE INFERIOR: Formulario con efecto de tarjeta superpuesta */}
        <View style={styles.formContainer}>
          <Text style={styles.loginTitle}>Iniciar sesión</Text>
          <Text style={styles.loginSub}>Accede de forma segura a la gestión de pacientes y expedientes.</Text>

          {/* INPUT: CORREO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.muted} style={styles.inputIcon} />
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
          </View>

          {/* INPUT: CONTRASEÑA CON OJO FUNCIONAL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} style={styles.inputIcon} />
              <TextInput 
                placeholder="••••••••" 
                placeholderTextColor={COLORS.muted}
                secureTextEntry={!showPass} // Cambia según el estado
                style={styles.input}
                onChangeText={setPass}
                value={pass} // Componente controlado para que el ojo reaccione
                autoCorrect={false}
              />
              <TouchableOpacity 
                onPress={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={showPass ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color={COLORS.muted} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* BOTÓN DE ACCIÓN */}
          <TouchableOpacity 
            style={styles.submitBtn}
            onPress={() => handleLogin(email, pass, setLoading)}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Ingresar</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>v1.0.0 · DIGICLIN ITQ</Text>
        </View>

      </ScrollView>

      {/* MODAL DE CARGA (UX) */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Iniciando sesión...</Text>
            <Text style={{fontSize: 10, color: COLORS.muted, marginTop: 5}}>AWS Cloud Sync</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1 },
  header: { 
    height: 340, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 30 
  },
  logoBadge: { 
    width: 80, height: 80, backgroundColor: COLORS.white, 
    borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
  },
  brandTitle: { fontSize: 34, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
  brandSub: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 2 },
  webInfoBox: { 
    marginTop: 25, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 20 
  },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { color: COLORS.white, fontSize: 12, fontWeight: '500' },

  formContainer: { 
    flex: 1, 
    backgroundColor: COLORS.bg, 
    marginTop: -40, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    paddingHorizontal: 30,
    paddingTop: 35
  },
  loginTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  loginSub: { fontSize: 14, color: COLORS.muted, marginBottom: 30, lineHeight: 20 },
  
  inputGroup: { marginBottom: 22 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, 
    borderRadius: 14, paddingHorizontal: 15, height: 58 
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.text, height: '100%' },
  eyeBtn: { padding: 8 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 30 },
  forgotText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },

  submitBtn: { 
    backgroundColor: COLORS.primary, height: 58, borderRadius: 14, 
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6
  },
  submitBtnText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  versionText: { textAlign: 'center', color: COLORS.muted, marginTop: 40, fontSize: 12, marginBottom: 20 },

  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center' },
  loaderCard: { backgroundColor: COLORS.white, padding: 35, borderRadius: 25, alignItems: 'center', width: '75%' },
  loaderText: { marginTop: 15, fontWeight: '700', color: COLORS.text, fontSize: 16 }
});