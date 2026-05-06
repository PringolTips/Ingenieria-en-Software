import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert, TouchableOpacity } from 'react-native';

export default function AdminLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir del sistema de forma segura?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          router.replace('/'); // Regreso forzado al Login raíz
        } 
      }
    ]);
  };

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#1976D2',
      headerShown: true,
      headerStyle: { backgroundColor: '#1976D2' },
      headerTintColor: '#fff',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="create-user" options={{ title: 'Alta Personal', tabBarIcon: ({ color }) => <Ionicons name="person-add" size={24} color={color} /> }} />
    </Tabs>
  );
}