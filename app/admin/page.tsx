import type { Metadata } from 'next'
import { AdminApp } from '@/components/admin/admin-app'

export const metadata: Metadata = {
  title: 'Admin — Groom & Glow',
  description: 'Groom & Glow salon admin dashboard.',
}

export default function AdminPage() {
  return <AdminApp />
}
