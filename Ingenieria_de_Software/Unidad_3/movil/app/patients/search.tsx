import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { patientService } from '../../services/patientService';

export default function SearchPatient() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showInactives, setShowInactives] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 🛡️ EL ESCUDO DEFINITIVO: Lista de CURPs bloqueados localmente
  const blacklist = useRef<Set<string>>(new Set());

  const loadData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Bloqueo de seguridad para Médicos/Enfermeros
      if (showInactives && userRole !== 'Admin') {
        setPatients([]);
        setLoading(false);
        return;
      }

      const response = showInactives 
        ? await patientService.obtenerPacientesInactivos() 
        : await patientService.obtenerPacientes();
      
      if (response && response.ok) {
        const rawData = response.data || [];
        
        // ⚡ FILTRO DE SEGURIDAD: 
        // Si el CURP está en la blacklist (recién movido), lo borramos de la respuesta del servidor
        const cleanData = rawData.filter((p: any) => !blacklist.current.has(p.curp));
        
        console.log(`[DevOps] Datos cargados: ${cleanData.length} pacientes (Filtrados: ${blacklist.current.size})`);
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
      // Al cambiar de pestaña no limpiamos la blacklist para mantener la protección
      SecureStore.getItemAsync('userRole').then(setUserRole);
      loadData();
    }, [showInactives, userRole])
  );

  useEffect(() => {
    const result = (patients || []).filter(p => 
      (p.nombre_completo || "").toLowerCase().includes(search.toLowerCase()) || 
      (p.curp || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, patients]);

  const handleToggleStatus = (patient: any) => {
    const accion = showInactives ? 'habilitar' : 'inhabilitar';
    const curpTarget = patient.curp;

    Alert.alert("Confirmar", `¿Deseas ${accion} a ${patient.nombre_completo || patient.nombre_p}?`, [
      { text: "No" },
      { text: "Sí", onPress: async () => {
        try {
          console.log(`[DevOps] Solicitando ${accion} de: ${curpTarget}`);

          // 1. ACTIVAR PROTECCIÓN LOCAL (Lo borramos de la vista YA)
          blacklist.current.add(curpTarget);
          setPatients(prev => prev.filter(p => p.curp !== curpTarget));

          const res = showInactives 
            ? await patientService.habilitarPaciente(curpTarget)
            : await patientService.inhabilitarPaciente(curpTarget);

          if (res && res.ok) {
            Alert.alert("Éxito", `Cambio realizado en el servidor.`);
            
            // 2. RETRASO DE CONSISTENCIA PROLONGADO (10 segundos)
            // Mantendremos el CURP bloqueado durante 10 segundos para dar tiempo 
            // a que la base de datos y Cloudflare se sincronicen.
            setTimeout(() => {
              blacklist.current.delete(curpTarget);
              console.log(`[DevOps] Protección liberada para: ${curpTarget}`);
              loadData(); 
            }, 10000); 

          } else {
            // Si el servidor falla, liberamos y recargamos
            blacklist.current.delete(curpTarget);
            loadData();
            Alert.alert("Error", "El servidor rechazó la solicitud.");
          }
        } catch (e) {
          blacklist.current.delete(curpTarget);
          loadData();
          Alert.alert("Error", "Fallo de conexión.");
        }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1D70D1" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Pacientes</Text>
      </View>

      <View style={styles.topSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput 
            placeholder="Buscar por Nombre o CURP..." 
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {userRole === 'Admin' && (
          <View style={styles.tabBar}>
            <TouchableOpacity 
              style={[styles.tab, !showInactives && styles.tabActive]} 
              onPress={() => { setPatients([]); setShowInactives(false); }}
            >
              <Text style={[styles.tabLabel, !showInactives && styles.tabLabelActive]}>Activos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, showInactives && styles.tabActive]} 
              onPress={() => { setPatients([]); setShowInactives(true); }}
            >
              <Text style={[styles.tabLabel, showInactives && styles.tabLabelActive]}>Inactivos</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && patients.length === 0 ? <ActivityIndicator size="large" color="#1D70D1" style={{marginTop: 50}}/> : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.curp}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/patients/${item.curp}` as any)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pName}>{item.nombre_completo || item.nombre_p}</Text>
                <Text style={styles.pCurp}>{item.curp}</Text>
              </View>
              {userRole === 'Admin' && (
                <TouchableOpacity onPress={() => handleToggleStatus(item)} style={{padding: 5}}>
                  <Ionicons 
                    name={showInactives ? "refresh-circle" : "trash-outline"} 
                    size={28} 
                    color={showInactives ? "#22C55E" : "#EF4444"} 
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 40, color: '#64748B'}}>No hay pacientes registrados.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  topSection: { backgroundColor: '#FFF', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 12, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', marginHorizontal: 20, borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFF', elevation: 2 },
  tabLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  tabLabelActive: { color: '#1D70D1' },
  card: { flexDirection: 'row', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  pName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  pCurp: { fontSize: 11, color: '#64748B' }
});