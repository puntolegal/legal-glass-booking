import React from 'react';
import { ArrowUpRight, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';

interface PremiumHeroCardProps {
  title: string;
  description: string;
  context?: string;
  price: string;
  priceDetails?: string;
  ctaText: string;
  href: string;
  testimonial: {
    quote: string;
    author: string;
  };
  doorLabel?: string;
  highlightLabel?: string;
  pinEmoji?: string;
  priceTag?: string;
  originalPrice?: string;
  deliverableLabel?: string;
}

const NoiseTexture = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="4"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

export const PremiumHeroCard: React.FC<PremiumHeroCardProps> = ({
  title,
  description,
  context,
  price,
  priceDetails,
  ctaText,
  href,
  testimonial,
  doorLabel,
  highlightLabel,
  pinEmoji,
  priceTag,
  originalPrice,
  deliverableLabel,
}) => {
  return (
    <GlassCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 105 }}
      className="group relative z-10 flex h-full flex-col overflow-hidden
                 border-pink-500/50 bg-slate-950/90 p-5 md:p-6 shadow-2xl shadow-pink-500/30"
    >
      <NoiseTexture />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/30 via-rose-500/10 to-transparent opacity-70" />
      <div className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl mix-blend-screen" />

      {pinEmoji && (
        <div className="absolute -top-4 left-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-500/70 bg-slate-950 text-lg shadow-lg shadow-pink-500/40">
            <span aria-hidden="true">{pinEmoji}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-col">
          <div className="mb-4 flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/40 bg-pink-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-pink-100">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />
              {highlightLabel ?? 'Experiencia Premium'}
            </div>
            {doorLabel && (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">
                {doorLabel}
              </div>
            )}
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/40 via-rose-500/30 to-sky-500/30 text-white shadow-inner shadow-pink-500/40">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-100/80">Atención Experta</p>
              <p className="text-[11px] text-slate-300/80">Tu abogado especializado en 60 minutos</p>
            </div>
          </div>

        <h3 className="text-3xl font-bold text-white md:text-4xl">
          {title}
        </h3>

        <p
          className="mt-3 text-base leading-relaxed text-slate-200 md:line-clamp-4"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        {context && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200/80 md:line-clamp-3">
            {context}
          </div>
        )}
        </div>

        {testimonial && (
          <div className="mt-6 flex flex-col items-end gap-2">
            <div className="relative max-w-sm rounded-3xl rounded-br-[10px] bg-white/10 px-5 py-4 text-left text-slate-100 shadow-[0_20px_45px_rgba(236,72,153,0.25)]">
              <span className="absolute -bottom-2 right-12 h-3 w-3 rotate-45 rounded-sm bg-white/10" />
              <p className="text-sm leading-relaxed">“{testimonial.quote}”</p>
              <span className="absolute -bottom-3 right-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-pink-500 shadow-md">
                ❤️
              </span>
            </div>
            <p className="text-xs font-semibold text-pink-100/80">
              {testimonial.author}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-pink-100/80">
                {priceTag ?? 'Preferente Cyber'}
              </p>
              <div className="text-4xl font-extrabold text-white">{price}</div>
              {originalPrice && (
                <p className="text-sm text-slate-400">
                  <span className="text-slate-500">Valor normal:</span>{' '}
                  <span className="line-through">{originalPrice}</span>
                </p>
              )}
            </div>
            {deliverableLabel && (
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">
                {deliverableLabel}
              </span>
            )}
          </div>

          {priceDetails && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
              {priceDetails}
            </div>
          )}

          <Link
            to={href}
            className="group/cta relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-pink-400/40 bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 px-6 py-3.5 text-base font-semibold uppercase tracking-wide text-white shadow-[0_28px_60px_rgba(236,72,153,0.5)] backdrop-blur-md transition-all hover:-translate-y-0.5"
          >
            {ctaText}
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

export default PremiumHeroCard;
