import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, Activity } from 'lucide-react';
import { api } from './api';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await api.login(email, password);

      if (data.data.token) {
        toast.success('Login exitoso, bienvenido!');
        navigate("/dashboard");
        console.log(data.data);
      }

    } catch (err: any) {
      const mensaje = err?.message;
      toast.error(mensaje);
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    handleLogin();
  };

  return (
    <div className="size-full flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-[#1565C0] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        </div>

        {/* Content */}
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
              Gestión profesional de<br />expedientes clínicos
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Plataforma integral para profesionales de la salud. Accede de forma segura a la información de tus pacientes.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Datos protegidos</h3>
                <p className="text-blue-100 text-sm">Encriptación de extremo a extremo</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Acceso en tiempo real</h3>
                <p className="text-blue-100 text-sm">Consulta expedientes desde cualquier lugar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">DIGICLIN</h1>
              <p className="text-sm text-muted-foreground">Gestión Clínica</p>
            </div>
          </div>

          {/* Login Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-2">Iniciar sesión</h2>
            <p className="text-muted-foreground">
              Accede de forma segura a la gestión de pacientes y expedientes clínicos
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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
              <div>
                <label id="msg_wrongCred" className="block text-sm font-small text-foreground mb-2 text-red-900 py-3" hidden>
                    Credenciales incorrectas
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/password_change"
                onClick={() => sessionStorage.setItem('email_reset', email)}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Ingresar
            </button>


          </form>
        </div>
      </div>
    </div>
  );
}