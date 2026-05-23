// app/patients/_layout.tsx
import { Stack } from 'expo-router';

export default function PatientsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="register" />
      <Stack.Screen name="[curp]" />
    </Stack>
  );
}