import {
    LayoutDashboard, FolderOpen, Clock, Star, FileText
  } from 'lucide-react';
  
  export type Page = 'inicio' | 'mis-archivos' | 'recientes' | 'destacados' | 'mi-archivo';
  
  export interface NavItem {
    id: Page;
    label: string;
    icon: React.ReactNode;
  }
  
  export const NAV_ITEMS: NavItem[] = [
    { id: 'inicio',       label: 'Página principal', icon: <LayoutDashboard size={18} /> },
    { id: 'mis-archivos', label: 'Mis archivos',      icon: <FolderOpen size={18} /> },
    { id: 'recientes',    label: 'Recientes',          icon: <Clock size={18} /> },
    { id: 'destacados',   label: 'Destacados',         icon: <Star size={18} /> },
    { id: 'mi-archivo',   label: 'Mi archivo',         icon: <FileText size={18} /> },
  ];
  
  export const PAGE_CONTENT: Record<Page, { title: string; description: string }> = {
    'inicio':       { title: 'Página principal',  description: 'Resumen general del sistema, estadísticas y actividad reciente.' },
    'mis-archivos': { title: 'Mis archivos',       description: 'Expedientes y documentos que has creado o tienes asignados.' },
    'recientes':    { title: 'Recientes',           description: 'Archivos y expedientes a los que accediste recientemente.' },
    'destacados':   { title: 'Destacados',          description: 'Documentos marcados como favoritos para acceso rápido.' },
    'mi-archivo':   { title: 'Mi archivo',          description: 'Tu expediente personal y configuración de perfil clínico.' },
  };