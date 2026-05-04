import { Bell, Search, SlidersHorizontal } from "lucide-react";

interface TopbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
  }
  
  export default function Topbar({ searchQuery, onSearchChange }: TopbarProps) {
    return (
        <header className="h-[65px] shrink-0 bg-card border-b border-border px-6 flex items-center gap-4">

          {/* Barra de búsqueda */}
          <div className="flex-1 flex items-center gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar pacientes, expedientes..."
                className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors shrink-0">
              <SlidersHorizontal size={15} />
              Filtrar
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Notificaciones */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* Usuario */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs font-semibold">DR</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-none">Dr. Ramírez</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-none">Médico General</p>
            </div>
          </div>
        </header>
    );
  }