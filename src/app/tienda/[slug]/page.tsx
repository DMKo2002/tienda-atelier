import { createServerSupabase, TENANT_ID } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AddToCartButton from '@/components/shop/AddToCartButton'
import { ImageOff } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('products').select('name, description').eq('slug', params.slug).single()
  return { title: data?.name ?? 'Producto' }
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default async function ProductoPage({ params }: Props) {
  const supabase = await createServerSupabase()

  const { data: tenant } = await supabase.from('tenants').select('name').eq('id', TENANT_ID).single()
  const { data: config } = await supabase.from('store_config').select('logo_url, whatsapp_number, notification_email').eq('tenant_id', TENANT_ID).single()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(*), variants(*, price_rules(*))')
    .eq('tenant_id', TENANT_ID)
    .eq('slug', params.slug)
    .eq('active', true)
    .single()

  if (!product) notFound()

  const images = product.product_images ?? []
  const cover = images.find((i: any) => i.is_cover) ?? images[0]
  const storeName = tenant?.name ?? 'TIENDA'

  // Agrupar variantes por talle y color
  const sizes = [...new Set((product.variants ?? []).map((v: any) => v.size).filter(Boolean))]
  const colors = [...new Set((product.variants ?? []).map((v: any) => v.color).filter(Boolean))]

  return (
    <>
      <Navbar storeName={storeName} logoUrl={config?.logo_url} />

      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            {/* Galería de imágenes */}
            <div className="space-y-3">
              {/* Imagen principal */}
              <div className="aspect-[3/4] bg-[#F2EEE9] overflow-hidden">
                {cover ? (
                  <img src={cover.url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff size={40} className="text-[var(--color-border)]" />
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img: any) => (
                    <div key={img.id} className="aspect-square bg-[#F2EEE9] overflow-hidden">
                      <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info del producto */}
            <div className="py-4">
              {/* Breadcrumb */}
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-6">
                Tienda / {product.name}
              </p>

              <h1 className="font-display text-4xl font-light text-[var(--color-charcoal)] leading-tight mb-6">
                {product.name}
              </h1>

              {/* Precio */}
              <div className="mb-8">
                {product.variants?.[0]?.price_rules?.find((p: any) => p.type === 'retail' && p.active) && (
                  <p className="text-2xl font-light text-[var(--color-charcoal)]">
                    {formatPrice(product.variants[0].price_rules.find((p: any) => p.type === 'retail' && p.active).price)}
                  </p>
                )}
                {product.variants?.[0]?.price_rules?.find((p: any) => p.type === 'wholesale' && p.active) && (
                  <p className="text-sm text-[var(--color-stone)] mt-1">
                    Precio mayorista: {formatPrice(product.variants[0].price_rules.find((p: any) => p.type === 'wholesale' && p.active).price)}
                    <span className="ml-1 text-xs">
                      (x{product.variants[0].price_rules.find((p: any) => p.type === 'wholesale' && p.active).min_qty}+)
                    </span>
                  </p>
                )}
              </div>

              {/* Separador */}
              <div className="w-full h-px bg-[var(--color-border)] mb-8" />

              {/* Selector de variante + agregar al carrito */}
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  variants: product.variants ?? [],
                  coverUrl: cover?.url ?? null,
                }}
                sizes={sizes as string[]}
                colors={colors as string[]}
              />

              {/* Separador */}
              <div className="w-full h-px bg-[var(--color-border)] my-8" />

              {/* Descripción */}
              {product.description && (
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">Descripción</p>
                  <p className="text-sm text-[var(--color-stone)] leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              )}

              {/* WhatsApp */}
              {config?.whatsapp_number && (
                <div className="mt-8">
                  <a
                    href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}?text=Hola! Me interesa el producto: ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] hover:text-[var(--color-charcoal)] transition-colors border-b border-[var(--color-border)] pb-1"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer storeName={storeName} whatsapp={config?.whatsapp_number ?? ''} email={config?.notification_email ?? ''} />
    </>
  )
}
