import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.headerCard}>
          <View style={styles.headerInfo}>
            <Text style={styles.welcome}>Panel de Control</Text>
            <Text style={styles.title}>Administrador</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Text style={styles.profileText}>AD</Text>
          </TouchableOpacity>
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

        <Text style={styles.sectionTitle}>Gestión de Sistema</Text>
        
        {/* Solo dejamos los botones que realmente tienen una función */}
        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.iconContainer, {backgroundColor: '#E3F2FD'}]}>
            <MaterialCommunityIcons name="account-group" size={24} color="#1976D2" />
          </View>
          <View style={styles.btnTexts}>
            <Text style={styles.btnTitle}>Gestionar Usuarios</Text>
            <Text style={styles.btnSub}>Crear o editar accesos (RF-10)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.iconContainer, {backgroundColor: '#F1F8E9'}]}>
            <MaterialCommunityIcons name="database-settings" size={24} color="#43A047" />
          </View>
          <View style={styles.btnTexts}>
            <Text style={styles.btnTitle}>Logs del Sistema</Text>
            <Text style={styles.btnSub}>Auditoría de accesos a AWS</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Cerrar Sesión Segura</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20 },
  headerCard: { backgroundColor: '#1976D2', padding: 25, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerInfo: { flex: 1 },
  welcome: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileCircle: { width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#FFF', fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: '#FFF', width: '47%', padding: 20, borderRadius: 20, elevation: 3 },
  statNum: { fontSize: 22, fontWeight: 'bold', color: '#1976D2' },
  statLab: { color: '#64748B', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  actionBtn: { backgroundColor: '#FFF', padding: 15, borderRadius: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  btnTexts: { flex: 1 },
  btnTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  btnSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  logoutBtn: { marginTop: 30, padding: 15, alignItems: 'center' },
  logoutText: { color: '#EF5350', fontWeight: 'bold' }
});