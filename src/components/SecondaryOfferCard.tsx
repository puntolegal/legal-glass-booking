import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface SecondaryOfferCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  context?: string;
  price: string;
  priceDetails: string;
  ctaText: string;
  href: string;
  badge?: string;
  pinEmoji?: string;
}

export const SecondaryOfferCard: React.FC<SecondaryOfferCardProps> = ({
  icon: Icon,
  title,
  description,
  context,
  price,
  priceDetails,
  ctaText,
  href,
  badge,
  pinEmoji,
}) => {
  return (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="group relative flex h-full flex-col overflow-hidden
                 border-pink-500/20 bg-slate-950/90 p-5 md:p-6 shadow-2xl shadow-black/30"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-sky-500/10 opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.15),_transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {pinEmoji && (
        <div className="absolute -top-4 left-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-pink-500/50 bg-slate-900 text-lg shadow-md shadow-pink-500/40">
            <span aria-hidden="true">{pinEmoji}</span>
          </div>
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          {badge && (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-pink-50">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />
                {badge}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/30 via-pink-500/10 to-transparent text-pink-200 shadow-inner shadow-pink-500/40">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/70">Diagnóstico</p>
              <p className="text-[11px] text-slate-400">Resultados en minutos</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white md:text-3xl">
            {title}
          </h3>

          <p
            className="mt-2 text-sm leading-relaxed text-slate-300 md:text-base md:line-clamp-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {context && (
            <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-xs text-slate-300 md:line-clamp-3">
              {context}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-pink-200/70">Valor preferente</p>
              <div className="text-3xl font-bold text-white md:text-4xl">{price}</div>
            </div>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
              Entrega inmediata
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {priceDetails}
          </p>
        </div>

        <Link
          to={href}
          className="group/cta relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-pink-500/40 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_22px_48px_rgba(236,72,153,0.4)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(236,72,153,0.5)]"
        >
          {ctaText}
          <ArrowUpRight className="h-5 w-5 transition-transform group-hover/cta:translate-x-0.5" />
        </Link>
      </div>
    </GlassCard>
  );
};

export default SecondaryOfferCard;
