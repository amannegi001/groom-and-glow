import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Logo } from '@/components/logo'
import { CONTACT } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-12 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              A modern unisex salon for beauty, grooming and self-care.
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-12">
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Explore
              </li>
              <li>
                <a href="#services" className="text-foreground/80 transition-colors hover:text-foreground">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-foreground/80 transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="text-foreground/80 transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Reach Us
              </li>
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-foreground"
                >
                  <MessageCircle className="size-4 text-[#25D366]" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="text-muted-foreground">{CONTACT.hours}</li>
              <li>
                <Link
                  href="/admin"
                  className="text-foreground/80 transition-colors hover:text-foreground"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-1 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>Unisex Beauty &amp; Grooming Salon</p>
          <p>© 2026 Groom &amp; Glow</p>
        </div>
      </div>
    </footer>
  )
}
