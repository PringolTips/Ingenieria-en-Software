import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
   <Stack screenOptions={{ 
  headerShown: true, 
  headerTitle: "", // Título vacío para que no estorbe
  headerTransparent: true, // Para que el diseño del login suba hasta arriba
  gestureEnabled: true, 
  animation: 'slide_from_right' 
}}>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="change-password" options={{ headerLeft: () => null }} /> 
</Stack>
  );
}