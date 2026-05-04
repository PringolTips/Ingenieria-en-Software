import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { processPasswordChange } from '../logic/handlePassword';

const C = { p: '#1976D2', t: '#1E293B', m: '#64748B', b: '#E2E8F0', g: '#F8FAFC' };

export default function ChangePasswordScreen() {
  const [f, sF] = useState({ c: '', n: '', cf: '' });
  const [l, sL] = useState(false);
  const [v1, sV1] = useState(false);
  const [v2, sV2] = useState(false);
  const [v3, sV3] = useState(false);
  const router = useRouter();

  const hP = async () => {
    if (!f.c || !f.n || !f.cf) return Alert.alert("Error", "Llena todos los campos.");
    const res = await processPasswordChange({current: f.c, next: f.n, confirm: f.cf}, sL);
    if (res.success) {
      Alert.alert("Éxito", "Contraseña cambiada.", [{ text: "OK", onPress: () => router.replace('/') }]);
    } else {
      Alert.alert("Error", res.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1,backgroundColor:C.g}}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield-lock" size={60} color={C.p} />
          <Text style={styles.title}>Nueva Contraseña</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Contraseña Actual</Text>
          <View style={styles.row}>
            <TextInput secureTextEntry={!v1} style={styles.input} value={f.c} onChangeText={(t)=>sF({...f,c:t})} />
            <TouchableOpacity onPress={()=>sV1(!v1)}><Ionicons name={v1?"eye":"eye-off"} size={22} color={C.p} /></TouchableOpacity>
          </View>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <View style={styles.row}>
            <TextInput secureTextEntry={!v2} style={styles.input} value={f.n} onChangeText={(t)=>sF({...f,n:t})} />
            <TouchableOpacity onPress={()=>sV2(!v2)}><Ionicons name={v2?"eye":"eye-off"} size={22} color={C.p} /></TouchableOpacity>
          </View>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.row}>
            <TextInput secureTextEntry={!v3} style={styles.input} value={f.cf} onChangeText={(t)=>sF({...f,cf:t})} />
            <TouchableOpacity onPress={()=>sV3(!v3)}><Ionicons name={v3?"eye":"eye-off"} size={22} color={C.p} /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btn} onPress={hP} disabled={l}>
            {l ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnT}>Actualizar</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: C.t },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 5 },
  label: { fontSize: 13, fontWeight: '700', color: C.t, marginBottom: 5, marginTop: 15 },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.b, borderRadius: 10, paddingHorizontal: 10, height: 50 },
  input: { flex: 1, fontSize: 15 },
  btn: { backgroundColor: '#22C55E', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  btnT: { color: '#FFF', fontWeight: 'bold' }
});