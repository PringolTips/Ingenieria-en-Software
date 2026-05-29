// app/patients/search.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { patientService } from '../../services/patientService';

export default function SearchPatient() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [patients, setPatients] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showInactives, setShowInactives] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const blacklist = useRef<Set<string>>(new Set());
  const isCreateMode = params.mode === 'create';

  const loadData = async () => {
    if (loading) return;
    setPatients([]); 
    setLoading(true);
    try {
      if (showInactives && userRole !== 'Medico') {
        setPatients([]);
        setLoading(false);
        return;
      }

      const response = showInactives 
        ? await patientService.obtenerPacientesInactivos()
        : await patientService.obtenerPacientes();
      
      if (response && response.ok) {
        const rawData = response.data || [];
        const cleanData = rawData.filter((p: any) => !blacklist.current.has(p.curp));
        setPatients(cleanData);
      }
    } catch (e) {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('userRole').then(setUserRole);
      loadData();
    }, [showInactives, userRole])
  );

  useEffect(() => {
    const result = (patients || []).filter(p => 
      (p.nombre_completo || p.nombre_p || "").toLowerCase().includes(search.toLowerCase()) || 
      (p.curp || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, patients]);

  const handleToggleStatus = (patient: any) => {
    const accion = showInactives ? 'habilitar' : 'inhabilitar';
    const curpTarget = patient.curp;

    Alert.alert("Confirmar Estado", `¿Deseas ${accion} a ${patient.nombre_completo || patient.nombre_p}?`, [
      { text: "No", style: "cancel" },
      { text: "Sí", onPress: async () => {
        try {
          blacklist.current.add(curpTarget);
          setPatients(prev => prev.filter(p => p.curp !== curpTarget));

          const res = showInactives 
            ? await patientService.habilitarPaciente(curpTarget)
            : await patientService.inhabilitarPaciente(curpTarget);

          if (res && res.ok) {
            Alert.alert("Éxito", `Estado modificado correctamente.`);
            setTimeout(() => {
              blacklist.current.delete(curpTarget);
              loadData(); 
            }, 4000); 
          } else {
            blacklist.current.delete(curpTarget);
            loadData();
            Alert.alert("Error", "El servidor no procesó la solicitud.");
          }
        } catch (e) {
          blacklist.current.delete(curpTarget);
          loadData();
          Alert.alert("Error", "Fallo en la comunicación.");
        }
      }}
    ]);
  };

  const handlePatientPress = (item: any) => {
    if (isCreateMode) {
      router.push({
        pathname: '/records/create' as any,
        params: { id_paciente: item.id_paciente, curp: item.curp, nombre: item.nombre_completo || item.nombre_p }
      });
    } else {
      router.push(`/patients/${item.curp}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1D70D1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCreateMode ? "Seleccionar Paciente para Consulta" : "Gestión de Pacientes"}
        </Text>
      </View>

      <View style={styles.topSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput placeholder="Buscar por Nombre o CURP..." style={styles.searchInput} value={search} onChangeText={setSearch}/>
        </View>

        {userRole === 'Medico' && !isCreateMode && (
          <View style={styles.tabBar}>
            <TouchableOpacity style={[styles.tab, !showInactives && styles.tabActive]} onPress={() => { setPatients([]); setShowInactives(false); }}>
              <Text style={[styles.tabLabel, !showInactives && styles.tabLabelActive]}>Activos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, showInactives && styles.tabActive]} onPress={() => { setPatients([]); setShowInactives(true); }}>
              <Text style={[styles.tabLabel, showInactives && styles.tabLabelActive]}>Inactivos</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && patients.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1D70D1" /></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.curp}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => handlePatientPress(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pName}>{item.nombre_completo || item.nombre_p}</Text>
                <Text style={styles.pCurp}>{item.curp}</Text>
              </View>
              <View style={styles.actions}>
                {userRole === 'Medico' && !isCreateMode && (
                  <TouchableOpacity onPress={() => handleToggleStatus(item)} style={styles.iconBtn}>
                    <Ionicons name={showInactives ? "refresh-circle" : "trash-outline"} size={28} color={showInactives ? "#22C55E" : "#EF4444"} />
                  </TouchableOpacity>
                )}
                <Ionicons name={isCreateMode ? "add-circle-outline" : "chevron-forward"} size={22} color={isCreateMode ? "#15803D" : "#CBD5E1"} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay registros en esta categoría.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', marginLeft: 10, color: '#1E293B', flex: 1 },
  topSection: { backgroundColor: '#FFF', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 12, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', marginHorizontal: 20, borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFF', elevation: 2 },
  tabLabel: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  tabLabelActive: { color: '#1D70D1' },
  card: { flexDirection: 'row', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center', borderRadius: 16, marginBottom: 12, elevation: 1 },
  pName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  pCurp: { fontSize: 12, color: '#64748B', marginTop: 3 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { padding: 5 },
  emptyText: { textAlign: 'center', color: '#64748B', fontSize: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }
});