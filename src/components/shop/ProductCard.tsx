'use client'

import Link from 'next/link'
import { ImageOff } from 'lucide-react'
import { getColorHex, isLightColor } from '@/lib/colors'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  coverUrl?: string | null
  retailPrice?: number | null
  retailCompareAt?: number | null
  wholesalePrice?: number | null
  showWholesale?: boolean
  showPrices?: boolean
  priceVisibility?: 'all' | 'logged_in' | 'wholesale_only'
  index?: number
  colors?: string[]
  sizes?: string[]
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function ProductCard({
  id, name, slug, coverUrl, retailPrice, retailCompareAt, wholesalePrice,
  showWholesale = false, showPrices = true, priceVisibility = 'all', index = 0, colors = [], sizes = []
}: ProductCardProps) {

  const hasDiscount = retailCompareAt && retailCompareAt > (retailPrice ?? 0)
  const discountPct = hasDiscount
    ? Math.round((1 - (retailPrice! / retailCompareAt!)) * 100)
    : null

  return (
    <Link
      href={`/tienda/${slug}`}
      className="group block opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      {/* Imagen */}
      <div className="product-img-wrap bg-[#F2EEE9] aspect-[3/4] w-full mb-3 relative overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={32} className="text-[var(--color-border)]" />
          </div>
        )}

        {/* Badge nuevo / descuento */}
        {discountPct ? (
          <div className="absolute top-2 left-2 bg-[var(--color-accent)] text-white text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-1">
            SALE
          </div>
        ) : (
          <div className="absolute top-2 left-2 bg-[var(--color-black)] text-white text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-1">
            NEW
          </div>
        )}
      </div>

      {/* Info — centrado */}
      <div className="text-center">
        <p className="text-sm text-[var(--color-black)] leading-snug group-hover:text-[var(--color-accent)] transition-colors mb-1.5">
          {name}
        </p>

        {/* Precio */}
        <div className="flex items-center justify-center gap-2 mb-2.5">
          {showPrices ? (
            <>
              {retailPrice && (
                <span className="text-sm text-[var(--color-black)]">
                  {formatPrice(retailPrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs text-[var(--color-gray)] line-through">
                  {formatPrice(retailCompareAt!)}
                </span>
              )}
              {showWholesale && wholesalePrice && (
                <span className="text-xs text-[var(--color-gray)]">
                  Mayor: {formatPrice(wholesalePrice)}
                </span>
              )}
            </>
          ) : (
            <a
              href="/cuenta/login"
              onClick={e => e.stopPropagation()}
              className="text-xs text-[var(--color-gray)] hover:text-[var(--color-black)] transition-colors underline"
            >
              {priceVisibility === 'wholesale_only' ? 'Solo para mayoristas' : 'Iniciá sesión para ver precio'}
            </a>
          )}
        </div>

        {/* Colores */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 flex-wrap justify-center mb-2">
            {colors.map(color => {
              const hex = getColorHex(color)
              const light = isLightColor(hex)
              return (
                <span
                  key={color}
                  title={color}
                  style={{
                    backgroundColor: hex,
                    width: 16, height: 16, borderRadius: '50%', display: 'inline-block',
                    border: light ? '1px solid #D0CBC3' : '1px solid transparent', flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
        )}

        {/* Talles */}
        {sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center">
            {sizes.map(size => (
              <span
                key={size}
                style={{
                  fontSize: 10, letterSpacing: '0.05em', color: 'var(--color-gray)',
                  border: '1px solid var(--color-border)', borderRadius: 3,
                  padding: '1px 5px', lineHeight: 1.6,
                }}
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
