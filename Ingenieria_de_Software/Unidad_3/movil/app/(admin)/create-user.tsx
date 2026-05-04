import React, { useState } from 'react';
import {
  ActivityIndicator, Alert,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { handleCreateUser } from '../../logic/handleCreateUser';

const COLORS = { primary: '#1976D2', border: '#E2E8F0', muted: '#64748B', bg: '#F8FAFC' };

export default function CreateUserScreen() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [form, setForm] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    nombre_rol: 'Enfermero',
    cedula: '',
    especialidad: ''
  });

  const roles = ['Admin', 'Médico', 'Enfermero'];

  const onCreate = async () => {
    if (!username || !form.nombres || !form.apellido_paterno) {
      Alert.alert("Campos obligatorios", "Por favor llena el nombre y el ID de usuario.");
      return;
    }

    const finalData = {
      ...form,
      nombre_usuario: username.trim(),
      correo: `${username.toLowerCase().trim()}@digiclin.com` // Dominio automático
    };

    const success = await handleCreateUser(finalData, setLoading);
    if (success) {
      Alert.alert("Éxito", "Usuario registrado. Contraseña temporal: 12345678");
      // Resetear campos
      setUsername('');
      setForm({ nombres: '', apellido_paterno: '', apellido_materno: '', nombre_rol: 'Enfermero', cedula: '', especialidad: '' });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.sectionTitle}>Datos Personales</Text>
      
      <Text style={styles.label}>Nombre(s) *</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Juan" 
        value={form.nombres}
        onChangeText={(v) => setForm({...form, nombres: v})} 
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Apellido Paterno *</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Pérez" 
            value={form.apellido_paterno}
            onChangeText={(v) => setForm({...form, apellido_paterno: v})} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Apellido Materno</Text>
          <TextInput 
            style={styles.input} 
            placeholder="García" 
            value={form.apellido_materno}
            onChangeText={(v) => setForm({...form, apellido_materno: v})} 
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Configuración de Cuenta</Text>

      <Text style={styles.label}>ID de Usuario (Username) *</Text>
      <View style={styles.inputWrapper}>
        <TextInput 
          style={{ flex: 1, fontSize: 16 }} 
          placeholder="ej. jperez" 
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Text style={styles.domain}>@digiclin.com</Text>
      </View>

      <Text style={styles.label}>Rol en el Sistema</Text>
      <View style={styles.roleGrid}>
        {roles.map((r) => (
          <TouchableOpacity 
            key={r} 
            style={[styles.roleBtn, form.nombre_rol === r && styles.roleBtnActive]}
            onPress={() => setForm({...form, nombre_rol: r})}
          >
            <Text style={[styles.roleBtnText, form.nombre_rol === r && { color: '#fff' }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CAMPOS CONDICIONALES POR ROL */}
      {form.nombre_rol !== 'Admin' && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Cédula Profesional</Text>
          <TextInput 
            style={styles.input} 
            placeholder="7-8 dígitos" 
            keyboardType="numeric"
            value={form.cedula}
            onChangeText={(v) => setForm({...form, cedula: v})} 
          />
        </View>
      )}

      {form.nombre_rol === 'Médico' && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Especialidad</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ej. Pediatría" 
            value={form.especialidad}
            onChangeText={(v) => setForm({...form, especialidad: v})} 
          />
        </View>
      )}

      <TouchableOpacity 
        style={[styles.mainBtn, loading && { opacity: 0.7 }]} 
        onPress={onCreate}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainBtnText}>Crear Acceso Seguro</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: COLORS.bg },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  label: { fontWeight: '700', fontSize: 14, marginBottom: 8, color: '#1E293B' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 15, height: 58 },
  domain: { color: COLORS.muted, fontWeight: 'bold' },
  roleGrid: { flexDirection: 'row', gap: 10, marginTop: 10 },
  roleBtn: { paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 25 },
  roleBtnActive: { backgroundColor: COLORS.primary },
  roleBtnText: { color: COLORS.primary, fontWeight: '600' },
  mainBtn: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 15, marginTop: 40, alignItems: 'center', elevation: 4 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});