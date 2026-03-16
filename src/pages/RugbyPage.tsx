import React from 'react';
import {
  ShieldCheck,
  Scale,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  User,
  Phone,
  MessageCircle,
  Activity,
  Briefcase,
  Car,
  Award,
  Clock,
  AlertCircle,
} from 'lucide-react';
import SEO from '@/components/SEO';

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
            <div className="text-[6px] font-mono text-[#002147]/60 mt-1">Auditado por Punto Legal SpA</div>
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
        title="Punto Legal Sports - Rugby UC | Auditoría y Compliance Legal"
        description="Auditoría y Compliance Legal para el Club Deportivo Universidad Católica. Gestión de riesgo patrimonial, control preventivo ARUSA y compliance deportivo."
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
              Auditoría y Compliance Legal<br className="hidden sm:block" />
              <span className="text-[#002147]/80"> para el Club Deportivo Universidad Católica.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
              Gestión de riesgo patrimonial frente a demandas civiles (Art. 2320 C.C.), control preventivo de sanciones ARUSA y estructuración de compliance deportivo.
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
                <span>Consultorio Legal del Plantel</span>
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
                Seguridad Jurídica Institucional.<br />
                <span className="text-[#002147]/80">Protección del Staff y Directiva.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto">
                Evite que el patrimonio del Club o de sus Preparadores Físicos responda solidariamente ante tribunales por lesiones fortuitas o actos de indisciplina. Implementamos los protocolos y contratos obligatorios que blindan al Headcoach, al Staff Médico y a la Directiva frente a los recientes precedentes jurisprudenciales en el rugby nacional.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
                <CheckCircle2 size={20} className="text-emerald-600" />
                <span className="text-sm font-black text-emerald-700 uppercase tracking-wide">Evaluación de Riesgo a Costo Cero - Modelo de Canje Institucional</span>
              </div>
            </div>

            {/* GRID DE MÓDULOS B2B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12">
              {/* 1. Protección Legal del Staff */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Protección Legal del Staff Técnico y Médico</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Redacción de Acuerdos de Asunción de Riesgo ante lesiones por acondicionamiento físico o contacto. Resguardamos el patrimonio de Preparadores Físicos y Coaches, gestionando el riesgo inherente mediante consentimiento informado.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Mitigación de Riesgo Patrimonial</span>
                </div>
              </div>

              {/* 2. Límite de Cuasidelito Civil */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <AlertCircle size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Límite de Cuasidelito Civil y Responsabilidad Solidaria</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Implementación de Códigos de Conducta y Ética. Mitigamos el riesgo de demandas contra el Club por actos de indisciplina extracurriculares del plantel, delimitando la responsabilidad civil y penal exclusivamente al infractor.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Prevención de Fallos Civiles</span>
                </div>
              </div>

              {/* 3. Compliance Ley 21.197 */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Activity size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Compliance Legal Ley N° 21.197 (Menores)</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Gestión obligatoria del Protocolo contra Abuso y Maltrato para divisiones menores (M10-M18). Administramos las declaraciones juradas de inhabilidad del staff, previniendo sanciones administrativas graves o la suspensión de la personalidad jurídica.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Cumplimiento Ministerio del Deporte</span>
                </div>
              </div>

              {/* 4. Contratos Honorarios e Imagen */}
              <div className="bg-[#F8FAFC] border-2 border-[#002147]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#002147]/30 transition-all group">
                <div className="flex items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#002147] text-white shadow-lg flex-shrink-0">
                    <Briefcase size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#002147] mb-2">Contratos de Honorarios y Derechos de Imagen</h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      Regulación del vínculo civil del Staff Médico/Técnico para evitar demandas laborales por subordinación. Además, gestionamos la cesión obligatoria de derechos de imagen del plantel para respaldar comercialmente los contratos con auspiciadores.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 font-bold">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Auditoría Comercial y Laboral</span>
                </div>
              </div>
            </div>

            {/* BLOQUE ALERTA DE JURISPRUDENCIA */}
            <div className="mt-8 mb-12 bg-white border-2 border-red-900/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-red-900/5 px-6 py-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-700 flex-shrink-0" />
                <h3 className="text-lg font-black text-[#002147] uppercase tracking-tight">Alerta de Jurisprudencia Reciente</h3>
              </div>
              <div className="p-6">
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-6">
                  Los tribunales superiores han fallado recientemente contra clubes de rugby nacionales imponiendo indemnizaciones millonarias por daño moral ante actos de indisciplina (ej. bautizos) y lesiones, argumentando &apos;falta de deber de cuidado&apos; e invocando la Responsabilidad por el Hecho Ajeno (Art. 2320 del Código Civil). La gestión preventiva del riesgo contractual es hoy un estándar obligatorio para el Staff.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <p className="text-xs font-mono font-bold text-[#002147]">Art. 2320 C.C.</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Responsabilidad por hecho ajeno</p>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <p className="text-xs font-mono font-bold text-[#002147]">Ley N° 21.197</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Protección menores</p>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <p className="text-xs font-mono font-bold text-[#002147]">Ley N° 19.712</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Deporte y recreación</p>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <p className="text-xs font-mono font-bold text-[#002147]">Ley N° 20.686</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Violencia en estadios</p>
                  </div>
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
                <span>Agendar Evaluación de Riesgo Legal Institucional</span>
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
                Tu abogado dentro del plantel<br />
                <span className="text-[#002147]/80">Rugby UC.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto">
                Servicio exclusivo y gratuito para miembros del plantel. Consultas rápidas y orientación legal para tus negocios e inversiones. Consultorio presencial exclusivo: Jueves de 19:30 a 21:30 hrs en el Quincho del Club.
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
                href="https://wa.me/56962321883?text=Hola,%20soy%20jugador%20del%20plantel%20y%20quiero%20acceder%20al%20Portal%20Legal%20Rugby%20UC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 sm:gap-4 bg-transparent border-2 border-[#002147] hover:bg-[#002147]/5 active:bg-[#002147]/10 text-[#002147] py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.2em] transition-all min-h-[52px] active:scale-[0.98]"
              >
                <MessageCircle size={18} />
                <span>Ingresar Portal Legal Rugby UC</span>
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
