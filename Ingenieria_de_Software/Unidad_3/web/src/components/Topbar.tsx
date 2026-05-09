import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Bell, LogOut, ChevronDown, } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import toast from 'react-hot-toast';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
}

export default function Topbar({ searchQuery, onSearchChange, onSearch }: TopbarProps) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder = user?.nombre_rol === 'Admin'
    ? 'Buscar usuarios...'
    : 'Buscar pacientes, expedientes...';

  // ── Cierra el menú al hacer clic fuera ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Bloquea el botón de atrás del navegador ─────────────────────────────
  useEffect(() => {
    // Agrega una entrada extra al historial para "atrapar" el botón de atrás
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // Cuando el usuario presiona atrás, vuelve a empujar el estado
      window.history.pushState(null, '', window.location.href);
      setModalLogout(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Sesión cerrada correctamente.');
    navigate('/');
  };

  return (
    <>
      <header className="h-[65px] shrink-0 bg-card border-b border-border px-6 flex items-center gap-4">

        {/* Barra de búsqueda */}
        <div className="flex-1 flex items-center gap-2 max-w-xl">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { onSearchChange(e.target.value); }}
              onKeyDown={(e) => {
                if(e.key === 'Enter') onSearch(inputRef.current?.value ?? '');
              }}
              ref={inputRef}
              placeholder={placeholder}
              className="w-150 pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <button 
            onClick={() => onSearch(inputRef.current?.value ?? '')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0">
            <Search size={15} />
            Buscar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0">
            <SlidersHorizontal size={15} />
            Filtrar
          </button>
        </div>

        <div className="flex-1" />

        {/* Notificaciones */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* Menú de usuario */}
        <div className="relative pl-3 border-l border-border" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-3 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs font-semibold uppercase">
                {user?.nombre_usuario?.slice(0, 2) ?? 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-foreground leading-none">
                {user?.nombre_usuario ?? 'Usuario'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-none">
                {user?.nombre_rol ?? ''}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform ${menuAbierto ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {menuAbierto && (
            <div className="absolute right-0 top-14 z-50 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden">

              {/* Info del usuario */}
              <div className="px-4 py-3.5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground text-sm font-semibold uppercase">
                      {user?.nombre_usuario?.slice(0, 2) ?? 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.nombre_usuario ?? 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.nombre_rol ?? ''}
                    </p>
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {user?.correo ?? ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cerrar sesión */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setMenuAbierto(false);
                    setModalLogout(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              </div>

            </div>
          )}
        </div>
      </header>

      {/* Modal de confirmación de logout */}
      <ConfirmationModal
        isOpen={modalLogout}
        onClose={() => setModalLogout(false)}
        onConfirm={handleLogout}
        titulo="Cerrar sesión"
        mensaje="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a ingresar tus credenciales."
        labelConfirmar="Cerrar sesión"
        variante="danger"
      />
    </>
  );
}