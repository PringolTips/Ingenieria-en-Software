import {
  Activity, UserPlus, Upload, ChevronRight
} from 'lucide-react';
import { type Page, NAV_ITEMS } from '../types/navigation';
import { type Dispatch, type SetStateAction } from 'react';

interface SidebarProps {
  activePage: Page;
  onNavigate: Dispatch<SetStateAction<Page>>;
}
  
  export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
    return (
        <aside className="w-[16.666%] min-w-[200px] max-w-[260px] h-full bg-card border-r border-border flex flex-col shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Activity size={20} className="text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground tracking-wide leading-none">DIGICLIN</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-none">Gestión Clínica</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="px-4 pt-5 pb-4 flex flex-col gap-2.5 border-b border-border">
          <button className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 px-3 rounded-lg transition-colors">
            <UserPlus size={16} />
            Agregar paciente
          </button>
          <button className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium py-2.5 px-3 rounded-lg transition-colors border border-border">
            <Upload size={16} />
            Subir expediente
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Menú
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                      ${isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight size={14} className="text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="px-4 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            v1.0.0 · DIGICLIN
          </p>
        </div>
      </aside>
    );
  }