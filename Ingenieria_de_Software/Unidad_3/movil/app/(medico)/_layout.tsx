import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(medico)" />
      <Stack.Screen name="(enfermero)" />
      <Stack.Screen name="patients" />
      <Stack.Screen name="change-password" />
    </Stack>
  );
}