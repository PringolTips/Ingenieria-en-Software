// hooks/useSessionTimeout.ts
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRef } from 'react';

// Límite de 15 minutos según requerimiento RNF-08
const INACTIVITY_LIMIT = 15 * 60 * 1000; 

export const useSessionTimeout = () => {
  const router = useRouter();
  // CORRECCIÓN DEL ERROR TS(2322): Usamos ReturnType para que sea dinámico
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    console.log("Sesión cerrada por inactividad");
    router.replace('/'); // Regresar al Login
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // Ahora el tipo coincide correctamente
    timerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
  };

  return { resetTimer };
};