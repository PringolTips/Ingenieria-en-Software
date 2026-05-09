import { useState } from 'react';
import { Mail, Activity, Shield, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem('email_reset', email);
      sessionStorage.setItem('tipo_reset', email.includes('@') ? 'email' : 'usuario');
      navigate('/password_change');
    } catch (err: any) {
      toast.error('Ocurrió un error, intenta de nuevo.');
    }
  };

  return (
    <div className="size-full flex bg-background">

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-[#1565C0] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-semibold text-white tracking-tight">DIGICLIN</h1>
          </div>
          <p className="text-blue-100 text-lg ml-[60px]">Sistema de Gestión Clínica</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4 leading-tight">
              Recupera el acceso<br />a tu cuenta
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Ingresa tu correo electrónico y te guiaremos para restablecer tu contraseña de forma segura.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Proceso seguro</h3>
                <p className="text-blue-100 text-sm">Tu información está protegida en todo momento</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Verifica tu identidad</h3>
                <p className="text-blue-100 text-sm">Usamos tu correo registrado para validarte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">DIGICLIN</h1>
              <p className="text-sm text-muted-foreground">Gestión Clínica</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-2">Restablecer contraseña</h2>
            <p className="text-muted-foreground">
              Ingresa el correo electrónico asociado a tu cuenta para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Continuar
            </button>

            <div className="flex justify-center">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}