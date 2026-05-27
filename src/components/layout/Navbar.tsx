'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/components/shop/CartContext'

interface NavbarProps {
  storeName?: string
  logoUrl?: string | null
}

export default function Navbar({ storeName = 'TIENDA', logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[var(--color-warm-white)] border-b border-[var(--color-border)] py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">Home</Link>
            <Link href="/tienda" className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">Tienda</Link>
            <Link href="/contacto" className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">Contacto</Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-8 object-contain" />
            ) : (
              <span className="font-display text-xl font-light tracking-[0.2em] uppercase text-[var(--color-charcoal)]">
                {storeName}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/mi-cuenta" className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">
              Mi cuenta
            </Link>
            <Link href="/carrito" className="relative text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-charcoal)] text-white text-[9px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4 ml-auto">
            <Link href="/carrito" className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-charcoal)] text-white text-[9px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-warm-white)] flex flex-col items-center justify-center gap-10 md:hidden">
          {['/', '/tienda', '/contacto', '/mi-cuenta'].map((href, i) => {
            const labels = ['Home', 'Tienda', 'Contacto', 'Mi cuenta']
            return (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="font-display text-3xl font-light tracking-widest uppercase text-[var(--color-charcoal)]">
                {labels[i]}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
