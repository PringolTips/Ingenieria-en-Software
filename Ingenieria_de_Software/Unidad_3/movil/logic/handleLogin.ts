// logic/handleLogin.ts
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import api from '../services/api';

/**
 * Lógica de autenticación centralizada para Digiclin.
 * Maneja el sufijo institucional, la persistencia de sesión y el tipado de roles.
 */
const handleLogin = async (correo: string, password: string, setLoading: (v: boolean) => void) => {
  setLoading(true);
  try {
    // 1. Normalización del identificador (RN-Login)
    // Si el usuario no escribe el dominio, lo agregamos automáticamente
    const correoLimpio = correo.trim().toLowerCase();
    const finalEmail = correoLimpio.includes('@') ? correoLimpio : `${correoLimpio}@digiclin.com`;

    // 2. Construcción del cuerpo de la petición
    // Enviamos 'contrasena' y 'password' para evitar errores de "campos obligatorios"
    // El backend de Digiclin usa 'contrasena' en su modelo de base de datos.
    const body = {
      correo: finalEmail,
      contrasena: password, // Campo principal esperado por el servidor
      password: password,   // Campo secundario por compatibilidad
      nombre_usuario: correoLimpio.split('@')[0]
    };

    const response = await api.post('/api/auth/login', body);

    // 3. Validación de respuesta exitosa
    if (response.data && response.data.ok) {
      const { token, usuario } = response.data.data;

      // REQUERIMIENTO RNF-05: Almacenamiento seguro de credenciales
      await SecureStore.setItemAsync('userToken', String(token));
      await SecureStore.setItemAsync('userRole', String(usuario.nombre_rol));
      await SecureStore.setItemAsync('userEmail', finalEmail);

      // Lógica de seguridad: Forzar cambio de clave excepto para Admin
      // El Admin usa clave fija por jerarquía de sistema
      const forceChange = usuario.nombre_rol === 'Admin' ? false : usuario.debe_cambiar_password;

      return {
        nombre_rol: usuario.nombre_rol,
        debe_cambiar_password: forceChange
      };
    }
    
    return null;

  } catch (error: any) {
    // Captura de errores de servidor (401, 403, 500)
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.mensaje || 
                     "No se pudo conectar con el servidor.";
    
    console.error("Error en flujo de autenticación:", errorMsg);
    
    // Mostramos el error al usuario usando el componente nativo
    Alert.alert("Error de Acceso", errorMsg);
    
    return null;
  } finally {
    setLoading(false);
  }
};

export default handleLogin;