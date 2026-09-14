import { HeartHandshake, Sparkles, Users } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'Professional Care',
    text: 'Skilled, friendly experts across every service.',
  },
  {
    icon: HeartHandshake,
    title: 'Quality Services',
    text: 'Premium products and hygienic treatments.',
  },
  {
    icon: Users,
    title: 'Welcoming for Everyone',
    text: 'A comfortable, unisex space for all.',
  },
]

export function About() {
  return (
    <section id="about" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-1 overflow-hidden rounded-[2rem] shadow-lg ring-1 ring-black/5 lg:order-none">
          <img
            src="/images/about-interior.png"
            alt="The welcoming reception area of Groom and Glow salon"
            className="aspect-4/3 w-full object-cover"
          />
        </div>

        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            About Groom &amp; Glow
          </h2>
          <p className="mt-4 text-muted-foreground">
            Groom &amp; Glow is a modern unisex beauty and grooming salon
            offering professional beauty, nail, skincare and grooming services
            in a comfortable and welcoming environment.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary/50 text-[color:var(--burgundy)]">
                  <h.icon className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
