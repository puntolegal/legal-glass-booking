import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileHeaderProps {
  title?: string
  onBack?: () => void
  showBack?: boolean
}

export function MobileHeader({ title, onBack, showBack = true }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-zinc-950/60 border-b border-white/20 px-3 py-2">
      <div className="flex items-center gap-2 min-h-[48px]">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Volver"
            className="p-2 -m-2 rounded-lg focus-visible:ring-2 h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {title || 'Punto Legal'}
        </h1>
      </div>
    </header>
  )
}
