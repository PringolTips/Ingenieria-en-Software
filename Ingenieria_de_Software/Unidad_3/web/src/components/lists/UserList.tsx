import { useState, useEffect } from 'react';
import { MoreVertical, Pencil, Trash2, UserCheck } from 'lucide-react';
// import { Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { users_api } from '../../api/users_api';
import ConfirmationModal from '../ConfirmationModal';
import { createPortal } from 'react-dom';

interface Usuario {
  nombre_usuario: string;
  correo: string;
  debe_cambiar_password: boolean;
  fecha_creacion: string;
  nombre_rol: string;
  nombre_estatus: string;
}

interface UserListProps {
  onUpdate: (usuario: Usuario) => void;
  refresh: number;
}

const ROL_COLORS: Record<string, string> = {
  'Medico': 'bg-blue-100 text-blue-700',
  'Enfermero': 'bg-green-100 text-green-700',
  'Admin': 'bg-purple-100 text-purple-700',
};

export default function UserList({ onUpdate, refresh }: UserListProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    tipo: 'archivar' | 'eliminar';
    usuario: Usuario;
  } | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const handleMenu = (e: React.MouseEvent, nombreUsuario: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 176,
    });
    setMenuAbierto(nombreUsuario);
  }

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await users_api.getAllUsers();
      setUsuarios(data.data);
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [refresh]);

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

  /* const handleArchivar = (usuario: Usuario) => {
    setMenuAbierto(null);
    setConfirmModal({ tipo: 'archivar', usuario });
  }; */

  const handleEliminar = async (usuario: Usuario) => {
    setMenuAbierto(null);
    setConfirmModal({ tipo: 'eliminar', usuario });
  };

  const handleConfirm = async () => {
    if (!confirmModal) return;
    try {
      if (confirmModal.tipo === 'archivar') {
        await users_api.disableUser(confirmModal.usuario.nombre_usuario);
        toast.success(`Usuario ${confirmModal.usuario.nombre_usuario} ha sido archivado exitosamente.`);
      } else {
        await users_api.deleteUser(confirmModal.usuario.nombre_usuario);
        toast.success(`Usuario ${confirmModal.usuario.nombre_usuario} ha sido eliminado exitosamente.`);
      }
      setConfirmModal(null);
      cargarUsuarios();
    } catch (err: any) {
      toast.error(err?.message || 'No se pudo completar la acción.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Cargando usuarios...
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
        <UserCheck size={32} className="text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No hay usuarios activos</p>
        <p className="text-xs text-muted-foreground">Agrega un usuario para que aparezca aquí.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Usuario</th>
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Correo</th>
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Rol</th>
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Registro</th>
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Contraseña</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr
              key={usuario.nombre_usuario}
              className={`border-b border-border last:border-0 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? '' : 'bg-muted/10'
                }`}
            >
              {/* Usuario */}
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary uppercase">
                      {usuario.nombre_usuario.slice(0, 2)}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{usuario.nombre_usuario}</span>
                </div>
              </td>

              {/* Correo */}
              <td className="px-5 py-3.5 text-muted-foreground">{usuario.correo}</td>

              {/* Rol */}
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROL_COLORS[usuario.nombre_rol] ?? 'bg-muted text-muted-foreground'
                  }`}>
                  {usuario.nombre_rol}
                </span>
              </td>

              {/* Fecha */}
              <td className="px-5 py-3.5 text-muted-foreground">{formatFecha(usuario.fecha_creacion)}</td>

              {/* Debe cambiar password */}
              <td className="px-5 py-3.5">
                {usuario.debe_cambiar_password ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Pendiente
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Actualizada
                  </span>
                )}
              </td>

              {/* Acciones */}
              <td className="px-5 py-3.5">
                <div className="relative flex justify-end">
                  <button
                    onClick={(e) => handleMenu(e, usuario.nombre_usuario)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Dropdown */}
                  {menuAbierto === usuario.nombre_usuario && createPortal(
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(null)} />
                      <div
                        className="fixed z-50 w-44 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                        style={{ top: menuPos.top, left: menuPos.left }}
                      >
                        <button
                          onClick={() => { onUpdate(usuario); setMenuAbierto(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Pencil size={14} className="text-muted-foreground" />
                          Modificar
                        </button>
                        {/* }
                        <button
                          onClick={() => handleArchivar(usuario)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Archive size={14} className="text-muted-foreground" />
                          Deshabilitar
                        </button>
                        {*/}
                        <div className="border-t border-border" />
                        <button
                          onClick={() => handleEliminar(usuario)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={handleConfirm}
        titulo={confirmModal?.tipo === 'eliminar' ? 'Eliminar usuario' : 'Archivar usuario'}
        mensaje={`¿Deseas ${confirmModal?.tipo} al usuario ${confirmModal?.usuario.nombre_usuario}? ${confirmModal?.tipo === 'eliminar' ? 'Esta acción no se puede deshacer.' : ''
          }`}
        labelConfirmar={confirmModal?.tipo === 'eliminar' ? 'Eliminar' : 'Archivar'}
        variante={confirmModal?.tipo === 'eliminar' ? 'danger' : 'warning'}
      />
    </div>
  );
}