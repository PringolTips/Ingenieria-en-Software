import { ChevronRight } from "lucide-react";
import { type Page, PAGE_CONTENT } from "../types/navigation";
import { useUser } from '../context/UserContext';
import UserList from './lists/UserList';
import SearchResults from "./lists/SearchResults";

interface PageContentProps {
  activePage: Page;
  onUpdate: (usuario: any) => void;
  refresh: number;
  searchResults: any[];
  isSearching: boolean;
  hasSearched: boolean;
}

export default function PageContent({ activePage, onUpdate, refresh, searchResults, isSearching, hasSearched }: PageContentProps) {
  const { user } = useUser();
  const rol = user?.nombre_rol;
  const currentPage = PAGE_CONTENT[activePage];
  const queryResults = hasSearched;

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
        <span>DIGICLIN</span>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">{currentPage.title}</span>
      </div>

      {/* Header de página */}
      {rol === 'Admin' && activePage === 'inicio' ? (
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-6">
            {queryResults ? 'Resultados de búsqueda' : 'Usuarios activos'}
          </h1>
          {isSearching ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Buscando...
            </div>
          ) : queryResults ? (
            <SearchResults resultados={searchResults} />
          ) : (
            <UserList onUpdate={onUpdate} refresh={refresh} />
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{currentPage.title}</h1>
          <p className="text-muted-foreground mt-1">{currentPage.description}</p>
          {/* placeholder */}
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} DIGICLIN · Todos los derechos reservados
        </p>
      </div>
    </main>
  );
}