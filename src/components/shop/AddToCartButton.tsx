'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import { ShoppingBag, Check } from 'lucide-react'

interface Variant {
  id: string
  size: string | null
  color: string | null
  stock: number
  price_rules: { type: string; price: number; min_qty: number; active: boolean }[]
}

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    variants: Variant[]
    coverUrl: string | null
  }
  sizes: string[]
  colors: string[]
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function AddToCartButton({ product, sizes, colors }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  // Encontrar la variante que coincide con talle + color seleccionados
  const selectedVariant = product.variants.find(v => {
    const sizeMatch = sizes.length === 0 || v.size === selectedSize
    const colorMatch = colors.length === 0 || v.color === selectedColor
    return sizeMatch && colorMatch
  })

  const retailPrice = selectedVariant?.price_rules?.find(p => p.type === 'retail' && p.active)?.price
  const wholesalePrice = selectedVariant?.price_rules?.find(p => p.type === 'wholesale' && p.active)
  const inStock = (selectedVariant?.stock ?? 0) > 0

  // Precio según cantidad
  const effectivePrice = wholesalePrice && quantity >= wholesalePrice.min_qty
    ? wholesalePrice.price
    : (retailPrice ?? 0)

  const priceType: 'retail' | 'wholesale' = wholesalePrice && quantity >= wholesalePrice.min_qty
    ? 'wholesale'
    : 'retail'

  function handleAddToCart() {
    if (!selectedVariant || !effectivePrice) return

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantDesc: [selectedSize, selectedColor].filter(Boolean).join(' / '),
      size: selectedSize ?? '',
      color: selectedColor ?? '',
      price: effectivePrice,
      priceType,
      imageUrl: product.coverUrl,
      quantity,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Selector de talle */}
      {sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">
            Talle
          </p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 text-sm font-light border transition-colors ${
                  selectedSize === size
                    ? 'border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de color */}
      {colors.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">
            Color: <span className="normal-case font-light">{selectedColor}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 text-xs font-light border transition-colors ${
                  selectedColor === color
                    ? 'border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cantidad */}
      <div>
        <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">Cantidad</p>
        <div className="flex items-center border border-[var(--color-border)] w-fit">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-border)] transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-light">{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-border)] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Precio efectivo si cambia por mayorista */}
      {wholesalePrice && quantity >= wholesalePrice.min_qty && (
        <div className="bg-[#F2EEE9] px-4 py-3 text-sm text-[var(--color-charcoal)]">
          Precio mayorista aplicado: <strong>{formatPrice(wholesalePrice.price)}</strong> por unidad
        </div>
      )}

      {/* Stock */}
      {selectedVariant && !inStock && (
        <p className="text-xs text-red-400 tracking-wide">Sin stock disponible</p>
      )}

      {/* Botón agregar */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant || !inStock || !effectivePrice}
        className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
          added
            ? 'bg-[var(--color-stone)] text-white'
            : 'bg-[var(--color-charcoal)] text-white hover:bg-[var(--color-stone)] disabled:opacity-40 disabled:cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check size={16} strokeWidth={1.5} />
            Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingBag size={16} strokeWidth={1.5} />
            Agregar al carrito — {effectivePrice ? formatPrice(effectivePrice * quantity) : ''}
          </>
        )}
      </button>

    </div>
  )
}
