import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EnfermeroDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir del sistema?", [
      { text: "No", style: "cancel" },
      { 
        text: "Sí", 
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userRole');
          router.replace('/' as any); // Regresa al Login (index.tsx)
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enfermería</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.mainCard} onPress={() => router.push('/patients/register' as any)}>
          <Ionicons name="person-add" size={40} color="#FFF" />
          <Text style={styles.mainCardText}>Registrar Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subCard} onPress={() => router.push('/patients/search' as any)}>
          <Ionicons name="search" size={24} color="#1D70D1" />
          <Text style={styles.subCardText}>Lista de Pacientes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#1D70D1', padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  mainContent: { padding: 20, gap: 15 },
  mainCard: { backgroundColor: '#1D70D1', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 4 },
  mainCardText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginTop: 10 },
  subCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  subCardText: { fontSize: 16, fontWeight: 'bold', color: '#334155' }
});