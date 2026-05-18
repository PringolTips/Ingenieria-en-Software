// app/records/create.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordService } from '../../services/recordService';

export default function CreateRecord() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id_paciente: Number(params.id_paciente),
    id_medico: 9, 
    id_diagnostico: 7, 
    motivo: '',
    antecedentes_personales: '',
    antecedentes_familiares: '',
    presion_arterial: '',
    frecuencia_cardiaca: '',
    frecuencia_respiratoria: '',
    temperatura: '',
    saturacion_oxigeno: '',
    peso: '',
    talla_cintura: '',
    altura: '',
    observaciones: ''
  });

  useEffect(() => {
    SecureStore.getItemAsync('idMedico').then((savedId) => {
      if (savedId) {
        setForm(prev => ({ ...prev, id_medico: Number(savedId) }));
        console.log(`[DevOps Security] Formulario enlazado al id_medico real: ${savedId}`);
      }
    });
  }, []);

  const parseDecimal = (val: string) => {
    if (!val || val.trim() === "") return null;
    const parsed = parseFloat(val.replace(',', '.'));
    return isNaN(parsed) ? null : parsed;
  };

  const handleSubmit = async () => {
    if (!form.motivo || form.motivo.trim() === "") {
      Alert.alert("Campo Requerido", "El motivo de la consulta es obligatorio.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id_paciente: form.id_paciente,
        id_medico: form.id_medico,
        id_diagnostico: form.id_diagnostico,
        fecha_consulta: new Date().toISOString().slice(0, 19).replace('T', ' '),
        motivo: form.motivo.trim(),
        antecedentes_personales: form.antecedentes_personales.trim() || null,
        antecedentes_familiares: form.antecedentes_familiares.trim() || null,
        presion_arterial: form.presion_arterial.trim() || null,
        frecuencia_cardiaca: parseDecimal(form.frecuencia_cardiaca),
        frecuencia_respiratoria: parseDecimal(form.frecuencia_respiratoria),
        temperatura: parseDecimal(form.temperatura),
        saturacion_oxigeno: parseDecimal(form.saturacion_oxigeno),
        peso: parseDecimal(form.peso),
        talla_cintura: parseDecimal(form.talla_cintura),
        altura: parseDecimal(form.altura),
        observaciones: form.observaciones.trim() || null
      };

      const res = await recordService.crearExpediente(payload);
      
      if (res && res.ok) {
        Alert.alert("Éxito", "Consulta médica guardada correctamente.");
        router.back();
      } else {
        Alert.alert("Validación Clínica", res?.mensaje || "El servidor rechazó los datos del formulario.");
      }
    } catch (error: any) {
      console.error("[DevOps Create Record Error]:", error?.response?.data || error);
      if (error.code === "ERR_NETWORK") {
        Alert.alert("Error de Conexión", "No se pudo establecer comunicación con el Backend.");
      } else if (error.response && error.response.data) {
        const errorDetail = error.response.data.mensaje || error.response.data.error || "Error de validación.";
        Alert.alert("Error del Servidor", `${errorDetail}`);
      } else {
        Alert.alert("Error Técnico", "Ocurrió una excepción inesperada al guardar la consulta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={24} color="#64748B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Consulta Médica</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.patientLabel}>PACIENTE: {params.nombre || 'Cargando...'}</Text>

        <Text style={styles.inputGroupTitle}>DATOS DE LA CONSULTA</Text>
        <TextInput style={styles.input} placeholder="Motivo de la consulta (Obligatorio)" placeholderTextColor="#94A3B8" value={form.motivo} onChangeText={(t)=>setForm({...form, motivo:t})}/>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Antecedentes Personales" placeholderTextColor="#94A3B8" value={form.antecedentes_personales} onChangeText={(t)=>setForm({...form, antecedentes_personales:t})}/>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Antecedentes Familiares" placeholderTextColor="#94A3B8" value={form.antecedentes_familiares} onChangeText={(t)=>setForm({...form, antecedentes_familiares:t})}/>

        <Text style={styles.inputGroupTitle}>SIGNOS VITALES / SOMATOMETRÍA</Text>
        
        {/* ⚡ PARCHE VISUAL: Se optimizó el fontSize y la altura de las celdas en el grid para evitar cortes */}
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="P. Arterial (120/80)" placeholderTextColor="#94A3B8" value={form.presion_arterial} onChangeText={(t)=>setForm({...form, presion_arterial:t})}/>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Frec. Cardíaca (bpm)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.frecuencia_cardiaca} onChangeText={(t)=>setForm({...form, frecuencia_cardiaca:t})}/>
        </View>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Frec. Respiratoria (rpm)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.frecuencia_respiratoria} onChangeText={(t)=>setForm({...form, frecuencia_respiratoria:t})}/>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Temperatura (°C)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.temperatura} onChangeText={(t)=>setForm({...form, temperatura:t})}/>
        </View>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Sat. Oxígeno (%)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.saturacion_oxigeno} onChangeText={(t)=>setForm({...form, saturacion_oxigeno:t})}/>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Peso (kg)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.peso} onChangeText={(t)=>setForm({...form, peso:t})}/>
        </View>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Talla Cinta (cm)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.talla_cintura} onChangeText={(t)=>setForm({...form, talla_cintura:t})}/>
          <TextInput style={[styles.input, styles.gridInput]} placeholder="Altura (m - ej 1.65)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.altura} onChangeText={(t)=>setForm({...form, altura:t})}/>
        </View>

        <Text style={styles.inputGroupTitle}>CONCLUSIONES</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Observaciones generales y tratamiento..." placeholderTextColor="#94A3B8" value={form.observaciones} onChangeText={(t)=>setForm({...form, observaciones:t})}/>

        {loading ? <ActivityIndicator size="large" color="#1D70D1" style={{marginTop: 20}}/> : (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Guardar Consulta</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  patientLabel: { fontSize: 15, fontWeight: 'bold', color: '#1D70D1', marginBottom: 20 },
  inputGroupTitle: { fontSize: 11, fontWeight: 'bold', color: '#64748B', letterSpacing: 1, marginTop: 15, marginBottom: 10 },
  input: { backgroundColor: '#FFF', paddingHorizontal: 15, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, fontSize: 14, color: '#1E293B' },
  gridInput: { height: 55, fontSize: 11.5, paddingHorizontal: 10 }, // ⚡ Ajuste ergonómico para columnas angostas
  textArea: { height: 95, paddingTop: 14, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  submitBtn: { backgroundColor: '#1D70D1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 25, marginBottom: 30 },
  submitBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' }
});