import { StyleSheet, Text, View } from 'react-native';

export default function EnfermeroDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Enfermería</Text>
      <Text>Bienvenido. Listo para registro de pacientes y signos vitales.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00838F', marginBottom: 10 }
});