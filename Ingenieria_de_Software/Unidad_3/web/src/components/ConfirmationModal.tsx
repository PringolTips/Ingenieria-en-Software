import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  labelConfirmar?: string;
  variante?: 'danger' | 'warning';
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  labelConfirmar = 'Confirmar',
  variante = 'danger',
  loading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colorIcono = variante === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-100 text-yellow-600';
  const colorBoton = variante === 'danger'
    ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    : 'bg-yellow-500 hover:bg-yellow-600 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm bg-card rounded-xl shadow-xl border border-border mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorIcono}`}>
              <AlertTriangle size={18} />
            </div>
            <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mensaje */}
        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{mensaje}</p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${colorBoton}`}
          >
            {loading ? 'Procesando...' : labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}