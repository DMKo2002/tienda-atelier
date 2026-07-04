'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import { ShoppingBag, Check } from 'lucide-react'
import { getColorHex, isLightColor } from '@/lib/colors'

interface Variant {
  id: string
  size: string | null
  color: string | null
  stock: number
  price_rules: { type: string; price: number; min_qty: number; active: boolean }[]
}

interface AddToCartButtonProps {
  showPrices?: boolean
  // Cuando está prendido en la config de tienda ("Modo sin stock"), todos los
  // productos deben aparecer disponibles sin importar el stock cargado —
  // pensado para mayoristas que manejan disponibilidad real por WhatsApp.
  ignoreStock?: boolean
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

export default function AddToCartButton({ product, sizes, colors, showPrices = true, ignoreStock = false }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null)
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [stockError, setStockError] = useState<string | null>(null)

  // Helper: get stock for a specific size+color combination
  function getVariantStock(size: string | null, color: string | null): number {
    const v = product.variants.find(v => {
      const sm = sizes.length === 0 || v.size === size
      const cm = colors.length === 0 || v.color === color
      return sm && cm
    })
    return v?.stock ?? 0
  }

  // Helper: is a size available with any color (or the selected color)?
  function isSizeAvailable(size: string): boolean {
    if (ignoreStock) return true
    if (colors.length === 0) return getVariantStock(size, null) > 0
    // If a color is selected, check only that color+size combo
    if (selectedColor) return getVariantStock(size, selectedColor) > 0
    // Otherwise check if any color has stock for this size
    return colors.some(c => getVariantStock(size, c) > 0)
  }

  // Helper: is a color available with any size (or the selected size)?
  function isColorAvailable(color: string): boolean {
    if (ignoreStock) return true
    if (sizes.length === 0) return getVariantStock(null, color) > 0
    if (selectedSize) return getVariantStock(selectedSize, color) > 0
    return sizes.some(s => getVariantStock(s, color) > 0)
  }

  const selectedVariant = product.variants.find(v => {
    const sizeMatch = sizes.length === 0 || v.size === selectedSize
    const colorMatch = colors.length === 0 || v.color === selectedColor
    return sizeMatch && colorMatch
  })

  const retailPrice = selectedVariant?.price_rules?.find(p => p.type === 'retail' && p.active)?.price
  const wholesalePrice = selectedVariant?.price_rules?.find(p => p.type === 'wholesale' && p.active)
  const inStock = ignoreStock || (selectedVariant?.stock ?? 0) > 0

  const effectivePrice = wholesalePrice && quantity >= wholesalePrice.min_qty
    ? wholesalePrice.price
    : (retailPrice ?? 0)

  const priceType: 'retail' | 'wholesale' = wholesalePrice && quantity >= wholesalePrice.min_qty
    ? 'wholesale' : 'retail'

  function handleAddToCart() {
    if (!selectedVariant || !effectivePrice) return
    const maxStock = selectedVariant.stock ?? 0
    if (!ignoreStock) {
      if (maxStock === 0) return
      if (quantity > maxStock) {
        setStockError(maxStock === 1 ? 'Solo queda 1 unidad disponible' : `Solo quedan ${maxStock} unidades disponibles`)
        return
      }
    }
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
      stock: maxStock,
    })
    setAdded(true)
    setStockError(null)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Selector de COLOR — círculos */}
      {colors.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">
            Color:{' '}
            <span className="normal-case font-light text-[var(--color-charcoal)]">
              {selectedColor}
            </span>
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {colors.map(color => {
              const hex = getColorHex(color)
              const light = isLightColor(hex)
              const selected = selectedColor === color
              const available = isColorAvailable(color)
              return (
                <button
                  key={color}
                  onClick={() => { if (available) { setSelectedColor(color); setStockError(null) } }}
                  title={available ? color : `${color} — sin stock`}
                  disabled={!available}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: selected
                      ? '2px solid var(--color-charcoal)'
                      : light
                      ? '1px solid #D0CBC3'
                      : '1px solid transparent',
                    outline: selected ? '2px solid white' : 'none',
                    outlineOffset: -4,
                    cursor: available ? 'pointer' : 'not-allowed',
                    opacity: available ? 1 : 0.35,
                    transition: 'transform 0.15s',
                    transform: selected ? 'scale(1.15)' : 'scale(1)',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {!available && (
                    <span style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, color: light ? '#666' : '#fff', fontWeight: 300,
                    }}>×</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selector de TALLE — pills */}
      {sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">
            Talle
          </p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(size => {
              const available = isSizeAvailable(size)
              return (
                <button
                  key={size}
                  onClick={() => { if (available) { setSelectedSize(size); setStockError(null) } }}
                  disabled={!available}
                  className={`h-9 px-3 text-xs font-light border transition-colors rounded-sm relative ${
                    selectedSize === size
                      ? 'border-[var(--color-charcoal)] bg-[var(--color-charcoal)] text-white'
                      : available
                      ? 'border-[var(--color-border)] text-[var(--color-charcoal)] hover:border-[var(--color-charcoal)]'
                      : 'border-[var(--color-border)] text-[var(--color-stone)]/40 cursor-not-allowed line-through'
                  }`}
                  title={available ? size : `${size} — sin stock`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Cantidad */}
      <div>
        <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">Cantidad</p>
        <div className="flex items-center border border-[var(--color-border)] w-fit">
          <button
            onClick={() => { setQuantity(q => Math.max(1, q - 1)); setStockError(null) }}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-border)] transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-light">{quantity}</span>
          <button
            onClick={() => {
              const maxStock = selectedVariant?.stock ?? 0
              if (!ignoreStock && quantity >= maxStock) {
                setStockError(maxStock === 1 ? 'Solo queda 1 unidad disponible' : `Solo quedan ${maxStock} unidades disponibles`)
              } else {
                setQuantity(q => q + 1)
                setStockError(null)
              }
            }}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-charcoal)] hover:bg-[var(--color-border)] transition-colors"
          >
            +
          </button>
        </div>
        {stockError && (
          <p className="mt-2 text-xs text-amber-600">{stockError}</p>
        )}
      </div>

      {/* Banner precio mayorista */}
      {showPrices && wholesalePrice && quantity >= wholesalePrice.min_qty && (
        <div className="bg-[#F2EEE9] px-4 py-3 text-sm text-[var(--color-charcoal)]">
          Precio mayorista aplicado: <strong>{formatPrice(wholesalePrice.price)}</strong> por unidad
        </div>
      )}

      {/* Sin stock */}
      {selectedVariant && !inStock && (
        <p className="text-xs text-red-400 tracking-wide">Sin stock disponible para esta variante</p>
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
            Agregar al carrito{showPrices && effectivePrice ? ` — ${formatPrice(effectivePrice * quantity)}` : ''}
          </>
        )}
      </button>

    </div>
  )
}
