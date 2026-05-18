// app/(admin)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert, TouchableOpacity } from 'react-native';

export default function AdminLayout() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Deseas salir del sistema?", [
      { text: "No", style: "cancel" },
      { 
        text: "Sí", 
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userRole');
          router.replace('/' as any); 
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
          <Ionicons name="log-out" size={24} color="white" />
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: 'Menú', tabBarIcon: ({ color }) => <Ionicons name="menu" size={24} color={color} /> }} />
      <Tabs.Screen name="create-user" options={{ href: null }} />
      <Tabs.Screen name="inactive-users" options={{ href: null }} />
    </Tabs>
  );
}