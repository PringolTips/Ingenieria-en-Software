// app/(admin)/dashboard.tsx
import { Ionicons } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';

import React, { useCallback, useState } from 'react';

import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import api from '../../services/api';

import { userService } from '../../services/userService';



export default function AdminDashboard() {

  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [showInactives, setShowInactives] = useState(false);

 

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [editForm, setEditForm] = useState({ nombre: '', password: '' });



  const loadData = async () => {

    setLoading(true);

    try {

      const endpoint = showInactives ? '/api/v1/usuarios/inactivos' : '/api/v1/usuarios/activos';
      const response = await api.get(endpoint);

      if (response.data?.ok) setUsers(response.data.data || []);

    } catch (e) { setUsers([]); }

    finally { setLoading(false); }

  };



  useFocusEffect(useCallback(() => { loadData(); }, [showInactives]));



  const handleToggleStatus = (user: any) => {

    const accion = showInactives ? 'habilitar' : 'inhabilitar';

    Alert.alert("Confirmar", `¿Deseas ${accion} a ${user.nombre_usuario}?`, [

      { text: "No" },

      { text: "Sí", onPress: async () => {

        try {

          setUsers(prev => prev.filter(u => u.nombre_usuario !== user.nombre_usuario));

          const res = showInactives

            ? await userService.activarUsuario(user.nombre_usuario)

            : await userService.inhabilitarUsuario(user.nombre_usuario);



          if (res.ok) {

            Alert.alert("Éxito", "Usuario actualizado.");

            setTimeout(() => loadData(), 2000);

          }

        } catch (e) {

          Alert.alert("Error", "No se pudo cambiar el estado.");

          loadData();

        }

      }}

    ]);

  };



  const handleSaveEdit = async () => {

    try {

      const data: any = { nombre_usuario: editForm.nombre };

      if (editForm.password) data.contrasena = editForm.password;



      const res = await userService.actualizarUsuario(selectedUser.nombre_usuario, data);

      if (res.ok) {

        Alert.alert("Éxito", "Datos actualizados.");

        setModalVisible(false);

        loadData();

      }

    } catch (e) { Alert.alert("Error", "No se pudo actualizar."); }

  };



  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>Gestión de Personal</Text>

        <View style={styles.tabBar}>

          <TouchableOpacity style={[styles.tab, !showInactives && styles.tabActive]} onPress={() => setShowInactives(false)}><Text style={[styles.tabLabel, !showInactives && styles.tabLabelActive]}>Activos</Text></TouchableOpacity>

          <TouchableOpacity style={[styles.tab, showInactives && styles.tabActive]} onPress={() => setShowInactives(true)}><Text style={[styles.tabLabel, showInactives && styles.tabLabelActive]}>Inactivos</Text></TouchableOpacity>

        </View>

      </View>



      {loading && users.length === 0 ? <ActivityIndicator size="large" style={{marginTop: 50}} /> : (

        <FlatList data={users} keyExtractor={(item) => item.correo} renderItem={({ item }) => (

            <View style={styles.card}>

              <View style={{ flex: 1 }}>

                <Text style={styles.uName}>{item.nombre_usuario}</Text>

                <Text style={styles.uRole}>{item.nombre_rol}</Text>

              </View>

              <View style={{flexDirection: 'row', gap: 15}}>

                <TouchableOpacity onPress={() => { setSelectedUser(item); setEditForm({ nombre: item.nombre_usuario, password: '' }); setModalVisible(true); }}>

                  <Ionicons name="create-outline" size={24} color="#1976D2" />

                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleToggleStatus(item)}>

                  <Ionicons name={showInactives ? "refresh-circle" : "trash-outline"} size={24} color={showInactives ? "#22C55E" : "#EF4444"} />

                </TouchableOpacity>

              </View>

            </View>

          )}

        />

      )}



      <Modal visible={modalVisible} transparent animationType="fade">

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Editar Usuario</Text>

            <TextInput style={styles.input} value={editForm.nombre} onChangeText={(t) => setEditForm({...editForm, nombre: t})} placeholder="Nombre" />

            <TextInput style={styles.input} placeholder="Nueva Contraseña (Opcional)" secureTextEntry onChangeText={(t) => setEditForm({...editForm, password: t})} />

            <View style={{flexDirection: 'row', gap: 10, marginTop: 15}}>

              <TouchableOpacity style={[styles.btn, {backgroundColor: '#64748B'}]} onPress={() => setModalVisible(false)}><Text style={{color:'#FFF'}}>Cerrar</Text></TouchableOpacity>

              <TouchableOpacity style={[styles.btn, {backgroundColor: '#1976D2'}]} onPress={handleSaveEdit}><Text style={{color:'#FFF'}}>Guardar</Text></TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { padding: 20, backgroundColor: '#FFF' },

  headerTitle: { fontSize: 22, fontWeight: 'bold' },

  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4, marginTop: 10 },

  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 8 },

  tabActive: { backgroundColor: '#FFF', elevation: 2 },

  tabLabel: { fontSize: 13, color: '#64748B' },

  tabLabelActive: { color: '#1976D2', fontWeight: 'bold' },

  card: { flexDirection: 'row', padding: 18, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },

  uName: { fontSize: 16, fontWeight: 'bold' },

  uRole: { fontSize: 12, color: '#1976D2' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },

  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20 },

  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  input: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 10 },

  btn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' }

});