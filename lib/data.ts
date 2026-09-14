export type ServiceCategory =
  | 'Body Care'
  | 'Skin Care'
  | 'Nails'
  | 'Hair'
  | 'Grooming'
  | 'Tattoo'

export type Service = {
  id: string
  name: string
  category: ServiceCategory
  description: string
  duration: number // minutes
  price: number // INR
  discount: number // percentage, 0 = none
  active: boolean
  image: string
}

export const CATEGORIES: ServiceCategory[] = [
  'Body Care',
  'Skin Care',
  'Nails',
  'Hair',
  'Grooming',
  'Tattoo',
]

export const services: Service[] = [
  {
    id: 'body-scrub',
    name: 'Body Scrub',
    category: 'Body Care',
    description: 'Gentle exfoliation for soft, refreshed skin.',
    duration: 40,
    price: 1200,
    discount: 0,
    active: true,
    image: '/images/svc-bodyscrub.png',
  },
  {
    id: 'waxing',
    name: 'Waxing',
    category: 'Body Care',
    description: 'Smooth, clean hair removal with premium wax.',
    duration: 30,
    price: 700,
    discount: 10,
    active: true,
    image: '/images/svc-waxing.png',
  },
  {
    id: 'anti-tan',
    name: 'Anti-Tan',
    category: 'Skin Care',
    description: 'Brightening treatment to reduce tan and dullness.',
    duration: 45,
    price: 900,
    discount: 0,
    active: true,
    image: '/images/svc-skincare.png',
  },
  {
    id: 'facial',
    name: 'Facial',
    category: 'Skin Care',
    description: 'Deep-cleansing facial for a healthy glow.',
    duration: 60,
    price: 1500,
    discount: 20,
    active: true,
    image: '/images/svc-facial.png',
  },
  {
    id: 'cleanup',
    name: 'Cleanup',
    category: 'Skin Care',
    description: 'Quick refresh to unclog and revive your skin.',
    duration: 30,
    price: 600,
    discount: 0,
    active: true,
    image: '/images/svc-facial.png',
  },
  {
    id: 'bleach',
    name: 'Bleach',
    category: 'Skin Care',
    description: 'Even out skin tone for a subtle, natural glow.',
    duration: 30,
    price: 500,
    discount: 0,
    active: true,
    image: '/images/svc-skincare.png',
  },
  {
    id: 'manicure',
    name: 'Manicure',
    category: 'Nails',
    description: 'Nail and hand care for a clean, polished finish.',
    duration: 45,
    price: 800,
    discount: 10,
    active: true,
    image: '/images/svc-manicure.png',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    category: 'Nails',
    description: 'Relaxing foot care that leaves feet soft and neat.',
    duration: 50,
    price: 1000,
    discount: 0,
    active: true,
    image: '/images/svc-pedicure.png',
  },
  {
    id: 'nail-artwork',
    name: 'Nail Artwork',
    category: 'Nails',
    description: 'Custom designs to express your personal style.',
    duration: 60,
    price: 1200,
    discount: 20,
    active: true,
    image: '/images/svc-nailart.png',
  },
  {
    id: 'haircut',
    name: 'Haircut',
    category: 'Hair',
    description: 'A precise cut tailored to suit you.',
    duration: 40,
    price: 600,
    discount: 0,
    active: true,
    image: '/images/svc-haircut.png',
  },
  {
    id: 'hair-styling',
    name: 'Hair Styling',
    category: 'Hair',
    description: 'Finished styling for any occasion.',
    duration: 45,
    price: 900,
    discount: 0,
    active: true,
    image: '/images/svc-haircut.png',
  },
  {
    id: 'hair-wash',
    name: 'Hair Wash',
    category: 'Hair',
    description: 'Cleansing wash with a soothing scalp massage.',
    duration: 25,
    price: 400,
    discount: 0,
    active: true,
    image: '/images/svc-haircolor.png',
  },
  {
    id: 'hair-color',
    name: 'Hair Color',
    category: 'Hair',
    description: 'Rich, long-lasting color for a fresh look.',
    duration: 90,
    price: 2200,
    discount: 15,
    active: true,
    image: '/images/svc-haircolor.png',
  },
  {
    id: 'beard-styling',
    name: 'Beard Styling',
    category: 'Grooming',
    description: 'Shape and detailing for a sharp, groomed beard.',
    duration: 30,
    price: 500,
    discount: 0,
    active: true,
    image: '/images/svc-beard.png',
  },
  {
    id: 'tattoo',
    name: 'Tattoo',
    category: 'Tattoo',
    description: 'Custom tattoo artistry by skilled artists.',
    duration: 120,
    price: 3000,
    discount: 0,
    active: true,
    image: '/images/svc-tattoo.png',
  },
]

export function discountedPrice(service: Pick<Service, 'price' | 'discount'>) {
  if (!service.discount) return service.price
  return Math.round(service.price * (1 - service.discount / 100))
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export const CONTACT = {
  phone: '7417158879',
  phoneDisplay: '+91 74171 58879',
  whatsapp: '917417158879',
  hours: '10:00 AM – 8:00 PM',
}

/* ---------------- Admin mock data ---------------- */

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'

export type Appointment = {
  id: string
  customer: string
  phone: string
  service: string
  date: string
  time: string
  duration: number
  price: number
  status: AppointmentStatus
  note?: string
}

export const appointments: Appointment[] = [
  {
    id: 'GG-1042',
    customer: 'Aman',
    phone: '7417158879',
    service: 'Manicure',
    date: '15 Sep 2026',
    time: '4:30 PM',
    duration: 45,
    price: 720,
    status: 'PENDING',
  },
  {
    id: 'GG-1041',
    customer: 'Priya',
    phone: '9876543210',
    service: 'Facial',
    date: '15 Sep 2026',
    time: '11:00 AM',
    duration: 60,
    price: 1200,
    status: 'PENDING',
    note: 'Sensitive skin',
  },
  {
    id: 'GG-1040',
    customer: 'Rahul',
    phone: '9812345678',
    service: 'Haircut',
    date: '15 Sep 2026',
    time: '12:30 PM',
    duration: 40,
    price: 600,
    status: 'PENDING',
  },
  {
    id: 'GG-1039',
    customer: 'Sneha',
    phone: '9911223344',
    service: 'Nail Artwork',
    date: '15 Sep 2026',
    time: '2:00 PM',
    duration: 60,
    price: 960,
    status: 'CONFIRMED',
  },
  {
    id: 'GG-1038',
    customer: 'Karan',
    phone: '9090909090',
    service: 'Beard Styling',
    date: '15 Sep 2026',
    time: '5:00 PM',
    duration: 30,
    price: 500,
    status: 'CONFIRMED',
  },
  {
    id: 'GG-1037',
    customer: 'Meera',
    phone: '9345678123',
    service: 'Hair Color',
    date: '15 Sep 2026',
    time: '10:00 AM',
    duration: 90,
    price: 1870,
    status: 'CONFIRMED',
  },
  {
    id: 'GG-1036',
    customer: 'Devansh',
    phone: '9765432101',
    service: 'Pedicure',
    date: '15 Sep 2026',
    time: '3:30 PM',
    duration: 50,
    price: 1000,
    status: 'CONFIRMED',
  },
  {
    id: 'GG-1035',
    customer: 'Ananya',
    phone: '9123456780',
    service: 'Cleanup',
    date: '14 Sep 2026',
    time: '6:00 PM',
    duration: 30,
    price: 600,
    status: 'COMPLETED',
  },
]

export type InventoryStatus = 'Good' | 'Low' | 'Out'

export type InventoryItem = {
  id: string
  name: string
  quantity: number
  status: InventoryStatus
}

export const inventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Nail Polish', quantity: 24, status: 'Good' },
  { id: 'inv-2', name: 'Scrub Cream', quantity: 3, status: 'Low' },
  { id: 'inv-3', name: 'Gloves', quantity: 50, status: 'Good' },
  { id: 'inv-4', name: 'Facial Kit', quantity: 12, status: 'Good' },
  { id: 'inv-5', name: 'Hair Color Tubes', quantity: 4, status: 'Low' },
  { id: 'inv-6', name: 'Cotton Rolls', quantity: 40, status: 'Good' },
  { id: 'inv-7', name: 'Wax Beans', quantity: 0, status: 'Out' },
]
