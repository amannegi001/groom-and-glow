import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  imgClassName?: string
  showTagline?: boolean
  tone?: 'default' | 'light'
}

export function Logo({ className, imgClassName, tone = 'default' }: LogoProps) {
  const isLight = tone === 'light'
  return (
    <span className={cn('inline-flex items-center shrink-0', className)}>
      <img
        src="/logo.png"
        alt="Groom &amp; Glow"
        className={cn(
          'h-10 sm:h-11 w-auto object-contain shrink-0',
          isLight && 'brightness-0 invert',
          imgClassName,
        )}
      />
    </span>
  )
}
