import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

export default function RootLayout() {
  const { resetTimer } = useSessionTimeout();

  return (
    <View style={styles.container} onTouchStart={resetTimer}>
      <Stack screenOptions={{ 
        headerStyle: { backgroundColor: '#1976D2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        animation: 'slide_from_right'
      }}>
        {/* El Login no lleva cabecera */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Los grupos (admin, enfermero) manejan su propia navegación interna */}
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        
        {/* Pantalla de cambio de pass: Sin botón de regreso por seguridad */}
        <Stack.Screen 
          name="change-password" 
          options={{ 
            title: "Seguridad DIGICLIN",
            headerLeft: () => null 
          }} 
        /> 
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });