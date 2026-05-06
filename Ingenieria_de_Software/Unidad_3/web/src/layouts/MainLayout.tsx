import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PageContent from "../components/PageContent";
import type { Page } from "../types/navigation";
import Modal from "../components/Modal";
import FormCreateUser from "../components/forms/FormCreateUser";
import FormUpdateUser from '../components/forms/FormUpdateUser';
import toast from 'react-hot-toast';
import { users_api } from '../api/users_api';

export default function MainLayout() {
  const [activePage, setActivePage] = useState<Page>('inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const refreshList = () => setRefresh(prev => prev + 1);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const esEmail = query.includes('@');
      let results;
      if (esEmail) {
        results = await users_api.getUserByEmail(query);
      } else {
        results = await users_api.getUserByUsername(query);
      }
      setSearchResults(results?.data ? [results.data] : []);
    } catch (err: any) {
      toast.error(err?.message || 'Error en la búsqueda.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} onOpenAddUser={() => setIsUserModalOpen(true)} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onSearch={handleSearch}/>
        <PageContent 
          activePage={activePage} 
          onUpdate={(usuario) => {
          setUsuarioSeleccionado(usuario.nombre_usuario);
          setIsUpdateModalOpen(true);
          }}
          refresh={refresh}
          searchResults={searchResults}
          isSearching={isSearching}
          hasSearched={hasSearched}
        />
      </div>

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Agregar nuevo usuario"
        description="Asigna un rol y correo electrónico para el nuevo miembro."
      >
        <FormCreateUser
          onClose={() => setIsUserModalOpen(false)}
          onSuccess={refreshList}
        />
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Actualizar usuario"
        description="Actualiza los datos del usuario"
      >
        <FormUpdateUser
          onClose={() => setIsUpdateModalOpen(false)}
          onSuccess={refreshList}
          nombreUsuario={usuarioSeleccionado} />
      </Modal>
    </div>
  );
}