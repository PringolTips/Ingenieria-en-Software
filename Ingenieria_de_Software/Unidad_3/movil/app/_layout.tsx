import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pantallas principales */}
      <Stack.Screen name="index" /> 
      <Stack.Screen name="change-password" />

      {/* Ajustamos los nombres para que coincidan con tus archivos físicos */}
      <Stack.Screen name="(admin)/dashboard" />
      <Stack.Screen name="(medico)/dashboard" />
      <Stack.Screen name="(enfermero)/dashboard" />

      {/* El resto se puede quedar igual */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}