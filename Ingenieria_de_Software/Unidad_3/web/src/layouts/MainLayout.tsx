import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PageContent from "../components/PageContent";
import type { Page } from "../types/navigation";
import Modal from "../components/Modal";
import FormCreateUser from "../components/forms/FormCreateUser";
import FormUpdateUser from '../components/forms/FormUpdateUser';
import FormCreatePatient from '../components/forms/FormCreatePatient';
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
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isPatientLoading, setIsPatientLoading] = useState(false);
  const [isPatientFormComplete, setIsPatientFormComplete] = useState(false);

  const closePatientModal = () => {
    setIsPatientModalOpen(false);
    setIsPatientFormComplete(false);
  }

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
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenAddUser={() => setIsUserModalOpen(true)}
        onOpenAddPatient={() => setIsPatientModalOpen(true)}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />
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

      <Modal
        key={isPatientModalOpen ? 'open' : 'closed'}
        isOpen={isPatientModalOpen}
        onClose={closePatientModal}
        title="Registrar paciente"
        description="Completa los datos del nuevo paciente"
        wide
        actions={
          <>
            <button
              type="button"
              onClick={closePatientModal}
              disabled={isPatientLoading}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="form-patient"
              disabled={isPatientLoading || !isPatientFormComplete}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPatientLoading ? 'Registrando...' : 'Registrar paciente'}
            </button>
          </>
        }
      >
        <FormCreatePatient
          onClose={closePatientModal}
          onSuccess={refreshList}
          onLoadingChange={setIsPatientLoading}
          onFormChange={setIsPatientFormComplete}
        />
      </Modal>
    </div>
  );
}