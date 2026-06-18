import { createServerSupabase, TENANT_ID } from '@/lib/supabase-server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Política de Cookies' }

export default async function CookiesPage() {
  const supabase = await createServerSupabase()
  const { data: tenant } = await supabase.from('tenants').select('name').eq('id', TENANT_ID).single()
  const { data: config } = await supabase.from('store_config').select('logo_url, whatsapp_number, notification_email').eq('tenant_id', TENANT_ID).single()
  const storeName = tenant?.name ?? 'TIENDA'

  return (
    <>
      <Navbar storeName={storeName} logoUrl={config?.logo_url} />
      <main className="pt-32 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 pb-24">
          <h1 className="font-display text-4xl font-light text-[var(--color-charcoal)] mb-8">Política de Cookies</h1>
          <div className="prose prose-sm text-[var(--color-stone)] space-y-6 font-light leading-relaxed">
            <p>
              Esta página está en construcción. Próximamente encontrarás aquí nuestra política de cookies.
            </p>
            <p>
              Para consultas, contactanos en: {config?.whatsapp_number || config?.notification_email || 'nuestros canales de contacto'}.
            </p>
          </div>
        </div>
      </main>
      <Footer storeName={storeName} whatsapp={config?.whatsapp_number ?? ''} email={config?.notification_email ?? ''} />
    </>
  )
}
