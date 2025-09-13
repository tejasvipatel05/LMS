import PatronLayout from '@/components/patron/PatronLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PatronLayout>{children}</PatronLayout>
}