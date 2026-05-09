import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { users_api } from '../../api/users_api'; 

interface FormUpdateUserProps {
  onClose: () => void;
  onSuccess?: () => void;
  nombreUsuario?: string | null;
}

export default function FormUpdateUser({ onClose, onSuccess, nombreUsuario }: FormUpdateUserProps) {
  const [nombre_usuario_actual, setNombreUsuarioActual] = useState(nombreUsuario ?? '');
  const [nuevo_nombre_usuario, setNuevoNombreUsuario] = useState('');
  const [correo, setCorreo]               = useState('');
  const [loading, setLoading]             = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await users_api.updateUser(nombre_usuario_actual, nuevo_nombre_usuario, correo);
      
      toast.success(`Usuario actualizado exitosamente.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo actualizar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Nombre de usuario actual*/}
      <div>
        <label htmlFor="nombre_usuario_actual" className="block text-sm font-medium text-foreground mb-2">
          Nombre de usuario actual
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User size={16} />
          </div>
          <input
            id="nombre_usuario_actual"
            type="text"
            value={nombre_usuario_actual}
            onChange={(e) => setNombreUsuarioActual(e.target.value)}
            placeholder="ej. dr.ramirez"
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Nuevo nombre de usuario */}
      <div>
        <label htmlFor="nuevo_nombre_usuario" className="block text-sm font-medium text-foreground mb-2">
          Nuevo nombre de usuario
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User size={16} />
          </div>
          <input
            id="nuevo_nombre_usuario"
            type="text"
            value={nuevo_nombre_usuario}
            onChange={(e) => setNuevoNombreUsuario(e.target.value)}
            placeholder="ej. dr.ramirez"
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Correo */}
      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-foreground mb-2">
          Correo electrónico
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail size={16} />
          </div>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="usuario@ejemplo.com"
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Actualizar usuario'}
        </button>
      </div>

    </form>
  );
}