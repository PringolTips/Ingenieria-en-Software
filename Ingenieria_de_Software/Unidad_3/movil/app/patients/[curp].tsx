// app/patients/[curp].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { patientService } from '../../services/patientService';
import { recordService } from '../../services/recordService';

export default function PatientDetail() {
  const { curp } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const role = await SecureStore.getItemAsync('userRole');
      setUserRole(role);

      const resPatient = await patientService.obtenerPacientePorCurp(String(curp));
      if (resPatient.ok && resPatient.data) {
        const dataObj = Array.isArray(resPatient.data) ? resPatient.data[0] : resPatient.data;
        setPatient(dataObj);
        
        if (role === 'Medico') {
          const resRecords = await recordService.obtenerPorPaciente(String(curp));
          if (resRecords.ok) setRecords(resRecords.data || []);
        }
      }
    } catch (e: any) {
      console.error("[DevOps Exception] Fallo en la sincronización del expediente:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [curp]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1D70D1" /></View>;
  if (!patient) return <View style={styles.center}><Text style={styles.emptyText}>No se encontraron datos del paciente.</Text></View>;

  const formatFecha = (isoString: string) => {
    if (!isoString) return '---';
    try {
      return new Date(isoString).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1D70D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dossier Clínico</Text>
        <View style={styles.badgeEstatus}>
          <Text style={[styles.badgeEstatusText, patient.nombre_estatus === 'Inactivo' && {color: '#EF4444', backgroundColor: '#FEE2E2'}]}>
            {patient.nombre_estatus || 'Activo'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionNominal}>
          <View style={styles.avatarCircle}><Text style={styles.avatarLetter}>{(patient.nombre_p || 'P')[0]}</Text></View>
          <Text style={styles.pFullName}>
            {patient.nombre_completo || `${patient.nombre_p || ''} ${patient.apellido_pat || ''} ${patient.apellido_mat || ''}`.trim()}
          </Text>
          <Text style={styles.pCurpSub}>CURP: {patient.curp}</Text>
        </View>

        <Text style={styles.groupTitle}>DATOS FILIACIÓN Y DEMOGRÁFICOS</Text>
        <View style={styles.blockCard}>
          <View style={styles.gridRow}>
            <DataField label="EDAD CRONOLÓGICA" value={patient.edad ? `${patient.edad} años` : '---'} flex={1} />
            <DataField label="GÉNERO / SEXO" value={patient.nombre_sexo} flex={1} />
          </View>
          <View style={styles.divider} />
          <View style={styles.gridRow}>
            <DataField label="FECHA NACIMIENTO" value={formatFecha(patient.fecha_nacimiento)} flex={1} />
            <DataField label="ESTADO CIVIL" value={patient.nombre_estado_civil || 'No especificado'} flex={1} />
          </View>
          {/* ⚡ CORRECCIÓN: Ocupación removida de la visualización fija para alinearse al JSON */}
        </View>

        <Text style={styles.groupTitle}>INFORMACIÓN MÉDICA PERMANENTE</Text>
        <View style={styles.blockCard}>
          <View style={styles.gridRow}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={styles.bloodIconWrapper}><Ionicons name="water" size={16} color="#EF4444" /></View>
              <DataField label="GRUPO SANGUÍNEO" value={patient.nombre_tipo_sangre || '---'} />
            </View>
            <DataField label="ID INTERNO PACIENTE" value={`#${patient.id_paciente}`} flex={1} />
          </View>
        </View>

        <Text style={styles.groupTitle}>CONTACTO Y COMUNICACIÓN</Text>
        <View style={styles.blockCard}>
          <DataField label="TELÉFONO PARTICULAR" value={patient.telefono || 'No registrado'} icon="call-outline" />
          <View style={styles.divider} />
          <DataField label="CONTACTO DE EMERGENCIA" value={patient.contacto_emergencia || 'No registrado'} icon="alert-circle-outline" />
          {patient.correo && (
            <>
              <View style={styles.divider} />
              <DataField label="CORREO ELECTRÓNICO" value={patient.correo} icon="mail-outline" />
            </>
          )}
          {patient.domicilio && (
            <>
              <View style={styles.divider} />
              <DataField label="DOMICILIO GEOGRÁFICO" value={patient.domicilio} icon="location-outline" />
            </>
          )}
        </View>

        {userRole === 'Medico' && (
          <>
            <View style={styles.historyHeaderRow}>
              <Text style={styles.groupTitle}>HISTORIAL CLÍNICO DE CONSULTAS</Text>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => router.push({
                  pathname: '/records/create' as any,
                  params: { id_paciente: patient.id_paciente, curp: patient.curp, nombre: patient.nombre_completo || patient.nombre_p }
                })}
              >
                <Ionicons name="add-circle-outline" size={16} color="#FFF" />
                <Text style={styles.addBtnText}>Nueva Consulta</Text>
              </TouchableOpacity>
            </View>

            {records.length === 0 ? (
              <View style={[styles.blockCard, {alignItems: 'center', paddingVertical: 20}]}>
                <Ionicons name="folder-open-outline" size={24} color="#94A3B8" />
                <Text style={styles.emptyText}>El paciente no registra consultas previas en el sistema.</Text>
              </View>
            ) : (
              records.map((item) => (
                <TouchableOpacity 
                  key={item.id_expediente} 
                  style={styles.recordCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/records/${item.id_expediente}` as any)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recordDate}>{formatFecha(item.fecha_consulta)}</Text>
                    <Text style={styles.recordMotivo} numberOfLines={1}>Motivo: {item.motivo}</Text>
                    <Text style={styles.recordDiag} numberOfLines={1}>Diagnóstico: {item.diagnostico || 'Por definir'}</Text>
                  </View>
                  <View style={styles.badgeExpediente}>
                    <Text style={styles.badgeExpedienteText}>{item.estatus_expediente || 'Abierto'}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#1D70D1" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const DataField = ({ label, value, icon, flex }: any) => (
  <View style={[styles.fieldContainer, flex ? { flex } : undefined]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldValueRow}>
      {icon && <Ionicons name={icon} size={14} color="#64748B" style={{marginRight: 6}} />}
      <Text style={styles.fieldValue}>{value || '---'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 12, color: '#1E293B', flex: 1 },
  badgeEstatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeEstatusText: { fontSize: 11, fontWeight: 'bold', color: '#16A34A', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
  sectionNominal: { alignItems: 'center', paddingVertical: 25, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 12 },
  avatarLetter: { fontSize: 26, fontWeight: 'bold', color: '#1D70D1' },
  pFullName: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', paddingHorizontal: 20 },
  pCurpSub: { fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 4 },
  groupTitle: { fontSize: 11, fontWeight: 'bold', color: '#1D70D1', letterSpacing: 1, marginTop: 20, marginHorizontal: 20, marginBottom: 8 },
  blockCard: { backgroundColor: '#FFF', marginHorizontal: 20, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fieldContainer: { paddingVertical: 4 },
  fieldLabel: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8', marginBottom: 2 },
  fieldValueRow: { flexDirection: 'row', alignItems: 'center' },
  fieldValue: { fontSize: 14, fontWeight: '600', color: '#334155' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  bloodIconWrapper: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  historyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1D70D1', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, gap: 5, marginTop: 12 },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  recordCard: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, padding: 16, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', elevation: 1 },
  recordDate: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  recordMotivo: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginTop: 3 },
  recordDiag: { fontSize: 13, color: '#1D70D1', marginTop: 2 },
  badgeExpediente: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeExpedienteText: { fontSize: 10, color: '#1D70D1', fontWeight: 'bold', backgroundColor: '#E0F2FE', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, overflow: 'hidden' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 13, marginTop: 5 }
});