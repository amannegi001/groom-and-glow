import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CONTACT } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mt-3 text-muted-foreground">
                Call or message us to book, or ask about our services. We&apos;re
                happy to help.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:+91${CONTACT.phone}`}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-12 rounded-full px-6 text-sm',
                  )}
                >
                  <Phone className="size-4" />
                  Call Us
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'h-12 rounded-full border-[#25D366]/40 bg-[#25D366]/10 px-6 text-sm text-[#128C4A] hover:bg-[#25D366]/20',
                  )}
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <dl className="flex flex-col gap-4">
              <ContactRow
                icon={Phone}
                label="Phone / WhatsApp"
                value={CONTACT.phoneDisplay}
              />
              <ContactRow
                icon={Clock}
                label="Opening Hours"
                value={CONTACT.hours}
              />
              <ContactRow
                icon={MapPin}
                label="Location"
                value="Location details coming soon"
              />
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-background text-[color:var(--rose)]">
        <Icon className="size-5" />
      </span>
      <div>
        <dt className="text-xs tracking-wide text-muted-foreground uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 font-medium">{value}</dd>
      </div>
    </div>
  )
}
