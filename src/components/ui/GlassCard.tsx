import { cn } from '@/lib/utils'

type Props = React.PropsWithChildren<{ className?: string }>

export function GlassCard({ className, children }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-sm',
        'bg-white/70 dark:bg-zinc-900/60',
        'border-white/30 dark:border-white/10',
        'shadow-sm',
        'p-4 xs:p-5',
        className
      )}
    >
      {children}
    </div>
  )
}
