import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search } from 'lucide-react'
import { filterMockAddresses, type MockOrienteAddress } from '@/constants/inmobiliarioMockAddresses'
import { cn } from '@/lib/utils'

type InmobiliarioAddressStepProps = {
  disabled: boolean
  onConfirm: (row: MockOrienteAddress) => void
  /** Panel oscuro tipo ventana sobre fondo claro (iOS / escritorio). */
  panel?: boolean
  previewRow?: MockOrienteAddress | null
}

export function InmobiliarioAddressStep({
  disabled,
  onConfirm,
  panel,
  previewRow,
}: InmobiliarioAddressStepProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const suggestions = useMemo(() => filterMockAddresses(query, 7), [query])

  useEffect(() => {
    setHighlight(0)
  }, [query, suggestions.length])

  const pick = useCallback(
    (row: MockOrienteAddress) => {
      setOpen(false)
      setQuery(row.label)
      onConfirm(row)
    },
    [onConfirm],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || suggestions.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlight((h) => Math.min(suggestions.length - 1, h + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlight((h) => Math.max(0, h - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const row = suggestions[highlight]
        if (row) pick(row)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    },
    [open, suggestions, highlight, pick],
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className={cn(
            'pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2',
            panel ? 'text-slate-500' : 'text-slate-400',
          )}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 160)}
          onKeyDown={onKeyDown}
          placeholder="Ej. Av. Apoquindo, Alonso de Córdova…"
          autoComplete="off"
          className={cn(
            'w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-offset-0',
            panel
              ? 'border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/45 focus:ring-emerald-500/20'
              : 'border-slate-200/90 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-300/50',
          )}
        />
        <AnimatePresence>
          {open && suggestions.length > 0 && (
            <motion.ul
              id={listId}
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className={cn(
                'absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border py-1 shadow-xl backdrop-blur-xl',
                panel
                  ? 'border-white/10 bg-slate-950/90 ring-1 ring-white/5'
                  : 'border-slate-200/90 bg-white/95 ring-1 ring-slate-100',
              )}
            >
              {suggestions.map((row, i) => (
                <li key={row.id} role="option" aria-selected={i === highlight}>
                  <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                      'flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors',
                      i === highlight
                        ? panel
                          ? 'bg-emerald-500/15 text-white'
                          : 'bg-slate-100 text-slate-900'
                        : panel
                          ? 'text-slate-200 hover:bg-white/5'
                          : 'text-slate-700 hover:bg-slate-50',
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(row)}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    <span className="leading-snug">{row.label}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {previewRow && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 ring-1 ring-emerald-500/15"
          >
            <div className="relative h-32 w-full overflow-hidden">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `linear-gradient(rgba(52,211,153,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)`,
                  backgroundSize: '14px 14px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-emerald-300/90">
                    Georreferencia orientativa
                  </p>
                  <p className="truncate text-xs font-medium text-slate-100">{previewRow.label}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end text-[9px] tabular-nums text-slate-400">
                  <span>{previewRow.lat}</span>
                  <span>{previewRow.lng}</span>
                </div>
              </div>
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-400/75 bg-slate-950/80 shadow-[0_0_24px_rgba(52,211,153,0.3)]">
                  <MapPin className="h-5 w-5 text-emerald-200" aria-hidden />
                </div>
                <motion.div
                  className="absolute inset-0 -m-3 rounded-full border border-emerald-400/25"
                  animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] leading-relaxed text-slate-500">
        Búsqueda asistida en Sector Oriente. Seleccione una dirección sugerida para fijar comuna y referencia del
        activo.
      </p>
    </div>
  )
}
