type InmobiliarioTerminalBackdropProps = {
  scrollY: number
}

/** Retícula tipo plano (visible sobre fondo oscuro civil). */
const BLUEPRINT_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='%2394a3b8' stroke-opacity='0.09' stroke-width='0.6'/%3E%3Cpath d='M24 0v48M0 24h48' fill='none' stroke='%2394a3b8' stroke-opacity='0.06' stroke-width='0.5'/%3E%3C/svg%3E"

/**
 * Ambiente visual alineado a `ServicioPageShell` theme **civil** (landing /inmobiliario):
 * gradiente base, orbes emerald/sky y parallax suave.
 */
export function InmobiliarioTerminalBackdrop({ scrollY }: InmobiliarioTerminalBackdropProps) {
  const y1 = scrollY * 0.06
  const y2 = scrollY * 0.11
  const y3 = scrollY * 0.04

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#061016] to-[#020617]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px), url("${BLUEPRINT_SVG}")`,
          backgroundSize: '56px 56px, 56px 56px, 48px 48px',
        }}
      />
      <div
        className="absolute -left-[20%] top-[-10%] h-[55%] w-[55%] rounded-full opacity-[0.07]"
        style={{
          transform: `translate3d(0, ${y1}px, 0)`,
          background: 'radial-gradient(circle at 40% 40%, rgba(52,211,153,0.22), transparent 55%)',
        }}
      />
      <div
        className="absolute right-[-15%] bottom-[-20%] h-[50%] w-[50%] rounded-full opacity-[0.06]"
        style={{
          transform: `translate3d(0, ${y2}px, 0)`,
          background: 'radial-gradient(circle at 60% 60%, rgba(56,189,248,0.2), transparent 50%)',
        }}
      />
      <div
        className="absolute left-[25%] top-[40%] h-[35%] w-[40%] rounded-full opacity-[0.05]"
        style={{
          transform: `translate3d(0, ${y3}px, 0)`,
          background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.12), transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          transform: `translate3d(0, ${scrollY * 0.02}px, 0)`,
          backgroundImage: `repeating-linear-gradient(
            -12deg,
            transparent,
            transparent 120px,
            rgba(148,163,184,0.08) 120px,
            rgba(148,163,184,0.08) 121px
          )`,
        }}
      />
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-16 p-8 opacity-[0.022] blur-sm select-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="max-w-[14rem] text-[11px] font-medium leading-relaxed text-slate-400"
            style={{ transform: `rotate(${-8 + i * 4}deg)` }}
          >
            CLÁUSULA PRIMERA · DOMINIO · PROMESA DE COMPRAVENTA · INSCRIPCIÓN CONSERVATOR · CBR METROPOLITANO
          </span>
        ))}
      </div>
    </div>
  )
}
