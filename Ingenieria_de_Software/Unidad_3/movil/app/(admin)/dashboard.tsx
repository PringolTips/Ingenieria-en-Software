import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={styles.headerCard}>
          <View style={styles.headerInfo}>
            <Text style={styles.welcome}>Panel de Control</Text>
            <Text style={styles.title}>Administrador</Text>
          </View>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>AD</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>45</Text>
            <Text style={styles.statLab}>Usuarios</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>120</Text>
            <Text style={styles.statLab}>Expedientes</Text>
          </View>
        </View>

        {/* Sección de Gestión de Sistema eliminada por solicitud */}

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => router.replace('/')}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Cerrar Sesión Segura</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 25 },
  headerCard: { backgroundColor: '#1976D2', padding: 25, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerInfo: { flex: 1 },
  welcome: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileCircle: { width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#FFF', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: '#FFF', width: '47%', padding: 20, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#1976D2' },
  statLab: { color: '#64748B', fontSize: 13, marginTop: 4 },
  logoutBtn: { marginTop: 40, padding: 15, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, borderWidth: 1, borderColor: '#FEE2E2' },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 }
});