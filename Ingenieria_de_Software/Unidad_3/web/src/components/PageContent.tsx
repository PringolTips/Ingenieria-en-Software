import { Activity, ChevronRight } from "lucide-react";
import { type Page, PAGE_CONTENT } from "../types/navigation";

interface PageContentProps {
    activePage: Page;
  }
  
  export default function PageContent({ activePage }: PageContentProps) {
    const currentPage = PAGE_CONTENT[activePage];
    
    return (
        <main className="flex-1 overflow-y-auto p-6 bg-background">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
            <span>DIGICLIN</span>
            <ChevronRight size={12} />
            <span className="text-foreground font-medium">{currentPage.title}</span>
          </div>

          {/* Header de página */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">{currentPage.title}</h1>
            <p className="text-muted-foreground mt-1">{currentPage.description}</p>
          </div>

          {/* Placeholder del contenido */}
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-border bg-card text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Activity size={24} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Contenido de "{currentPage.title}"</p>
            <p className="text-xs text-muted-foreground mt-1">
              Aquí se renderizará el componente correspondiente a esta sección.
            </p>
          </div>
        </main>
    );
  }