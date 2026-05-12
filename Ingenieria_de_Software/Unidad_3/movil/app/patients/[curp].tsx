import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { patientService } from '../../services/patientService';

export default function PatientDetail() {
  const { curp } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // Intentamos cargar de activos (visible para todos)
        const res = await patientService.obtenerPacientes();
        let found = res.data?.find((p: any) => p.curp === curp);

        // Si no está en activos y somos admin, buscamos en inactivos
        if (!found) {
          try {
            const resIn = await patientService.obtenerPacientesInactivos();
            found = resIn.data?.find((p: any) => p.curp === curp);
          } catch (e) { /* Bloqueo 403 esperado para médicos */ }
        }
        
        setPatient(found);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchPatient();
  }, [curp]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1D70D1" /></View>;
  
  if (!patient) return (
    <View style={styles.center}>
      <Text style={{textAlign:'center', padding: 20}}>No tienes permisos para ver este expediente o el paciente no existe.</Text>
      <TouchableOpacity onPress={() => router.back()}><Text style={{color:'#1D70D1'}}>Regresar</Text></TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1D70D1" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Expediente Clínico</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Usamos bloques verticales para evitar cortes */}
        <InfoRow label="NOMBRE COMPLETO" value={patient.nombre_completo || patient.nombre_p} />
        <InfoRow label="CURP" value={patient.curp} />
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '48%'}}><InfoRow label="EDAD" value={`${patient.edad} años`} /></View>
            <View style={{width: '48%'}}><InfoRow label="SEXO" value={patient.nombre_sexo || patient.sexo} /></View>
        </View>

        {/* MAPEO FLEXIBLE: Si el servidor cambia el nombre del campo para Médicos, aquí lo atrapamos */}
        <InfoRow label="CORREO ELECTRÓNICO" value={patient.correo || patient.email || 'No proporcionado por el servidor'} />
        <InfoRow label="TELÉFONO" value={patient.telefono || patient.tel || 'No proporcionado por el servidor'} />
        <InfoRow label="DOMICILIO COMPLETO" value={patient.domicilio || patient.direccion || 'No proporcionado por el servidor'} />
        <InfoRow label="CONTACTO EMERGENCIA" value={patient.contacto_emergencia || 'No registrado'} />
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoBox}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'Sin datos'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  infoBox: { marginBottom: 15, backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 10, fontWeight: 'bold', color: '#64748B', marginBottom: 5 },
  value: { fontSize: 15, color: '#1E293B', fontWeight: '600' }
});