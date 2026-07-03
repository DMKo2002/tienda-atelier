import { cookies } from 'next/headers'
import { createServerSupabase, TENANT_ID } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/shop/ProductCard'
import HeroThumbnails from '@/components/shop/HeroThumbnails'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const COLLECTION_PALETTES = [
  { bg: '#E8E0D8', text: '#1A1A1A' },
  { bg: '#D8E0E8', text: '#1A1A1A' },
  { bg: '#D8E8DE', text: '#1A1A1A' },
]

const BLOG_DEFAULTS = [
  {
    title: 'Tendencias de temporada',
    excerpt: 'Descubrí las piezas clave que definen la moda de esta temporada y cómo combinarlas para crear looks únicos.',
    bg: '#E8E4DC',
  },
  {
    title: 'Guía de talles y ajuste',
    excerpt: 'Todo lo que necesitás saber para elegir el talle perfecto y conseguir el ajuste ideal en cada prenda.',
    bg: '#D8DDE8',
  },
  {
    title: 'Cuidado de prendas',
    excerpt: 'Consejos esenciales para mantener tus prendas favoritas en perfecto estado temporada tras temporada.',
    bg: '#D8E8D8',
  },
]

export default async function HomePage() {
  // cookies() debe llamarse ANTES de cualquier await
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.getAll().some(c => c.name.includes('-auth-token') && c.value.length > 10)

  const supabase = await createServerSupabase()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, domain')
    .eq('id', TENANT_ID())
    .single()

  const { data: config } = await supabase
    .from('store_config')
    .select('logo_url, hero_image_url, hero_eyebrow, hero_title_line1, hero_title_italic, hero_title_line3, hero_subtitle, hero_season, hero_text_color, nav_text_color, collection_text_color, collection_posts, blog_heading, blog_subheading, blog_posts, newsletter_bg_color, whatsapp_number, notification_email, instagram_url, facebook_url, tiktok_url, pickup_address, pickup_enabled, branches, price_visibility')
    .eq('tenant_id', TENANT_ID())
    .single()

  const { data: assetsRows } = await supabase
    .from('store_assets')
    .select('slot, url')
    .eq('tenant_id', TENANT_ID())

  const asset = (slot: string): string | null =>
    assetsRows?.find(a => a.slot === slot)?.url ?? null

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, product_images(*), variants(price_rules(*))')
    .eq('tenant_id', TENANT_ID())
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('tenant_id', TENANT_ID())
    .eq('active', true)
    .order('sort_order')
    .limit(3)

  const storeName = tenant?.name ?? 'ATELIER'
  const priceVisibility = (config as any)?.price_visibility ?? 'all'
  const showPrices = priceVisibility === 'all' || (priceVisibility === 'logged_in' && isLoggedIn)

  // Título y bajada de cada banner: si el tenant los cargó a mano en el panel,
  // tienen prioridad sobre el nombre de categoría automático.
  const rawCollectionPosts = (config as any)?.collection_posts
  const collections = Array.from({ length: 3 }, (_, i) => ({
    name: rawCollectionPosts?.[i]?.title || (categories as any)?.[i]?.name || ['Nueva Colección', 'Accesorios', 'Ropa'][i],
    subtitle: rawCollectionPosts?.[i]?.subtitle || 'Piezas seleccionadas para esta temporada.',
    slug: (categories as any)?.[i]?.slug ?? ['nueva-coleccion', 'accesorios', 'ropa'][i],
    palette: COLLECTION_PALETTES[i],
  }))

  const heroEyebrow = (config as any)?.hero_eyebrow ?? 'Fashion Exclusive Collection'
  const heroLine1   = (config as any)?.hero_title_line1 ?? 'Nueva'
  // Renglón 2 (itálica) — compat: si el tenant todavía tiene el viejo campo
  // "línea 3" sin fusionar en el panel, lo sumamos acá para no perder el texto.
  const heroItalicBase = (config as any)?.hero_title_italic ?? 'Temporada'
  const heroLegacyLine3 = (config as any)?.hero_title_line3 ?? ''
  const heroItalic  = heroLegacyLine3 ? `${heroItalicBase} ${heroLegacyLine3}`.trim() : heroItalicBase
  const heroSeason  = (config as any)?.hero_season ?? 'AW'
  const heroSubtitle = (config as any)?.hero_subtitle ?? 'Piezas únicas diseñadas para\nquienes buscan estilo y distinción.'
  const customColor = (config as any)?.hero_text_color
  const heroImgUrl  = asset('hero_main') ?? config?.hero_image_url ?? null
  // Color de texto de Colecciones: editable por tenant. Si no se configuró,
  // mantiene el comportamiento anterior (blanco sobre imagen, negro sin imagen).
  const collectionTextColor = (config as any)?.collection_text_color || null

  // Blog: título/bajada de la sección + título y texto de cada nota, editables en el panel.
  const blogHeading = (config as any)?.blog_heading || 'Fashion news & tips'
  const blogSubheading = (config as any)?.blog_subheading || 'Todo sobre moda, tendencias y cuidado de prendas'
  const rawBlogPosts = (config as any)?.blog_posts
  const today = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const blogPosts = BLOG_DEFAULTS.map((def, i) => ({
    title: rawBlogPosts?.[i]?.title || def.title,
    excerpt: rawBlogPosts?.[i]?.excerpt || def.excerpt,
    bg: def.bg,
    date: today,
  }))

  const newsletterBgColor = (config as any)?.newsletter_bg_color || '#DBD1BA'

  return (
    <>
      <Navbar
        storeName={storeName}
        logoUrl={config?.logo_url}
        instagramUrl={(config as any)?.instagram_url ?? undefined}
        facebookUrl={(config as any)?.facebook_url ?? undefined}
        tiktokUrl={(config as any)?.tiktok_url ?? undefined}
        textColor={(config as any)?.nav_text_color ?? undefined}
      />

      <main>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative w-full bg-[#F0EFEC] overflow-hidden" style={{ height: '100vh' }}>

          {/* Imagen principal — 100% en mobile, 81% en desktop */}
          <div className="absolute left-0 top-0 bottom-0 w-full md:w-[81%] overflow-hidden group/hero">
            {heroImgUrl ? (
              <img
                src={heroImgUrl}
                alt="Hero"
                className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/hero:scale-[1.12]"
              />
            ) : (
              <div className="w-full h-full bg-[#E0D8CE]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-l from-black/45 via-transparent to-transparent" />

            {/* Thumbnails + flechas — clickeables, intercambian las 2 fotos entre sí */}
            <HeroThumbnails thumb1={asset('hero_thumb_1')} thumb2={asset('hero_thumb_2')} />

            {/* Texto hero — centrado en mobile, alineado a la izquierda desde md */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center md:inset-x-auto md:left-[64%] md:px-0 md:max-w-xl md:text-left z-10">
              <p
                className="text-xs tracking-[0.25em] uppercase mb-4"
                style={customColor ? { color: customColor + 'B3' } : { color: 'rgba(26,26,26,0.7)' }}
              >
                {heroEyebrow}
              </p>
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 md:whitespace-nowrap"
                style={customColor ? { color: customColor } : { color: '#1A1A1A' }}
              >
                {heroLine1}<br />
                {heroItalic}
              </h1>
              <p
                className="text-sm mb-7 font-light leading-relaxed whitespace-pre-line"
                style={customColor ? { color: customColor + 'CC' } : { color: 'rgba(26,26,26,0.8)' }}
              >
                {heroSubtitle}
              </p>
              <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                <Link
                  href="/tienda"
                  className="inline-block bg-[var(--color-black)] text-white text-xs tracking-[0.15em] uppercase px-6 py-3 hover:bg-[#333333] transition-colors"
                >
                  Ver colección
                </Link>
                <Link
                  href="/tienda"
                  className="text-xs tracking-[0.15em] uppercase border-b pb-0.5 hover:opacity-70 transition-opacity"
                  style={customColor ? { color: customColor, borderColor: customColor + '99' } : { color: '#1A1A1A', borderColor: 'rgba(26,26,26,0.6)' }}
                >
                  Tienda
                </Link>
              </div>
            </div>
          </div>

          {/* Zona derecha 19% — solo en desktop, en mobile no hay espacio para ella */}
          <div className="hidden md:flex absolute right-0 top-0 bottom-0 items-center justify-center bg-[#F0EFEC] w-[19%]">
            <p className="text-[#1A1A1A]/10 font-bold text-4xl tracking-[0.3em] uppercase -rotate-90 whitespace-nowrap select-none">
              {heroSeason}
            </p>
          </div>
        </section>

        {/* ── FEATURES BAR ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Envío gratis', desc: 'En compras que superen el monto mínimo. Entrega rápida y segura a todo el país.' },
              { title: 'Devoluciones', desc: 'Tenés 14 días para devolver o cambiar tu pedido si no quedás satisfecho.' },
              { title: 'Atención al cliente', desc: 'Estamos disponibles para ayudarte en todo momento por WhatsApp e email.' },
            ].map((feat, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-11 h-11 bg-[var(--color-light)] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-black)] mb-1.5">{feat.title}</h3>
                  <p className="text-xs leading-relaxed text-[var(--color-accent)]">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COLECCIONES ──────────────────────────────────────── */}
        <section className="w-full px-4 md:px-8 lg:px-12 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map((col, i) => {
              const colImg = asset(`collection_${i + 1}`)
              // Si el tenant eligió un color, se respeta siempre (con o sin imagen).
              // Si no, se mantiene el comportamiento anterior por defecto.
              const baseColor = collectionTextColor ?? (colImg ? '#ffffff' : '#1A1A1A')
              return (
                <Link
                  key={i}
                  href={`/tienda?categoria=${col.slug}`}
                  className={`group relative overflow-hidden aspect-[4/5] block ${i === 1 ? 'md:translate-y-6' : ''}`}
                  style={{ backgroundColor: col.palette.bg }}
                >
                  {colImg && (
                    <img
                      src={colImg}
                      alt={col.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold mb-1" style={{ color: baseColor }}>
                      {col.name}
                    </h2>
                    <p className="text-xs mb-4 leading-relaxed" style={{ color: baseColor + 'B3' }}>
                      {col.subtitle}
                    </p>
                    <span
                      className="text-xs font-bold tracking-[0.15em] uppercase border-b-2 pb-0.5 group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-colors"
                      style={{ color: baseColor, borderColor: baseColor }}
                    >
                      DISCOVER MORE
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
        <section className="w-full px-4 md:px-8 lg:px-12 pb-24">
          <div className="flex items-start justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-[var(--color-black)] mb-2">Featured product</h2>
              <p className="text-sm text-[var(--color-accent)] max-w-md">
                Las últimas incorporaciones a nuestra colección, seleccionadas especialmente para vos.
              </p>
            </div>
            <div className="hidden md:flex gap-2 mt-1 flex-shrink-0">
              <button className="w-9 h-9 border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-black)] transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-9 h-9 border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-black)] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {(products as any[])?.map((product: any, i: number) => {
              const cover = product.product_images?.find((img: any) => img.is_cover) ?? product.product_images?.[0]
              const retailPrice = product.variants?.[0]?.price_rules?.find((p: any) => p.type === 'retail' && p.active)?.price
              const wholesalePrice = product.variants?.[0]?.price_rules?.find((p: any) => p.type === 'wholesale' && p.active)?.price
              const colors = [...new Set((product.variants ?? []).map((v: any) => v.color).filter(Boolean))] as string[]
              const sizes = [...new Set((product.variants ?? []).map((v: any) => v.size).filter(Boolean))] as string[]

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  coverUrl={cover?.url}
                  retailPrice={retailPrice}
                  wholesalePrice={wholesalePrice}
                  showPrices={showPrices}
                  priceVisibility={priceVisibility}
                  colors={colors}
                  sizes={sizes}
                  index={i}
                />
              )
            })}

            {(!products || products.length === 0) && (
              <div className="col-span-5 py-20 text-center">
                <p className="text-[var(--color-gray)] text-sm">Los productos se mostrarán aquí</p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/tienda"
              className="text-xs font-bold tracking-[0.15em] uppercase border-b-2 border-[var(--color-black)] pb-0.5 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
            >
              DISCOVER MORE
            </Link>
          </div>
        </section>

        {/* ── BLOG ─────────────────────────────────────────────── */}
        <section className="w-full px-4 md:px-8 lg:px-12 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--color-black)] mb-3">{blogHeading}</h2>
            <p className="text-sm text-[var(--color-accent)]">
              {blogSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => {
              const blogImg = asset(`blog_${i + 1}`)
              return (
                <article key={i} className="group cursor-pointer">
                  <div className="aspect-[4/3] mb-5 overflow-hidden relative" style={{ backgroundColor: post.bg }}>
                    {blogImg && (
                      <img
                        src={blogImg}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-black)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[var(--color-gray)] mb-3">{post.date}</p>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="text-xs font-bold tracking-[0.15em] uppercase border-b-2 border-[var(--color-black)] pb-0.5 group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-colors">
                    READ MORE
                  </span>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── NEWSLETTER ───────────────────────────────────────── */}
        <section className="py-20 px-6" style={{ backgroundColor: newsletterBgColor }}>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#8A8471' }}>
              Recibí las últimas novedades
            </h2>
            <div className="flex items-center bg-[#FFFCFA] rounded-md overflow-hidden border border-black/5 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu dirección de email"
                className="flex-1 min-w-0 bg-transparent text-sm px-5 py-4 outline-none placeholder:text-zinc-400 text-zinc-600"
              />
              <button className="px-6 py-4 text-sm text-zinc-500 border-l border-black/5 hover:text-zinc-800 transition-colors whitespace-nowrap">
                suscribirse
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── WHATSAPP FLOTANTE ─────────────────────────────────── */}
      {config?.whatsapp_number && (
        <a
          href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="fixed bottom-12 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 21l3.98-.927A9.945 9.945 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.5a8.46 8.46 0 0 1-4.337-1.195l-.31-.184-3.22.75.77-3.12-.202-.32A8.5 8.5 0 1 1 12 20.5z"/>
          </svg>
        </a>
      )}

      <Footer
        storeName={storeName}
        logoUrl={asset('logo') ?? config?.logo_url ?? undefined}
        whatsapp={config?.whatsapp_number ?? ''}
        email={config?.notification_email ?? ''}
        instagramUrl={(config as any)?.instagram_url ?? undefined}
        facebookUrl={(config as any)?.facebook_url ?? undefined}
        tiktokUrl={(config as any)?.tiktok_url ?? undefined}
        branches={(config as any)?.branches ?? []}
      />
    </>
  )
}
