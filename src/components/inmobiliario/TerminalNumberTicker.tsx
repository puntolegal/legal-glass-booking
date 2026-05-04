import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

type TerminalNumberTickerProps = {
  value: number
  className?: string
  duration?: number
  suffix?: string
  prefix?: string
  formatThousands?: boolean
}

/**
 * Cuenta de 0 → value cuando entra en viewport (labor illusion / terminal).
 */
export function TerminalNumberTicker({
  value,
  className = '',
  duration = 1.15,
  suffix = '',
  prefix = '',
  formatThousands = false,
}: TerminalNumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-24px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  const text = formatThousands
    ? display.toLocaleString('es-CL')
    : String(display)

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
