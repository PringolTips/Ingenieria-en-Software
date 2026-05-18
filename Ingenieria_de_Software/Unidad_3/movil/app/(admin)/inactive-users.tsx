// app/(admin)/inactive-users.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InactiveUsers() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-remove" size={40} color="#EF4444" />
        <Text style={styles.title}>Usuarios Inactivos</Text>
        <Text style={styles.subtitle}>Personal que ha sido dado de baja del sistema</Text>
      </View>
      
      {/* Aquí cargarías tu lista de la API /api/usuarios/inactivos */}
      <FlatList 
        data={[]} 
        ListEmptyComponent={<Text style={styles.empty}>No hay personal inactivo actualmente.</Text>}
        renderItem={() => null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { alignItems: 'center', padding: 40, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 50, color: '#94A3B8' }
});