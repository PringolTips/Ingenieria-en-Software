import { StyleSheet, Text, View } from 'react-native';

export default function MedicoDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel Médico</Text>
      <Text>Bienvenido, Dr(a). Listo para consulta y expedientes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 }
});