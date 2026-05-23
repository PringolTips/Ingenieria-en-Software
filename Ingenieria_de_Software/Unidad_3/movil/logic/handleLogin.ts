// logic/handleLogin.ts
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import api from '../services/api';

/**
 * Lógica de autenticación centralizada para Digiclin.
 * Guarda tokens e IDs dinámicos del personal para evitar conflictos de identidad.
 */
const handleLogin = async (correo: string, password: string, setLoading: (v: boolean) => void) => {
  setLoading(true);
  try {
    const correoLimpio = correo.trim().toLowerCase();
    const finalEmail = correoLimpio.includes('@') ? correoLimpio : `${correoLimpio}@digiclin.com`;

    const body = {
      correo: finalEmail,
      contrasena: password, 
      password: password,   
      nombre_usuario: correoLimpio.split('@')[0]
    };

    const response = await api.post('/api/v1/auth/login', body);

    if (response.data && response.data.ok) {
      const { token, usuario } = response.data.data;

      // REQUERIMIENTO RNF-05: Almacenamiento seguro de credenciales globales
      await SecureStore.setItemAsync('userToken', String(token));
      await SecureStore.setItemAsync('userRole', String(usuario.nombre_rol));
      await SecureStore.setItemAsync('userEmail', finalEmail);

      // ⚡ CLAVE DEVOPS: Guardamos dinámicamente el ID del médico o usuario firmado
      if (usuario.id_medico) {
        await SecureStore.setItemAsync('idMedico', String(usuario.id_medico));
      } else if (usuario.id_usuario) {
        await SecureStore.setItemAsync('idMedico', String(usuario.id_usuario));
      }

      const forceChange = usuario.nombre_rol === 'Admin' ? false : usuario.debe_cambiar_password;

      return {
        nombre_rol: usuario.nombre_rol,
        debe_cambiar_password: forceChange
      };
    }
    
    return null;

  } catch (error: any) {
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.mensaje || 
                     "No se pudo conectar con el servidor.";
    
    console.error("Error en flujo de autenticación:", errorMsg);
    Alert.alert("Error de Acceso", errorMsg);
    return null;
  } finally {
    setLoading(false);
  }
};

export default handleLogin;