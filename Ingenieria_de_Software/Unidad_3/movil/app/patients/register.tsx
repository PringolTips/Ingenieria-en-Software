import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert, FlatList, KeyboardAvoidingView, Modal, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerPatientLogic } from '../../logic/handlePatients';

const SEX_DATA = ['Masculino', 'Femenino'];
const BLOOD_DATA = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CIVIL_DATA = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Separado'];

export default function RegisterPatient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: '', apPaterno: '', apMaterno: '', fechaNacimiento: new Date(),
    sexo: '', tipoSangre: '', curp: '', correo: '', telefono: '',
    ocupacion: '', estadoCivil: '', domicilio: '', contactoEmergencia: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async () => {
    if (!form.nombre || !form.curp) {
      Alert.alert("Error", "El nombre y la CURP son obligatorios.");
      return;
    }
    setLoading(true);
    const res = await registerPatientLogic(form);
    setLoading(false);
    if (res.ok) {
      Alert.alert("Éxito", "Paciente registrado", [{ text: "OK", onPress: () => router.back() }]);
    } else {
      Alert.alert("Error", res.mensaje);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1D70D1" /></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.headerTitle}>Registrar paciente</Text>
          <Text style={styles.headerSubtitle}>Completa los datos del nuevo paciente</Text>
        </View>
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerBtnText}>Registrar</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>— DATOS PERSONALES</Text>
          <InputBlock label="NOMBRE" placeholder="Nombre" onChange={(v:string) => setForm({...form, nombre:v})} />
          <View style={styles.row}>
            <InputBlock label="APELLIDO PATERNO" placeholder="Paterno" flex={1} onChange={(v:string) => setForm({...form, apPaterno:v})} />
            <View style={{width:10}}/>
            <InputBlock label="APELLIDO MATERNO" placeholder="Materno" flex={1} onChange={(v:string) => setForm({...form, apMaterno:v})} />
          </View>

          <Text style={styles.sectionTitle}>— INFORMACIÓN MÉDICA</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.inputGroup, {flex:1}]} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.label}>FECHA DE NACIMIENTO</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
                <Text style={styles.inputText}>{form.fechaNacimiento.toLocaleDateString('es-ES')}</Text>
              </View>
            </TouchableOpacity>
            <View style={{width:10}}/>
            <SelectBlock label="SEXO" data={SEX_DATA} flex={1} onSelect={(v:string) => setForm({...form, sexo:v})} value={form.sexo} />
          </View>
          {showDatePicker && (
            <DateTimePicker value={form.fechaNacimiento} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if(d) setForm({...form, fechaNacimiento:d}); }} />
          )}

          <View style={styles.row}>
            <SelectBlock label="TIPO DE SANGRE" data={BLOOD_DATA} flex={1} onSelect={(v:string) => setForm({...form, tipoSangre:v})} value={form.tipoSangre} />
            <View style={{width:10}}/>
            <InputBlock label="CURP" placeholder="18 caracteres" flex={1} maxLength={18} onChange={(v:string) => setForm({...form, curp:v})} />
          </View>

          <Text style={styles.sectionTitle}>— CONTACTO Y PERSONAL</Text>
          <InputBlock label="CORREO" placeholder="correo@ejemplo.com" onChange={(v:string) => setForm({...form, correo:v})} />
          <View style={styles.row}>
            <InputBlock label="TELÉFONO" placeholder="10 dígitos" flex={1} maxLength={10} keyboardType="numeric" onChange={(v:string) => setForm({...form, telefono:v})} />
            <View style={{width:10}}/>
            <InputBlock label="OCUPACIÓN" placeholder="Ocupación" flex={1} onChange={(v:string) => setForm({...form, ocupacion:v})} />
          </View>
          <SelectBlock label="ESTADO CIVIL" data={CIVIL_DATA} onSelect={(v:string) => setForm({...form, estadoCivil:v})} value={form.estadoCivil} />
          
          <Text style={styles.sectionTitle}>— DOMICILIO Y EMERGENCIA</Text>
          <InputBlock label="DOMICILIO" placeholder="Calle, número, colonia" onChange={(v:string) => setForm({...form, domicilio:v})} />
          <InputBlock label="CONTACTO EMERGENCIA" placeholder="Nombre y teléfono" onChange={(v:string) => setForm({...form, contactoEmergencia:v})} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Auxiliares
const InputBlock = ({ label, placeholder, flex=1, maxLength, keyboardType, onChange }: any) => (
  <View style={[styles.inputGroup, { flex }]}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}><TextInput placeholder={placeholder} style={styles.input} placeholderTextColor="#CBD5E1" maxLength={maxLength} keyboardType={keyboardType} onChangeText={onChange} /></View>
  </View>
);

const SelectBlock = ({ label, data, flex=1, onSelect, value }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={[styles.inputGroup, { flex }]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.inputWrapper} onPress={() => setVisible(true)}>
        <Text style={[styles.inputText, !value && { color: '#CBD5E1' }]}>{value || "Selecciona"}</Text>
        <Ionicons name="chevron-down" size={12} color="#64748B" />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBg} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList data={data} keyExtractor={(i) => i} renderItem={({item}) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item); setVisible(false); }}>
                <Text style={{textAlign:'center'}}>{item}</Text>
              </TouchableOpacity>
            )} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  headerSubtitle: { fontSize: 11, color: '#64748B' },
  registerBtn: { backgroundColor: '#1D70D1', padding: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
  registerBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  formScroll: { padding: 20 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#1D70D1', marginTop: 15, marginBottom: 10 },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 9, fontWeight: 'bold', color: '#475569', marginBottom: 5 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, height: 40 },
  input: { flex: 1, color: '#1E293B', fontSize: 11 },
  inputText: { flex: 1, color: '#1E293B', fontSize: 11 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '70%', backgroundColor: '#FFF', borderRadius: 12, padding: 10, maxHeight: '40%' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }
});