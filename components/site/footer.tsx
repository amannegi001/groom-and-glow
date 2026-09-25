import Link from 'next/link'
import { Clock, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/logo'
import { CONTACT } from '@/lib/data'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-12 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-12 lg:gap-16">
          <div className="sm:col-span-6 lg:col-span-5">
            <Logo imgClassName="h-12 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A modern unisex salon offering professional beauty, grooming, and
              self-care treatments in a comfortable and welcoming environment.
            </p>
          </div>

          <nav
            aria-label="Footer Navigation"
            className="grid grid-cols-2 gap-8 sm:col-span-6 sm:gap-12 lg:col-span-7 lg:grid-cols-2"
          >
            <div>
              <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Explore
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                <li>
                  <a
                    href="#services"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Reach Us
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                <li>
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:text-[#128C4A] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <MessageCircle className="size-4 text-[#25D366]" />
                    <span>{CONTACT.phoneDisplay || CONTACT.phone}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-3.5 text-[color:var(--rose)]" />
                  <span>{CONTACT.hours}</span>
                </li>
                <li className="pt-1">
                  <Link
                    href="/admin"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Admin Portal →
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>Unisex Beauty &amp; Grooming Salon</p>
          <p>© 2026 Groom &amp; Glow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

