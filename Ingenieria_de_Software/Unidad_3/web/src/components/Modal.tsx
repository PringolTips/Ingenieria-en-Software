// src/components/Modal.tsx
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
  actions?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, description, children, wide, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative z-10 w-full bg-card rounded-xl shadow-xl border border-border mx-4 ${wide ? 'max-w-4xl' : 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contenido — lo que sea que le pases */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}