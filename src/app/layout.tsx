import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/shop/CartContext'
import CookieBanner from '@/components/layout/CookieBanner'
import NoImageDownload from '@/components/layout/NoImageDownload'
import { buildStoreMetadata } from '@creart/tienda-core/seo'
import GoogleAnalytics from '@creart/tienda-core/GoogleAnalytics'
import MetaPixel from '@creart/tienda-core/MetaPixel'
import GoogleAdsTag from '@creart/tienda-core/GoogleAdsTag'
import TikTokPixel from '@creart/tienda-core/TikTokPixel'

// Metadata de la tienda centralizada en tienda-core — ver src/lib/seo.ts.
// El único dato propio de este template es la bajada de fallback (se usa
// solo si el tenant no cargó su propia "Descripción SEO" desde el panel).
export async function generateMetadata(): Promise<Metadata> {
  return buildStoreMetadata('Estilo que trasciende tendencia.')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/2587a79db946f40eae08ed270054b8a2be1f2ac5.css" />
      </head>
      <body className="overflow-x-hidden">
        <CartProvider>
          {children}
          <CookieBanner />
          <NoImageDownload />
          <GoogleAnalytics />
          <MetaPixel />
          <GoogleAdsTag />
          <TikTokPixel />
        </CartProvider>
        </body>
    </html>
  )
}
