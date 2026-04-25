import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChangePassword() {
  const [pass, setPass] = useState('');

  const validateAndSave = () => {
    // Validaciones del SRS: 8 caracteres, letra y número [cite: 401-403]
    const isValid = pass.length >= 8 && /[A-Za-z]/.test(pass) && /\d/.test(pass);
    
    if (!isValid) {
      Alert.alert("Seguridad", "La clave debe tener 8+ caracteres, letras y números.");
      return;
    }
    Alert.alert("Éxito", "Contraseña actualizada.");
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Contraseña</Text>
      <TextInput style={styles.input} placeholder="Nueva contraseña" secureTextEntry onChangeText={setPass} />
      <TouchableOpacity style={styles.btn} onPress={validateAndSave}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 40, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#666', marginBottom: 30, fontSize: 18, padding: 10 },
  btn: { backgroundColor: '#1565C0', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});