import { useState } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { users_api } from '../../api/users_api'; 

interface FormCreateUserProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ROLES = [
  { value: 'Medico',        label: 'Médico' },
  { value: 'Enfermero',     label: 'Enfermero' },
  { value: 'Admin', label: 'Administrador' },
];

export default function FormCreateUser({ onClose, onSuccess }: FormCreateUserProps) {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [correo, setCorreo]               = useState('');
  const [rol, setRol]                     = useState('');
  const [loading, setLoading]             = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rol) {
      toast.error('Selecciona un rol para el usuario.');
      return;
    }
    setLoading(true);
    try {
      await users_api.createUser(nombre_usuario, correo, rol);
      
      toast.success(`Usuario ${nombre_usuario} creado exitosamente.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Nombre de usuario */}
      <div>
        <label htmlFor="nombre_usuario" className="block text-sm font-medium text-foreground mb-2">
          Nombre de usuario
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User size={16} />
          </div>
          <input
            id="nombre_usuario"
            type="text"
            value={nombre_usuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
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

      {/* Rol */}
      <div>
        <label htmlFor="rol" className="block text-sm font-medium text-foreground mb-2">
          Rol
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Shield size={16} />
          </div>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
            required
          >
            <option value="" disabled>Selecciona un rol</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
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
          {loading ? 'Guardando...' : 'Agregar usuario'}
        </button>
      </div>

    </form>
  );
}