import React from 'react';
import type { LucideIcon } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  context?: string;
  price: string;
  ctaText: string;
  onClick: () => void;
  badge?: string;
  pinEmoji?: string;
  buttonClassName?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  icon: Icon,
  title,
  description,
  context,
  price,
  ctaText,
  onClick,
  badge,
  pinEmoji,
  buttonClassName,
}) => {
  return (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="group relative flex h-full flex-col overflow-hidden
                 border-slate-800/80 bg-slate-950/80 p-5 md:p-6 shadow-xl shadow-black/30 backdrop-blur-2xl
                 hover:border-slate-700/70"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl mix-blend-screen" />
      <div className="pointer-events-none absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-pink-500/15 blur-3xl mix-blend-screen" />

      {pinEmoji && (
        <div className="absolute right-4 top-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-xl shadow-inner shadow-black/40">
            <span>{pinEmoji}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full text-left">
        {badge && (
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-sky-200/80 text-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
              {badge}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-inner shadow-black/40">
              <Icon className="h-6 w-6 text-sky-300" />
            </div>
            <div className="hidden flex-col text-[10px] uppercase tracking-[0.3em] text-slate-500/80 md:flex">
              <span>Orientación</span>
              <span className="text-[9px] tracking-[0.2em] text-slate-400/80">En minutos</span>
            </div>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400/80">
            Paso 1
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold tracking-tight text-white md:text-2xl">
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed text-slate-400 md:text-base md:line-clamp-4"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {context && (
          <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-[11px] text-slate-400 md:text-xs md:leading-relaxed md:line-clamp-3">
            {context}
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-3xl font-bold text-white">{price}</div>
              <p className="text-[11px] text-slate-400">Sin compromiso y sin tarjetas</p>
            </div>
            <div className="hidden text-right text-[11px] uppercase tracking-[0.3em] text-slate-400 md:block">
              <span>Respuesta</span>
              <span className="block text-slate-300/70">Automática</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClick}
            className={`group/button mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-transparent bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all
                       shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 hover:scale-[1.02]
                       ${buttonClassName ?? ''}`}
          >
            <span>{ctaText}</span>
            <span className="text-lg transition-transform group-hover/button:translate-x-1">↗</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ToolCard;
