  import React, { useState } from 'react';
  import {
    ShieldCheck,
    FileText,
    Scale,
    MapPin,
    Fingerprint,
    Building2,
    Home,
    ArrowRight,
    Info,
    ExternalLink,
    CheckCircle2,
    User,
  } from 'lucide-react';
  import SEO from '@/components/SEO';

  /* --- COMPONENTE: TARJETA DE IDENTIDAD TERRITORIAL (SWISS SILK) --- */
  const IdentityCard = ({ type }: { type: 'front' | 'back' }) => {
    return (
      <div className="relative w-full max-w-[380px] mx-auto group perspective-1000" style={{ aspectRatio: '1.586 / 1' }}>
        {/* Glow de fondo sutil */}
        <div className="absolute -inset-2 bg-white/40 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative h-full w-full bg-white/70 backdrop-blur-3xl border border-white/80 rounded-[28px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between">
          
          {/* FILIGRANA DE SEGURIDAD (Watermark) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-25deg] font-serif text-4xl font-black">
            CERTEZA JURÍDICA
          </div>

          {type === 'front' ? (
            <>
              {/* LADO FRONTAL: IDENTIDAD Y AUTORIDAD */}
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black tracking-[0.3em] text-slate-400 uppercase">Protocolo de Certeza</span>
                  <h3 className="text-sm font-bold text-[#002147] uppercase tracking-tighter">Habilitación Territorial</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Admisible CGR</span>
                </div>
              </div>

              <div className="flex items-center gap-6 z-10">
                <div className="w-20 h-24 bg-white border border-slate-100 rounded-xl shadow-inner flex items-center justify-center relative overflow-hidden">
                  <User className="text-slate-200" size={40} />
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500/50" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-[#002147] tracking-tight leading-none">Juan Pablo Fernandez</p>
                  <p className="text-xs font-mono text-slate-400">18.234.567-8</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-2 py-0.5 bg-[#002147]/5 rounded text-[8px] font-bold text-[#002147] uppercase">
                    <CheckCircle2 size={10} className="text-emerald-500" /> Expediente Verificado
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end z-10">
                <div className="text-[7px] text-slate-400 font-bold leading-relaxed uppercase">
                  Art. 21B Ley 10.336<br/>Auditoría Punto Legal El Golf
                </div>
                <div className="h-10 w-10 bg-white border border-slate-100 rounded-lg p-1.5 shadow-sm opacity-60">
                  <Fingerprint className="text-[#002147] w-full h-full" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* LADO TRASERO: EL VALOR ECONÓMICO (EL GATILLO) */}
              <div className="z-10">
                <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">Liquidación Estimada de Fondos 2026</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] text-slate-500 italic">Bono Recuperación (Interior)</span>
                    <span className="text-xs font-bold text-[#002147]">$1.500.000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] text-slate-500 italic">Emergencia SERCOTEC</span>
                    <span className="text-xs font-bold text-[#002147]">$8.000.000</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#002147]/5 p-2 rounded-lg">
                    <span className="text-[10px] font-black text-[#002147] uppercase">Corfo Semilla Inicia</span>
                    <span className="text-xs font-black text-[#002147]">$15.000.000</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 z-10">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Total Habilitado</span>
                    <span className="text-xl font-mono font-black text-[#002147]">$24.500.000</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                    <Scale className="text-[#002147]" size={20} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const PortalReconstruccionPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'persona' | 'empresa'>('persona');

    return (
      <>
        <SEO
          title="Portal de Habilitación Jurídica - Punto Legal"
          description="Sistema de validación de admisibilidad para fondos de reconstrucción regional. Compatible con Ley 19.880 y Decreto 76."
        />

        <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] font-sans selection:bg-[#002147]/10 safe-area-inset">
          {/* HEADER INSTITUCIONAL LIMPIO (ESTILO GOBIERNO DE CHILE) - OPTIMIZADO MÓVIL */}
          <header className="w-full bg-white border-b-2 border-[#002147] py-3 px-4 sm:py-4 sm:px-6 md:px-8 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <Scale className="text-[#002147] flex-shrink-0" size={20} />
                <div className="flex flex-col min-w-0">
                  <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-serif font-black text-[#002147] tracking-tight leading-tight uppercase truncate">
                    PUNTO LEGAL CHILE
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#64748B] uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-0.5">
                    División de Habilitación Territorial
                  </span>
                </div>
                <div className="hidden lg:flex items-center gap-4 border-l border-slate-200 pl-6 ml-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#64748B] uppercase">Protocolo Activo</span>
                    <span className="text-[11px] font-bold text-[#001529]">Catástrofe 2026 · Zona Sur</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-[#F1F5F9] border border-slate-200 text-[9px] sm:text-[10px] font-black text-[#001529] uppercase tracking-tighter whitespace-nowrap">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span className="hidden xs:inline">Art. 8 letra c · Ley 19.886</span>
                  <span className="xs:hidden">Art. 8 c</span>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 py-6 sm:py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start">
              {/* COLUMNA IZQUIERDA: EXPEDIENTE DIGITAL */}
              <div className="lg:col-span-7 order-1 lg:order-1">
                <header className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#001529] tracking-tight mb-3 sm:mb-4 leading-tight">
                    Sistema de Habilitación Jurídica
                  </h2>
                  <p className="text-[#475569] text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
                    Plataforma de certificación de admisibilidad administrativa para fondos de reconstrucción.
                    Validación automatizada bajo estándares de la <strong>Ley 19.880</strong>.
                  </p>
                </header>

                {/* SELECTOR DE RÉGIMEN - OPTIMIZADO MÓVIL */}
                <div className="flex bg-[#E2E8F0] p-1 sm:p-1.5 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 shadow-inner">
                  <button
                    onClick={() => setActiveTab('persona')}
                    className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3.5 sm:py-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-widest transition-all min-h-[44px] active:scale-[0.98] ${
                      activeTab === 'persona'
                        ? 'bg-[#001529] text-white shadow-lg'
                        : 'text-slate-500 active:text-slate-700'
                    }`}
                  >
                    <Home size={14} className="sm:w-4 sm:h-4" /> 
                    <span className="hidden xs:inline">Persona Natural</span>
                    <span className="xs:hidden">Natural</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('empresa')}
                    className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3.5 sm:py-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-widest transition-all min-h-[44px] active:scale-[0.98] ${
                      activeTab === 'empresa'
                        ? 'bg-[#001529] text-white shadow-lg'
                        : 'text-slate-500 active:text-slate-700'
                    }`}
                  >
                    <Building2 size={14} className="sm:w-4 sm:h-4" /> 
                    <span className="hidden xs:inline">Fondo Empresa (FEEC)</span>
                    <span className="xs:hidden">Empresa</span>
                  </button>
                </div>

                {/* FORMULARIO DE ADMISIBILIDAD - OPTIMIZADO MÓVIL */}
                <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                      <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#001529] text-[11px] sm:text-[12px] font-bold text-white shadow-md flex-shrink-0">
                        01
                      </span>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#475569]">
                        Validación Biométrica
                      </h3>
                    </div>
                    <div className="bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 active:border-[#002147] transition-all cursor-pointer group shadow-sm active:scale-[0.99] min-h-[44px]">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-12 sm:h-20 sm:w-14 bg-[#F8FAFC] border-2 border-slate-200 rounded-xl mb-4 sm:mb-6 flex items-center justify-center group-active:scale-105 transition-transform shadow-inner">
                          <Fingerprint className="text-[#002147] opacity-20" size={32} />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-[#001529] leading-tight">Escanear Cédula de Identidad</span>
                        <span className="text-[11px] sm:text-xs text-slate-400 mt-2 max-w-[280px] sm:max-w-[250px] leading-relaxed">
                          Sincronización segura con el Servicio de Registro Civil para extracción de RUT y firma
                          digital Ley 19.799.
                        </span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                      <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#001529] text-[11px] sm:text-[12px] font-bold text-white shadow-md flex-shrink-0">
                        02
                      </span>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#475569]">
                        Prueba Documental
                      </h3>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
                        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col items-center text-center gap-2 sm:gap-3 active:bg-white active:border-[#002147]/20 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]">
                          <FileText className="text-[#002147] flex-shrink-0" size={24} />
                          <p className="text-[10px] sm:text-[11px] font-black text-[#001529] uppercase leading-tight">Carpeta Tributaria</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 italic leading-tight">Pre-auditoría SII / Corfo</p>
                        </div>
                        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col items-center text-center gap-2 sm:gap-3 active:bg-white active:border-[#002147]/20 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]">
                          <MapPin className="text-[#002147] flex-shrink-0" size={24} />
                          <p className="text-[10px] sm:text-[11px] font-black text-[#001529] uppercase leading-tight">Dominio Vigente</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 italic leading-tight">Verificación CBR / Posesión</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full bg-[#001529] active:bg-[#002147] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-all flex items-center justify-center gap-3 sm:gap-4 shadow-xl shadow-[#001529]/20 group min-h-[52px] active:scale-[0.98]"
                      >
                        <span className="text-center">Iniciar Certificación de Admisibilidad</span>
                        <ArrowRight size={14} className="sm:w-4 sm:h-4 group-active:translate-x-1 transition-transform flex-shrink-0" />
                      </button>
                    </div>
                  </section>
                </div>
              </div>

              {/* COLUMNA DERECHA: DASHBOARD DE CONTROL (ALCALDE / DIRECTOR) - OPTIMIZADO MÓVIL */}
              <div className="lg:col-span-5 order-2 lg:order-2">
                <aside className="lg:sticky lg:top-24 space-y-5 sm:space-y-6 md:space-y-8">
                  {/* TARJETAS DE IDENTIFICACIÓN TERRITORIAL - SWISS SILK */}
                  <div className="space-y-4 sm:space-y-6">
                    <IdentityCard type="front" />
                    <IdentityCard type="back" />
                  </div>

                  {/* MAPA DE CALOR ESTRATÉGICO - OPTIMIZADO MÓVIL */}
                  <div className="bg-white border-2 border-slate-200 rounded-3xl sm:rounded-[32px] md:rounded-[40px] p-5 sm:p-6 md:p-8 lg:p-10 shadow-sm overflow-hidden relative group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-400">
                          Visor Georreferenciado
                        </h3>
                        <p className="text-[9px] sm:text-[10px] text-emerald-500 font-bold uppercase mt-1 flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" /> 
                          <span className="hidden xs:inline">Sincronización en tiempo real</span>
                          <span className="xs:hidden">Tiempo real</span>
                        </p>
                      </div>
                    </div>

                    <div className="aspect-video bg-[#001529] rounded-2xl sm:rounded-[24px] md:rounded-[32px] overflow-hidden border-2 sm:border-4 border-white shadow-xl sm:shadow-2xl relative grayscale active:grayscale-0 transition-all duration-1000">
                      <div className="absolute inset-0 bg-[url('https://miro.medium.com/v2/resize:fit:1400/1*q6Epxs_C5o9S25XW4PzM_A.png')] bg-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001529]/90 via-transparent to-transparent" />

                      {/* CAPAS DE CALOR (SIMULADAS) */}
                      <div className="absolute top-1/4 left-1/3 h-16 w-16 sm:h-24 sm:w-24 bg-emerald-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
                      <div className="absolute bottom-1/4 right-1/4 h-20 w-20 sm:h-32 sm:w-32 bg-amber-500/10 rounded-full blur-2xl sm:blur-3xl" />

                      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] sm:text-[10px] font-black text-[#C5A065] uppercase tracking-widest mb-1 block underline decoration-1 underline-offset-2 sm:underline-offset-4">
                            Zona 04: Penco Central
                          </span>
                          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
                            92 Familias
                          </span>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="text-[9px] sm:text-[10px] text-white/50 uppercase font-bold tracking-widest mb-0.5 sm:mb-1">
                            Certeza Jurídica
                          </p>
                          <p className="text-lg sm:text-xl font-mono font-bold text-emerald-400">85.4%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </main>

          {/* FOOTER SOBRIO Y LEGAL (SIN CLUTTER) - OPTIMIZADO MÓVIL */}
          <footer className="bg-white border-t border-slate-200 py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 mt-8 sm:mt-10 md:mt-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10 opacity-60 grayscale active:grayscale-0 transition-all duration-700">
              <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-full">
                <p className="text-[10px] sm:text-[11px] text-[#001529] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] mb-2 sm:mb-3">
                  Punto Legal El Golf SpA
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 max-w-xs font-medium leading-relaxed px-2 sm:px-0">
                  Infraestructura blindada bajo estándares de ciberseguridad nacional. Gestión Integral de
                  Admisibilidad Administrativa · 2026.
                </p>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
                <Scale className="text-[#001529]" size={24} />
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  };

  export default PortalReconstruccionPage;

