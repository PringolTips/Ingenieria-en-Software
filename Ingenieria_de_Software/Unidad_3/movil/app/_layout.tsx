// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(medico)" />
      <Stack.Screen name="(enfermero)" />
      <Stack.Screen name="patients" />
      {/* ⚡ CONFIGURACIÓN PLANA: Elimina la advertencia [Layout children] de la consola */}
      <Stack.Screen name="records/index" />
      <Stack.Screen name="records/create" />
      <Stack.Screen name="records/[id]" />
      <Stack.Screen name="change-password" />
    </Stack>
  );
}