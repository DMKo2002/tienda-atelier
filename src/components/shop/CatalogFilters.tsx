'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface CatalogFiltersProps {
  categories: Category[]
  currentCat?: string
  currentOrden?: string
}

export default function CatalogFilters({ categories, currentCat, currentOrden }: CatalogFiltersProps) {
  return (
    <div className="space-y-8 sticky top-28">

      {/* Categorías */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-stone)] mb-4">
          Categorías
        </p>
        <ul className="space-y-2.5">
          <li>
            <Link
              href="/tienda"
              className={`text-sm font-light transition-colors ${
                !currentCat
                  ? 'text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)]'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)]'
              }`}
            >
              Todos
            </Link>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link
                href={`/tienda?cat=${cat.slug}`}
                className={`text-sm font-light transition-colors ${
                  currentCat === cat.slug
                    ? 'text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)]'
                    : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)]'
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Ordenar */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-stone)] mb-4">
          Ordenar
        </p>
        <ul className="space-y-2.5">
          {[
            { value: '', label: 'Más recientes' },
            { value: 'precio-asc', label: 'Precio: menor a mayor' },
            { value: 'precio-desc', label: 'Precio: mayor a menor' },
          ].map(opt => (
            <li key={opt.value}>
              <Link
                href={`/tienda${currentCat ? `?cat=${currentCat}&` : '?'}orden=${opt.value}`}
                className={`text-sm font-light transition-colors ${
                  (currentOrden ?? '') === opt.value
                    ? 'text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)]'
                    : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)]'
                }`}
              >
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
