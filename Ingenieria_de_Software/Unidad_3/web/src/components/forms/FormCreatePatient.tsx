import { useEffect, useState } from 'react';
import { User, Calendar, CreditCard, Home, Heart, Mail, Briefcase, Phone, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { patients_api } from '../../api/patients_api';

interface FormCreatePatientProps {
  onClose: () => void;
  onSuccess?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  onFormChange?: (isComplete: boolean) => void;
}

const SEXOS = ['Masculino', 'Femenino'];
const ESTADOS_CIVIL = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Separado'];
const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const inputClass = `
  w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
  placeholder:text-muted-foreground
`;

const selectClass = `
  w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm
  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors
  appearance-none
`;

const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide";

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, icon, children }: FieldProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function FormCreatePatient({ onClose, onSuccess, onLoadingChange, onFormChange }: FormCreatePatientProps) {
  const [nombre_p, setNombre_p] = useState('');
  const [apellido_pat, setApellido_pat] = useState('');
  const [apellido_mat, setApellido_mat] = useState('');
  const [fecha_nacimiento, setFecha_nacimiento] = useState('');
  const [nombre_sexo, setNombre_sexo] = useState('');
  const [curp, setCurp] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [nombre_estado_civil, setNombre_estado_civil] = useState('');
  const [correo, setCorreo] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contacto_emergencia, setContacto_emergencia] = useState('');
  const [nombre_tipo_sangre, setNombre_tipo_sangre] = useState('');

  useEffect(() => {
    const isComplete = [
      nombre_p, apellido_pat, apellido_mat,
      fecha_nacimiento, nombre_sexo, curp,
      domicilio, nombre_estado_civil, correo,
      ocupacion, telefono, contacto_emergencia,
      nombre_tipo_sangre
    ].every(v => v.trim() !== '');
    onFormChange?.(isComplete);
  }, [nombre_p, apellido_pat, apellido_mat, fecha_nacimiento, nombre_sexo,
      curp, domicilio, nombre_estado_civil, correo, ocupacion, telefono,
      contacto_emergencia, nombre_tipo_sangre]);

  const setLoadingState = (value: boolean) => {
    onLoadingChange?.(value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    console.log(nombre_p,
      apellido_pat,
      apellido_mat,
      fecha_nacimiento,
      nombre_sexo,
      curp,
      domicilio,
      nombre_estado_civil,
      correo,
      ocupacion,
      telefono,
      contacto_emergencia,
      nombre_tipo_sangre)
    try {
      await patients_api.createPatient(
        nombre_p,
        apellido_pat,
        apellido_mat,
        fecha_nacimiento,
        nombre_sexo,
        curp,
        domicilio,
        nombre_estado_civil,
        correo,
        ocupacion,
        telefono,
        contacto_emergencia,
        nombre_tipo_sangre
      );
      toast.success('Paciente registrado exitosamente.');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form id="form-patient" onSubmit={handleSubmit} className="space-y-5">

      {/* Sección: Datos personales */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-primary inline-block" />
          Datos personales
          <span className="flex-1 h-px bg-border inline-block" />
        </p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Nombre" icon={<User size={14} />}>
            <input type="text" value={nombre_p} onChange={(e) => setNombre_p(e.target.value)}
              placeholder="Nombre" className={inputClass} required />
          </Field>
          <Field label="Apellido paterno" icon={<User size={14} />}>
            <input type="text" value={apellido_pat} onChange={(e) => setApellido_pat(e.target.value)}
              placeholder="Apellido paterno" className={inputClass} required />
          </Field>
          <Field label="Apellido materno" icon={<User size={14} />}>
            <input type="text" value={apellido_mat} onChange={(e) => setApellido_mat(e.target.value)}
              placeholder="Apellido materno" className={inputClass} required />
          </Field>
        </div>
      </div>

      {/* Sección: Información médica */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-primary inline-block" />
          Información médica
          <span className="flex-1 h-px bg-border inline-block" />
        </p>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Fecha de nacimiento" icon={<Calendar size={14} />}>
            <input type="date" value={fecha_nacimiento} onChange={(e) => setFecha_nacimiento(e.target.value)}
              className={inputClass} required />
          </Field>
          <Field label="Sexo" icon={<User size={14} />}>
            <select value={nombre_sexo} onChange={(e) => setNombre_sexo(e.target.value)} className={selectClass} required>
              <option value="" disabled>Selecciona</option>
              {SEXOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Tipo de sangre" icon={<Heart size={14} />}>
            <select value={nombre_tipo_sangre} onChange={(e) => setNombre_tipo_sangre(e.target.value)} className={selectClass} required>
              <option value="" disabled>Selecciona</option>
              {TIPOS_SANGRE.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="CURP" icon={<CreditCard size={14} />}>
            <input type="text" value={curp} onChange={(e) => setCurp(e.target.value)}
              placeholder="CURP" className={inputClass} maxLength={18} required />
          </Field>
        </div>
      </div>

      {/* Sección: Contacto */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-primary inline-block" />
          Contacto y personal
          <span className="flex-1 h-px bg-border inline-block" />
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Correo electrónico" icon={<Mail size={14} />}>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com" className={inputClass} required />
          </Field>
          <Field label="Teléfono" icon={<Phone size={14} />}>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
              placeholder="10 dígitos" className={inputClass} required />
          </Field>
          <Field label="Ocupación" icon={<Briefcase size={14} />}>
            <input type="text" value={ocupacion} onChange={(e) => setOcupacion(e.target.value)}
              placeholder="Ocupación" className={inputClass} required />
          </Field>
          <Field label="Estado civil" icon={<Heart size={14} />}>
            <select value={nombre_estado_civil} onChange={(e) => setNombre_estado_civil(e.target.value)} className={selectClass} required>
              <option value="" disabled>Selecciona</option>
              {ESTADOS_CIVIL.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Sección: Domicilio y emergencia */}
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-primary inline-block" />
          Domicilio y emergencia
          <span className="flex-1 h-px bg-border inline-block" />
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Domicilio" icon={<Home size={14} />}>
            <input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)}
              placeholder="Calle, número, colonia" className={inputClass} required />
          </Field>
          <Field label="Contacto de emergencia" icon={<AlertCircle size={14} />}>
            <input type="text" value={contacto_emergencia} onChange={(e) => setContacto_emergencia(e.target.value)}
              placeholder="Nombre y teléfono" className={inputClass} required />
          </Field>
        </div>
      </div>



    </form>
  );
}