import { StyleSheet, Text, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>
      <Text>Bienvenido, Administrador. Aquí puedes gestionar usuarios.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 }
});