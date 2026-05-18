// app/records/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordService } from '../../services/recordService';

export default function RecordsConsole() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadRecords = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    
    setRecords([]);
    setFiltered([]);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = showArchived 
        ? await recordService.obtenerArchivados()
        : await recordService.obtenerAbiertos();

      if (!controller.signal.aborted && res.ok) {
        setRecords(res.data || []);
      }
    } catch (e: any) {
      if (e.name !== 'CanceledError') setRecords([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecords();
      return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
    }, [showArchived])
  );

  useEffect(() => {
    const result = (records || []).filter(r => 
      (r.nombre_paciente || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.curp || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.diagnostico || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, records]);

  const handleArchivar = (record: any) => {
    Alert.alert("Archivar Consulta", `¿Confirmas archivar la consulta #${record.id_expediente}?`, [
      { text: "No", style: "cancel" },
      { text: "Sí, Archivar", onPress: async () => {
        try {
          setRecords(prev => prev.filter(r => r.id_expediente !== record.id_expediente));
          const res = await recordService.archivarExpediente(record.id_expediente);
          if (res.ok) {
            Alert.alert("Éxito", "Expediente archivado correctamente.");
            loadRecords();
          }
        } catch (e) {
          Alert.alert("Error", "No se pudo cambiar el estatus.");
          loadRecords();
        }
      }}
    ]);
  };

  const handleDesarchivar = (record: any) => {
    Alert.alert("Desarchivar Consulta", `¿Deseas reabrir la consulta #${record.id_expediente}?`, [
      { text: "No", style: "cancel" },
      { text: "Sí, Reabrir", onPress: async () => {
        try {
          setRecords(prev => prev.filter(r => r.id_expediente !== record.id_expediente));
          const res = await recordService.desarchivarExpediente(record.id_expediente);
          if (res.ok) {
            Alert.alert("Éxito", "Expediente reabierto.");
            loadRecords();
          }
        } catch (error: any) {
          // ⚡ EXPRESIVIDAD MAXIMA DE DIAGNÓSTICO: Te dice exactamente qué contestó el servidor
          const status = error.response?.status;
          const serverMsg = error.response?.data?.mensaje || error.response?.data?.error || "Ruta no encontrada";
          
          Alert.alert(
            "Error de Reapertura", 
            `Código HTTP: ${status || 'Red/Túnel'}\nDetalle: ${serverMsg}\n\nRevisa si el Backend usa /desarchivar, /habilitar o /reabrir.`
          );
          loadRecords();
        }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(medico)/dashboard' as any)}><Ionicons name="arrow-back" size={24} color="#15803D" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Historial Clínico Global</Text>
        
        {/* ⚡ PARÁMETRO DE RUTA: Le avisa al buscador que vamos exclusivamente en modo creación de consulta */}
        <TouchableOpacity 
          style={styles.headerAddBtn} 
          onPress={() => router.push({ pathname: '/patients/search' as any, params: { mode: 'create' } })}
        >
          <Ionicons name="add-circle" size={28} color="#15803D" />
        </TouchableOpacity>
      </View>

      <View style={styles.topSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput placeholder="Buscar por Paciente, CURP o Diagnóstico..." style={styles.searchInput} value={search} onChangeText={setSearch}/>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity style={[styles.tab, !showArchived && styles.tabActive]} onPress={() => setShowArchived(false)}>
            <Text style={[styles.tabLabel, !showArchived && styles.tabLabelActive]}>Abiertos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, showArchived && styles.tabActive]} onPress={() => setShowArchived(true)}>
            <Text style={[styles.tabLabel, showArchived && styles.tabLabelActive]}>Archivados</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && records.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#15803D" /></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id_expediente)}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push(`/records/${item.id_expediente}` as any)}>
                <Text style={styles.rId}>CONSULTA #{item.id_expediente} · {item.codigo_cie || 'CIE-10'}</Text>
                <Text style={styles.rPatient}>{item.nombre_paciente}</Text>
                <Text style={styles.rDiag}>{item.diagnostico || 'Diagnóstico no especificado'}</Text>
                <Text style={styles.rMotivo} numberOfLines={1}>Motivo: {item.motivo}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.archiveBtn, showArchived && {backgroundColor: '#E0F2FE'}]} 
                onPress={() => showArchived ? handleDesarchivar(item) : handleArchivar(item)}
              >
                <Ionicons 
                  name={showArchived ? "arrow-undo-outline" : "archive-outline"} 
                  size={22} 
                  color={showArchived ? "#0284C7" : "#15803D"} 
                />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No se hallaron expedientes en este bloque.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, color: '#1E293B', flex: 1 },
  headerAddBtn: { padding: 5 },
  topSection: { backgroundColor: '#FFF', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 12, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', marginHorizontal: 20, borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFF', elevation: 2 },
  tabLabel: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  tabLabelActive: { color: '#15803D' },
  card: { flexDirection: 'row', padding: 18, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', elevation: 1 },
  rId: { fontSize: 11, fontWeight: 'bold', color: '#15803D' },
  rPatient: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginTop: 3 },
  rDiag: { fontSize: 13, color: '#475569', fontWeight: '500', marginTop: 2 },
  rMotivo: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  archiveBtn: { padding: 10, backgroundColor: '#E8F5E9', borderRadius: 10, marginLeft: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { textAlign: 'center', color: '#64748B', fontSize: 14, marginTop: 40 }
});