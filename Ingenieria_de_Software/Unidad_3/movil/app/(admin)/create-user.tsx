// app/(admin)/create-user.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { handleCreateUser } from '../../logic/handleCreateUser';

const ESPECIALIDADES = ['Medicina General', 'Pediatría', 'Cardiología'];

export default function CreateUserScreen() {
  const [loading, setLoading] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [form, setForm] = useState({ 
    username: '', 
    emailPrefix: '', 
    nombre_rol: '',
    cedula: '',
    especialidad: 'Medicina General'
  });

  const handleCreate = async () => {
    if (!form.username || !form.emailPrefix || !form.nombre_rol) {
      Alert.alert("Atención", "Todos los campos obligatorios deben ser llenados.");
      return;
    }

    if (form.nombre_rol === 'Medico' && !form.cedula) {
      Alert.alert("Campos médicos requeridos", "La cédula profesional es obligatoria para el rol de Médico.");
      return;
    }

    const finalEmail = `${form.emailPrefix.trim()}@digiclin.com`;
    
    // Construcción del payload dinámico adaptado a tus esquemas JSON
    const payload: any = {
      nombre_usuario: form.username.trim(),
      correo: finalEmail,
      nombre_rol: form.nombre_rol,
      nombres: "Personal",
      apellido_paterno: "Digiclin"
    };

    if (form.nombre_rol === 'Medico') {
      payload.cedula = form.cedula.trim();
      payload.nombre_especialidad = form.especialidad;
    }

    const success = await handleCreateUser(payload, setLoading);

    if (success) {
      Alert.alert("Éxito", "Usuario creado correctamente en el sistema");
      setForm({ username: '', emailPrefix: '', nombre_rol: '', cedula: '', especialidad: 'Medicina General' });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
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

      {/* ⚡ BLOQUE FORMULARIO ADAPTATIVO: Solo se muestra si el rol seleccionado es Medico */}
      {form.nombre_rol === 'Medico' && (
        <View style={styles.medicoBox}>
          <Text style={styles.label}>Cédula Profesional</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ej. ABC12375" 
            onChangeText={(v) => setForm({...form, cedula: v})} 
            value={form.cedula} 
          />

          <Text style={styles.label}>Especialidad Médica</Text>
          <TouchableOpacity style={styles.selectWrapper} onPress={() => setShowSpecModal(true)}>
            <Text style={styles.selectText}>{form.especialidad}</Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Registrar Personal</Text>}
      </TouchableOpacity>

      {/* Modal para selección de especialidades de catálogo fijo */}
      <Modal visible={showSpecModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowSpecModal(false)}>
          <View style={styles.modalContent}>
            <FlatList 
              data={ESPECIALIDADES} 
              keyExtractor={(item) => item} 
              renderItem={({item}) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => { setForm({...form, especialidad: item}); setShowSpecModal(false); }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 25 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#64748B', marginTop: 15, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, backgroundColor: '#F8FAFC', fontSize: 14 },
  emailRow: { flexDirection: 'row', height: 50, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  emailInput: { flex: 1, paddingHorizontal: 15, backgroundColor: '#F8FAFC' },
  suffix: { backgroundColor: '#F1F5F9', justifyContent: 'center', paddingHorizontal: 12, borderLeftWidth: 1, borderLeftColor: '#E2E8F0' },
  suffixText: { color: '#64748B', fontWeight: 'bold', fontSize: 12 },
  roleContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
  roleBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1976D2', alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#1976D2' },
  roleText: { color: '#1976D2', fontWeight: 'bold', fontSize: 12 },
  medicoBox: { marginTop: 10, padding: 15, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  selectWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  selectText: { fontSize: 14, color: '#1E293B', fontWeight: '600' },
  submitBtn: { backgroundColor: '#1976D2', padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 16, padding: 10, maxHeight: '30%' },
  modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalItemText: { textAlign: 'center', fontSize: 15, color: '#1E293B', fontWeight: '500' }
});