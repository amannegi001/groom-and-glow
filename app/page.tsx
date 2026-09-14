import { BookingProvider } from '@/components/booking/booking-context'
import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { Services } from '@/components/site/services'
import { Offers } from '@/components/site/offers'
import { About } from '@/components/site/about'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'
import { MobileCta } from '@/components/site/mobile-cta'

export default function Page() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Offers />
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
    </BookingProvider>
  )
}
