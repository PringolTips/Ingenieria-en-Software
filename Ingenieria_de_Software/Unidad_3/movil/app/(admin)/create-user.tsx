import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { handleCreateUser } from '../../logic/handleCreateUser';

export default function CreateUserScreen() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', emailPrefix: '', nombre_rol: '' });

  const handleCreate = async () => {
    if (!form.username || !form.emailPrefix || !form.nombre_rol) {
      Alert.alert("Atención", "Todos los campos son obligatorios.");
      return;
    }
    const finalEmail = `${form.emailPrefix.trim()}@digiclin.com`;
    const success = await handleCreateUser({
      nombre_usuario: form.username,
      correo: finalEmail,
      nombre_rol: form.nombre_rol,
      nombres: "Personal",
      apellido_paterno: "Digiclin"
    }, setLoading);

    if (success) {
      Alert.alert("Éxito", "Usuario creado correctamente");
      setForm({ username: '', emailPrefix: '', nombre_rol: '' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar nuevo usuario</Text>
      
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput 
        style={styles.input} 
        placeholder="ej. dr.ramirez" 
        onChangeText={(v) => setForm({...form, username: v})} 
        value={form.username} 
      />

      <Text style={styles.label}>Correo institucional</Text>
      <View style={styles.emailRow}>
        <TextInput 
          style={styles.emailInput} 
          placeholder="nombre.apellido"
          onChangeText={(v) => setForm({...form, emailPrefix: v})}
          value={form.emailPrefix}
          autoCapitalize="none"
        />
        <View style={styles.suffix}><Text style={styles.suffixText}>@digiclin.com</Text></View>
      </View>

      <Text style={styles.label}>Asignar Rol</Text>
      <View style={styles.roleContainer}>
        {['Admin', 'Medico', 'Enfermero'].map((r) => (
          <TouchableOpacity 
            key={r} 
            style={[styles.roleBtn, form.nombre_rol === r && styles.roleBtnActive]} 
            onPress={() => setForm({...form, nombre_rol: r})}
          >
            <Text style={[styles.roleText, form.nombre_rol === r && { color: '#FFF' }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Registrar Personal</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 25 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#64748B', marginTop: 15, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, backgroundColor: '#F8FAFC' },
  emailRow: { flexDirection: 'row', height: 50, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  emailInput: { flex: 1, paddingHorizontal: 15, backgroundColor: '#F8FAFC' },
  suffix: { backgroundColor: '#F1F5F9', justifyContent: 'center', paddingHorizontal: 12, borderLeftWidth: 1, borderLeftColor: '#E2E8F0' },
  suffixText: { color: '#64748B', fontWeight: 'bold', fontSize: 12 },
  roleContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
  roleBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1976D2', alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#1976D2' },
  roleText: { color: '#1976D2', fontWeight: 'bold', fontSize: 12 },
  submitBtn: { backgroundColor: '#1976D2', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold' }
});