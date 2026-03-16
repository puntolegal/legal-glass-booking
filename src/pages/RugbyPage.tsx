import React from 'react';
import {
  ShieldCheck,
  FileText,
  Scale,
  Users,
  Building2,
  Home,
  ArrowRight,
  CheckCircle2,
  User,
  Phone,
  MessageCircle,
  Activity,
  Briefcase,
  Car,
  Stethoscope,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';

/* --- COMPONENTE: PASAPORTE DEPORTIVO (TARJETA DE IDENTIDAD DEL JUGADOR) --- */
const PasaporteDeportivo = ({ 
  nombre, 
  rut, 
  habilitadoARUSA, 
  seguroActivo,
  numeroJugador 
}: { 
  nombre: string; 
  rut: string; 
  habilitadoARUSA: boolean; 
  seguroActivo: boolean;
  numeroJugador: number;
}) => {
  return (
    <div className="relative w-full max-w-[380px] mx-auto group perspective-1000" style={{ aspectRatio: '1.586 / 1' }}>
      {/* Glow de fondo sutil */}
      <div className="absolute -inset-2 bg-[#002147]/20 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative h-full w-full bg-white/90 backdrop-blur-3xl border-2 border-[#002147]/20 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,33,71,0.08)] overflow-hidden flex flex-col justify-between">
        
        {/* FILIGRANA DE SEGURIDAD */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-25deg] font-serif text-4xl font-black text-[#002147]">
          RUGBY UC
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black tracking-[0.3em] text-slate-400 uppercase">Pasaporte Deportivo</span>
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-tighter">Plantel Adulto</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#002147]/10 border border-[#002147]/20 rounded-full">
            <div className={`h-1 w-1 rounded-full ${habilitadoARUSA ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <span className={`text-[7px] font-black ${habilitadoARUSA ? 'text-emerald-600' : 'text-amber-600'} uppercase tracking-widest`}>
              {habilitadoARUSA ? 'Habilitado' : 'Pendiente'}
            </span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex items-center gap-6 z-10">
          <div className="w-20 h-24 bg-[#002147]/5 border-2 border-[#002147]/20 rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-black text-[#002147]/40">#{numeroJugador}</div>
            <User className="text-[#002147]/30" size={40} />
            <div className={`absolute bottom-0 inset-x-0 h-1 ${habilitadoARUSA ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-[#002147] tracking-tight leading-none">{nombre}</p>
            <p className="text-xs font-mono text-slate-400">{rut}</p>
            <div className="mt-2 flex flex-col gap-1.5">
              <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                habilitadoARUSA 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}>
                <CheckCircle2 size={10} className={habilitadoARUSA ? 'text-emerald-500' : 'text-amber-500'} /> 
                ARUSA {habilitadoARUSA ? 'Activo' : 'En Trámite'}
              </div>
              <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                seguroActivo 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-600 border border-red-500/20'
              }`}>
                <ShieldCheck size={10} className={seguroActivo ? 'text-emerald-500' : 'text-red-500'} /> 
                Seguro {seguroActivo ? 'Vigente' : 'Vencido'}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-end z-10">
          <div className="text-[7px] text-slate-400 font-bold leading-relaxed uppercase">
            Club Deportivo<br/>Universidad Católica
          </div>
          <div className="h-10 w-10 bg-[#002147]/5 border border-[#002147]/20 rounded-lg p-1.5 shadow-sm opacity-60">
            <Award className="text-[#002147] w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RugbyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Punto Legal Sports - Rugby UC | Seguridad Legal para el Plantel"
        description="Seguridad legal automatizada para el plantel adulto de Rugby UC. Eximentes de responsabilidad, defensa en ARUSA y gestión de seguros médicos."
      />

      <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] font-sans selection:bg-[#002147]/10 safe-area-inset">
        {/* NAVBAR SIMPLE */}
        <nav className="w-full bg-white border-b-2 border-[#002147] py-3 px-4 sm:py-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Scale className="text-[#002147] flex-shrink-0" size={20} />
            <h1 className="text-sm sm:text-base md:text-lg font-serif font-black text-[#002147] tracking-tight uppercase">
              PUNTO LEGAL SPORTS
            </h1>
          </div>
        </nav>

        {/* HERO SECTION - PRIMERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#002147] tracking-tight mb-4 sm:mb-6 leading-tight">
              Ustedes ganen en la cancha.<br className="hidden sm:block" />
              <span className="text-[#002147]/80"> Nosotros en el escritorio.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
              Seguridad legal automatizada para el plantel adulto de Rugby. Eximentes de responsabilidad, defensa en ARUSA y gestión de seguros médicos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <a
                href="#staff"
                className="w-full sm:w-auto bg-[#002147] hover:bg-[#001529] active:bg-[#001529] text-white py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 sm:gap-4 shadow-xl shadow-[#002147]/20 group min-h-[52px] active:scale-[0.98]"
              >
                <span>Portal Directiva / Staff</span>
                <ArrowRight size={18} className="group-active:translate-x-1 transition-transform flex-shrink-0" />
              </a>
              <a
                href="#jugadores"
                className="w-full sm:w-auto bg-transparent border-2 border-[#002147] hover:bg-[#002147]/5 active:bg-[#002147]/10 text-[#002147] py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 sm:gap-4 min-h-[52px] active:scale-[0.98]"
              >
                <span>Hub del Camarín</span>
                <Users size={18} className="flex-shrink-0" />
              </a>
            </div>
          </div>
        </section>

        {/* DASHBOARD DEMO - DESPUÉS DEL HERO */}
        <section className="bg-white border-y-2 border-[#002147]/10 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-start">
              {/* COLUMNA IZQUIERDA: PASAPORTE DEPORTIVO */}
              <div className="lg:col-span-7">
                <PasaporteDeportivo
                  nombre="Juan Pablo Fernández"
                  rut="18.234.567-8"
                  habilitadoARUSA={true}
                  seguroActivo={true}
                  numeroJugador={12}
                />
              </div>

              {/* COLUMNA DERECHA: PANEL DE CONTROL */}
              <div className="lg:col-span-5">
                <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-3xl sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-400 mb-2">
                      Estado del Plantel
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#002147] tracking-tight">28</span>
                      <span className="text-lg sm:text-xl text-[#475569] font-bold">de 30</span>
                    </div>
                    <p className="text-sm sm:text-base text-[#475569] mt-2">Jugadores Habilitados</p>
                  </div>

                  {/* BARRA DE PROGRESO */}
                  <div className="mb-6 sm:mb-8">
                    <div className="h-3 sm:h-4 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: '93.3%' }}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">93.3% de disponibilidad</p>
                  </div>

                  {/* ESTADÍSTICAS RÁPIDAS */}
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#002147]">ARUSA Activos</p>
                          <p className="text-[10px] sm:text-xs text-slate-500">28 jugadores</p>
                        </div>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-emerald-600">28</span>
                    </div>

                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Clock size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#002147]">En Trámite</p>
                          <p className="text-[10px] sm:text-xs text-slate-500">2 jugadores</p>
                        </div>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-amber-600">2</span>
                    </div>

                    <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-[#002147]/10 flex items-center justify-center">
                          <ShieldCheck size={16} className="text-[#002147]" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#002147]">Seguros Vigentes</p>
                          <p className="text-[10px] sm:text-xs text-slate-500">30 jugadores</p>
                        </div>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-[#002147]">30</span>
                    </div>
                  </div>

                  {/* BOTÓN DE ACCESO RÁPIDO */}
                  <div className="mt-6 sm:mt-8">
                    <a
                      href="https://wa.me/56962321883?text=Hola,%20quiero%20acceder%20al%20dashboard%20del%20plantel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#002147] hover:bg-[#001529] active:bg-[#001529] text-white py-3 sm:py-4 px-6 rounded-xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-lg group"
                    >
                      <MessageCircle size={16} />
                      <span>Acceso Directo</span>
                      <ArrowRight size={16} className="group-active:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DIRECTIVA/STAFF - BLINDAJE INSTITUCIONAL */}
        <section id="staff" className="bg-white border-y-2 border-[#002147]/10 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#002147] tracking-tight mb-4 sm:mb-6">
                Blindaje Institucional.<br />
                <span className="text-[#002147]/80">Marzo a costo cero.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto">
                Arrancamos la pretemporada y los amistosos. Asumimos la gestión legal de <strong className="text-[#002147] font-black">marzo a cambio de indumentaria y liberación de cuota</strong>, para que prueben el sistema sin tocar el presupuesto. Luego, pasamos al retainer mensual de <strong className="text-[#002147]">$450.000</strong>.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span className="text-sm font-black text-emerald-700 uppercase tracking-wide">Marzo sin costo - Solo canje</span>
              </div>
            </div>

            {/* GRID DE MÓDULOS B2B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12">
              {/* 1. Pack de Arranque */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <FileText size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Pack de Arranque</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Firma masiva de eximentes de responsabilidad (Waivers) y cesión de derechos de imagen para redes y auspicios.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Incluido en mes de prueba</span>
                </div>
              </div>

              {/* 2. Seguro ARUSA */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Seguro ARUSA</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Defensa disciplinaria express. Redacción de descargos en 48 hrs ante tarjetas rojas para no perder titulares.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <Clock size={16} className="text-emerald-500" />
                  <span>Respuesta en 48 horas</span>
                </div>
              </div>

              {/* 3. Protocolo Médico */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Stethoscope size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Protocolo Médico</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Flujograma de acción clara frente a lesiones para activar el seguro catastrófico sin demoras.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <Activity size={16} className="text-emerald-500" />
                  <span>Activación inmediata</span>
                </div>
              </div>

              {/* 4. Viáticos y Becas */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Viáticos y Becas</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Estructuración legal de apoyos económicos a jugadores para evitar riesgos laborales a fin de año.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Compliance garantizado</span>
                </div>
              </div>
            </div>

            {/* CTA DIRECTIVA */}
            <div className="text-center">
              <a
                href="https://wa.me/56962321883?text=Hola,%20quiero%20activar%20el%20servicio%20de%20seguridad%20legal%20para%20Rugby%20UC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 sm:gap-4 bg-[#002147] hover:bg-[#001529] active:bg-[#001529] text-white py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#002147]/20 group min-h-[52px] active:scale-[0.98]"
              >
                <MessageCircle size={18} />
                <span>Activar Seguridad del Plantel ($450.000/mes)</span>
                <ArrowRight size={18} className="group-active:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* SECCIÓN JUGADORES - HUB LEGAL DEL CAMARÍN */}
        <section id="jugadores" className="bg-[#F1F5F9] py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#002147] tracking-tight mb-4 sm:mb-6">
                Tu abogado personal,<br />
                <span className="text-[#002147]/80">dentro del camarín.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto">
                Servicio exclusivo y gratuito para miembros del plantel. Consultas rápidas y orientación legal para tus negocios e inversiones.
              </p>
            </div>

            {/* GRID DE MÓDULOS B2C */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12">
              {/* 1. Clínico y Auspicios */}
              <div className="bg-white border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Award size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Clínico y Auspicios</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Revisión de contratos con marcas de suplementos (filtro anti-doping/CNAD) y protección de derechos de imagen personal.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Gratis para plantel</span>
                </div>
              </div>

              {/* 2. Emprendedores y Locales */}
              <div className="bg-white border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Building2 size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Emprendedores y Locales</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Línea directa para dueños de restaurantes o pymes del equipo. Dudas laborales, finiquitos y contratos de proveedores.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <Phone size={16} className="text-emerald-500" />
                  <span>Respuesta en 24h</span>
                </div>
              </div>

              {/* 3. Profesionales */}
              <div className="bg-white border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Briefcase size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Profesionales</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Transición de boleta de honorarios a SpA para blindar patrimonio personal (Kinesiólogos, Ingenieros, etc.).
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Estructuración completa</span>
                </div>
              </div>

              {/* 4. Inmobiliario / Automotriz */}
              <div className="bg-white border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Car size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Inmobiliario / Automotriz</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Revisión rápida de contratos de arriendo y compra de vehículos usados para evitar estafas.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <AlertCircle size={16} className="text-emerald-500" />
                  <span>Protección garantizada</span>
                </div>
              </div>
            </div>

            {/* CTA JUGADORES */}
            <div className="text-center">
              <a
                href="https://wa.me/56962321883?text=Hola,%20soy%20jugador%20del%20plantel%20y%20quiero%20acceder%20al%20Hub%20del%20Camarín"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 sm:gap-4 bg-transparent border-2 border-[#002147] hover:bg-[#002147]/5 active:bg-[#002147]/10 text-[#002147] py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.2em] transition-all min-h-[52px] active:scale-[0.98]"
              >
                <MessageCircle size={18} />
                <span>Ingresar al Hub del Camarín</span>
                <ArrowRight size={18} className="group-active:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER CORPORATIVO */}
        <footer className="bg-white border-t-2 border-[#002147]/10 py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-full">
              <p className="text-[10px] sm:text-[11px] text-[#001529] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] mb-2 sm:mb-3">
                Punto Legal El Golf SpA
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 max-w-xs font-medium leading-relaxed px-2 sm:px-0">
                Operado por Punto Legal El Golf SpA. Plataforma de gestión legal y deportiva · 2026.
              </p>
            </div>
            <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
              <Scale className="text-[#002147]" size={24} />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RugbyPage;
