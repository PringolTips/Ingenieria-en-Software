import { useState, useEffect } from 'react';
import { api } from "./api"
import { Eye, EyeOff, Lock, Activity, ShieldCheck, KeyRound } from 'lucide-react';

export default function PassChange() {
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [password_actual, setpassword_actual]     = useState('');
  const [password_nueva, setpassword_nueva]             = useState('');
  const [confirmar_password_nueva, setconfirmar_password_nueva]     = useState('');
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailGuardado = sessionStorage.getItem('email_reset');
    console.log("Ya llegamos");
    if (emailGuardado) {
      setEmail(emailGuardado);
      sessionStorage.removeItem('email_reset'); 
      console.log(emailGuardado);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password_nueva !== confirmar_password_nueva) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    if (password_nueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    console.log(email, password_actual, password_nueva, confirmar_password_nueva);
    const data = await api.changePassword(email, password_actual, password_nueva, confirmar_password_nueva);
    if(data.data){
        setSuccess(true);
    }
  };

  return (
    <div className="size-full flex bg-background">

      {/* ── Panel izquierdo ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-[#1565C0] p-12 flex-col justify-between relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-semibold text-white tracking-tight">DIGICLIN</h1>
          </div>
          <p className="text-blue-100 text-lg ml-[60px]">Sistema de Gestión Clínica</p>
        </div>

        {/* Contenido inferior */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4 leading-tight">
              Mantén tu cuenta<br />siempre segura
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Actualiza tu contraseña periódicamente para proteger el acceso a los expedientes clínicos de tus pacientes.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Acceso protegido</h3>
                <p className="text-blue-100 text-sm">Solo tú puedes cambiar tu contraseña</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Contraseña segura</h3>
                <p className="text-blue-100 text-sm">Mínimo 8 caracteres recomendados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel derecho — formulario ──────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">DIGICLIN</h1>
              <p className="text-sm text-muted-foreground">Gestión Clínica</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-2">Actualizar contraseña</h2>
            <p className="text-muted-foreground">
              Ingresa tu contraseña actual y elige una nueva para continuar.
            </p>
          </div>

          {/* Estado de éxito */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">¡Contraseña actualizada!</p>
                <p className="text-muted-foreground text-sm mt-1">Tu contraseña fue cambiada exitosamente.</p>
              </div>
              <a
                href="/"
                className="mt-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Volver al inicio de sesión
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Contraseña actual */}
              <div>
                <label htmlFor="current" className="block text-sm font-medium text-foreground mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="current"
                    type={showCurrent ? 'text' : 'password'}
                    value={password_actual}
                    onChange={(e) => setpassword_actual(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div>
                <label htmlFor="new" className="block text-sm font-medium text-foreground mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="new"
                    type={showNew ? 'text' : 'password'}
                    value={password_nueva}
                    onChange={(e) => setpassword_nueva(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-foreground mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmar_password_nueva}
                    onChange={(e) => setconfirmar_password_nueva(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Guardar contraseña
              </button>

              {/* Volver */}
              <div className="text-center">
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Volver al inicio de sesión
                </a>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}