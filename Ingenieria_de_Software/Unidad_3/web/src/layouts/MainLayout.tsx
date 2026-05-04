import { useState } from 'react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PageContent from "../components/PageContent";
import type { Page } from "../types/navigation";

export default function MainLayout() {
  const [activePage, setActivePage] = useState<Page>('inicio');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <PageContent activePage={activePage} />
      </div>
    </div>
  );
}