// app/(medico)/dashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedicoDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir del sistema institucional?", [
      { text: "No", style: "cancel" },
      { text: "Sí", onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userRole');
          router.replace('/' as any);
      }}
    ]);
  };

  const options = [
    { title: 'Registrar Paciente', icon: 'person-add', route: '/patients/register', color: '#1D70D1', enabled: true },
    { title: 'Consultar Pacientes', icon: 'search', route: '/patients/search', color: '#7E22CE', enabled: true },
    { title: 'Historial Expedientes', icon: 'journal', route: '/records', color: '#15803D', enabled: true }, 
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel Médico</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {options.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.card, !item.enabled && {backgroundColor: '#F1F5F9'}]} 
              onPress={() => item.enabled ? router.push(item.route as any) : Alert.alert("Próximamente", "Función en desarrollo.")}
            >
              <Ionicons name={item.icon as any} size={32} color={item.enabled ? item.color : '#94A3B8'} />
              <Text style={[styles.cardText, !item.enabled && {color: '#94A3B8'}]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  logoutBtn: { padding: 8, backgroundColor: '#FEE2E2', borderRadius: 10 },
  content: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', width: '47%', borderRadius: 20, padding: 20, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
  cardText: { fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 13, color: '#334155' }
});