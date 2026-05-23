// app/records/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordService } from '../../services/recordService';

export default function RecordDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // ⚡ MODO EDICIÓN TOTAL: Control de estados clínicos e indicadores fisiológicos
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
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

  const fetchDetail = async () => {
    try {
      const res = await recordService.obtenerAbiertos();
      if (res.ok) {
        const found = res.data.find((e: any) => e.id_expediente === Number(id));
        setRecord(found);
        if (found) {
          setForm({
            motivo: found.motivo || '',
            antecedentes_personales: found.antecedentes_personales || '',
            antecedentes_familiares: found.antecedentes_familiares || '',
            presion_arterial: found.presion_arterial || '',
            frecuencia_cardiaca: found.frecuencia_cardiaca ? String(found.frecuencia_cardiaca) : '',
            frecuencia_respiratoria: found.frecuencia_respiratoria ? String(found.frecuencia_respiratoria) : '',
            temperatura: found.temperatura ? String(found.temperatura) : '',
            saturacion_oxigeno: found.saturacion_oxigeno ? String(found.saturacion_oxigeno) : '',
            peso: found.peso ? String(found.peso) : '',
            talla_cintura: found.talla_cintura ? String(found.talla_cintura) : '',
            altura: found.altura ? String(found.altura) : '',
            observaciones: found.observaciones || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  const parseDecimal = (val: string) => {
    if (!val || val.trim() === "") return null;
    const parsed = parseFloat(val.replace(',', '.'));
    return isNaN(parsed) ? null : parsed;
  };

  const handleUpdate = async () => {
    if (!form.motivo.trim()) {
      Alert.alert("Campo Obligatorio", "El motivo de la consulta no puede quedar vacío.");
      return;
    }

    setSaving(true);
    try {
      // Mapeo contractual completo sanitizado a null real para no romper tipos SQL
      const payload = {
        id_paciente: record.id_paciente,
        id_medico: record.id_medico,
        id_diagnostico: record.id_diagnostico,
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

      const res = await recordService.actualizarExpediente(record.id_expediente, payload);
      if (res.ok) {
        Alert.alert("Éxito", "Historial clínico modificado correctamente.");
        setIsEditing(false);
        fetchDetail();
      }
    } catch (error: any) {
      // ⚡ DETECTOR EXPRESIVO DE CAÍDAS DE RED / SQL
      const serverMsg = error.response?.data?.mensaje || error.response?.data?.error;
      Alert.alert("Error de Modificación", serverMsg || "Fallo de sintaxis numérica o pérdida de enlace con el túnel.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1D70D1" /></View>;
  if (!record) return <View style={styles.center}><Text>No se hallaron registros.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1D70D1" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? "Modificando Historial" : `Consulta #${record.id_expediente}`}</Text>
        <TouchableOpacity style={styles.editBtnTop} onPress={() => setIsEditing(!isEditing)}>
          <Text style={[styles.editBtnTopText, isEditing && {color: '#64748B'}]}>{isEditing ? "Cancelar" : "Modificar"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* IDENTIFICACIÓN ESTÁTICA PROTEGIDA */}
        <Text style={styles.groupTitle}>IDENTIFICACIÓN (BLOQUEADA)</Text>
        <View style={styles.blockCardLocked}>
          <Text style={styles.label}>PACIENTE</Text>
          <Text style={styles.value}>{record.nombre_paciente}</Text>
          <Text style={styles.subText}>CURP: {record.curp}  |  Tel: {record.telefono_paciente}</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>MÉDICO TRATANTE</Text>
          <Text style={styles.value}>{record.nombre_medico}</Text>
        </View>

        {/* CONTENIDO MUTABLE SEGÚN MODO EDICIÓN */}
        {!isEditing ? (
          <>
            <Text style={styles.groupTitle}>DIAGNÓSTICO CIE-10</Text>
            <View style={styles.blockCard}>
              <View style={styles.cieRow}>
                <Text style={styles.cieBadge}>{record.codigo_cie}</Text>
                <Text style={styles.value}>{record.diagnostico}</Text>
              </View>
              <Text style={styles.subText}>{record.descripcion_diagnostico}</Text>
            </View>

            <Text style={styles.groupTitle}>DETALLES DE CONSULTA</Text>
            <View style={styles.blockCard}>
              <Text style={styles.label}>MOTIVO DE LA VISITA</Text>
              <Text style={styles.textData}>{record.motivo}</Text>
              <Text style={styles.label}>ANTECEDENTES PERSONALES</Text>
              <Text style={styles.textData}>{record.antecedentes_personales || 'Ninguno'}</Text>
              <Text style={styles.label}>ANTECEDENTES FAMILIARES</Text>
              <Text style={styles.textData}>{record.antecedentes_familiares || 'Ninguno'}</Text>
            </View>

            <Text style={styles.groupTitle}>SIGNOS VITALES y SOMATOMETRÍA</Text>
            <View style={styles.grid}>
              <VitalCard icon="pulse" label="Presión Arterial" value={record.presion_arterial} unit="mmHg" />
              <VitalCard icon="heart" label="Frec. Cardíaca" value={record.frecuencia_cardiaca} unit="bpm" />
              <VitalCard icon="body" label="Frec. Respiratoria" value={record.frecuencia_respiratoria} unit="rpm" />
              <VitalCard icon="thermometer" label="Temperatura" value={record.temperatura} unit="°C" />
              <VitalCard icon="water" label="Saturación O2" value={record.saturacion_oxigeno} unit="%" />
              <VitalCard icon="fitness" label="Peso Corporal" value={record.peso} unit="kg" />
              <VitalCard icon="git-commit" label="Talla Cintura" value={record.talla_cintura} unit="cm" />
              <VitalCard icon="resize" label="Altura Real" value={record.altura} unit="m" />
            </View>

            <Text style={styles.groupTitle}>OBSERVACIONES GENERALES</Text>
            <View style={styles.blockCard}>
              <Text style={styles.textData}>{record.observaciones || 'Sin comentarios adicionales.'}</Text>
            </View>
          </>
        ) : (
          // ⚡ FORMULARIO ACTIVO DE MODIFICACIÓN DE CAMPOS CLÍNICOS
          <View style={{marginTop: 5}}>
            <Text style={styles.editGroupLabel}>ANAMNESIS Y ANTECEDENTES</Text>
            <TextInput style={styles.editableInput} placeholder="Motivo de la visita" placeholderTextColor="#94A3B8" value={form.motivo} onChangeText={(t)=>setForm({...form, motivo:t})}/>
            <TextInput style={[styles.editableInput, styles.textArea]} multiline placeholder="Antecedentes Personales" placeholderTextColor="#94A3B8" value={form.antecedentes_personales} onChangeText={(t)=>setForm({...form, antecedentes_personales:t})}/>
            <TextInput style={[styles.editableInput, styles.textArea]} multiline placeholder="Antecedentes Familiares" placeholderTextColor="#94A3B8" value={form.antecedentes_familiares} onChangeText={(t)=>setForm({...form, antecedentes_familiares:t})}/>

            <Text style={styles.editGroupLabel}>SIGNOS VITALES (SOPORTE DECIMAL)</Text>
            <View style={styles.row}>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="P. Arterial (120/80)" placeholderTextColor="#94A3B8" value={form.presion_arterial} onChangeText={(t)=>setForm({...form, presion_arterial:t})}/>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Frec. Cardíaca (bpm)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.frecuencia_cardiaca} onChangeText={(t)=>setForm({...form, frecuencia_cardiaca:t})}/>
            </View>
            <View style={styles.row}>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Frec. Respiratoria (rpm)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.frecuencia_respiratoria} onChangeText={(t)=>setForm({...form, frecuencia_respiratoria:t})}/>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Temperatura (°C)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.temperatura} onChangeText={(t)=>setForm({...form, temperatura:t})}/>
            </View>
            <View style={styles.row}>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Sat. Oxígeno (%)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.saturacion_oxigeno} onChangeText={(t)=>setForm({...form, saturacion_oxigeno:t})}/>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Peso (kg)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.peso} onChangeText={(t)=>setForm({...form, peso:t})}/>
            </View>
            <View style={styles.row}>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Talla Cintura (cm)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.talla_cintura} onChangeText={(t)=>setForm({...form, talla_cintura:t})}/>
              <TextInput style={[styles.editableInput, {flex:1}]} placeholder="Altura (m - ej 1.70)" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" value={form.altura} onChangeText={(t)=>setForm({...form, altura:t})}/>
            </View>

            <Text style={styles.editGroupLabel}>TRATAMIENTO Y CONCLUSIONES</Text>
            <TextInput style={[styles.editableInput, styles.textArea]} multiline placeholder="Observaciones generales..." placeholderTextColor="#94A3B8" value={form.observaciones} onChangeText={(t)=>setForm({...form, observaciones:t})}/>

            {saving ? <ActivityIndicator size="large" color="#1D70D1" style={{marginTop: 15}} /> : (
              <TouchableOpacity style={styles.saveSubmitBtn} onPress={handleUpdate}>
                <Text style={styles.saveSubmitBtnText}>Actualizar Consulta Médica</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const VitalCard = ({ icon, label, value, unit }: any) => (
  <View style={styles.vCard}>
    <View style={styles.iconCircle}><Ionicons name={icon} size={16} color="#1D70D1" /></View>
    <View style={{ marginLeft: 10, flex: 1 }}>
      <Text style={styles.vLabel}>{label}</Text>
      <Text style={styles.vValue}>{value || '---'} <Text style={styles.vUnit}>{unit}</Text></Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, flex: 1, color: '#1E293B' },
  editBtnTop: { padding: 8, backgroundColor: '#EFF6FF', borderRadius: 8 },
  editBtnTopText: { fontSize: 13, fontWeight: 'bold', color: '#1D70D1' },
  groupTitle: { fontSize: 11, fontWeight: 'bold', color: '#1D70D1', letterSpacing: 1, marginBottom: 8, marginTop: 15 },
  editGroupLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B', letterSpacing: 1, marginBottom: 10, marginTop: 15 },
  blockCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 5 },
  blockCardLocked: { backgroundColor: '#F1F5F9', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', marginBottom: 5 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#64748B', marginBottom: 2 },
  value: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  subText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  textData: { fontSize: 14, color: '#334155', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  cieRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cieBadge: { backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 5 },
  vCard: { flexDirection: 'row', backgroundColor: '#FFF', width: '48%', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  iconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  vLabel: { fontSize: 11, color: '#64748B' },
  vValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginTop: 2 },
  vUnit: { fontSize: 10, fontWeight: 'normal', color: '#94A3B8' },
  editableInput: { backgroundColor: '#FFF', paddingHorizontal: 15, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, fontSize: 14, color: '#1E293B' },
  textArea: { height: 95, paddingTop: 14, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  saveSubmitBtn: { backgroundColor: '#1D70D1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 25 },
  saveSubmitBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' }
});