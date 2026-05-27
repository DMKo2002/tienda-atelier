import Link from 'next/link'
import { ImageOff } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  coverUrl?: string | null
  retailPrice?: number | null
  wholesalePrice?: number | null
  showWholesale?: boolean
  index?: number
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function ProductCard({
  id, name, slug, coverUrl, retailPrice, wholesalePrice, showWholesale = false, index = 0
}: ProductCardProps) {
  return (
    <Link
      href={`/tienda/${slug}`}
      className="group block opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      {/* Imagen */}
      <div className="product-img-wrap bg-[#F2EEE9] aspect-[3/4] w-full mb-4">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={32} className="text-[var(--color-border)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-sm font-light text-[var(--color-charcoal)] leading-snug group-hover:text-[var(--color-stone)] transition-colors">
          {name}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          {retailPrice && (
            <span className="text-sm text-[var(--color-charcoal)]">
              {formatPrice(retailPrice)}
            </span>
          )}
          {showWholesale && wholesalePrice && (
            <span className="text-xs text-[var(--color-stone)]">
              Mayor: {formatPrice(wholesalePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
