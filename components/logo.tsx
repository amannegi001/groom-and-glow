import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  showTagline?: boolean
  tone?: 'default' | 'light'
}

export function Logo({
  className,
  showTagline = true,
  tone = 'default',
}: LogoProps) {
  const isLight = tone === 'light'
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-full border font-serif text-base leading-none',
          isLight
            ? 'border-white/40 text-white'
            : 'border-rose/40 text-[color:var(--rose)]',
        )}
      >
        G
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-serif text-lg font-semibold tracking-tight',
            isLight ? 'text-white' : 'text-[color:var(--espresso)]',
          )}
        >
          Groom <span className="text-[color:var(--rose)]">&amp;</span> Glow
        </span>
        {showTagline && (
          <span
            className={cn(
              'mt-1 text-[9px] font-medium tracking-[0.22em] uppercase',
              isLight ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            Unisex Beauty &amp; Grooming Salon
          </span>
        )}
      </span>
    </span>
  )
}
