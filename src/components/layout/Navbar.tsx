'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, Menu, X, Search, User, ChevronRight } from 'lucide-react'
import { useCart } from '@/components/shop/CartContext'

interface NavbarProps {
  storeName?: string
  logoUrl?: string | null
}

interface Leaf { id: string; name: string; slug: string }
interface Sub extends Leaf { subcategories: Leaf[] }
interface Category extends Leaf { subcategories: Sub[] }

export default function Navbar({ storeName = 'TIENDA', logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tiendaOpen, setTiendaOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/nav-categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setTiendaOpen(true)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      setTiendaOpen(false)
      setActiveCategory(null)
    }, 150)
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[var(--color-warm-white)] border-b border-[var(--color-border)] py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">
              Home
            </Link>

            {/* Tienda + mega-menu */}
            <div className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
              <Link
                href="/tienda"
                className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors"
              >
                Tienda
              </Link>

              {tiendaOpen && categories.length > 0 && (
                <div
                  className="absolute top-full left-0 mt-4 bg-[var(--color-warm-white)] border border-[var(--color-border)] shadow-lg flex"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  {/* Columna categorías */}
                  <ul className="py-3 min-w-[190px]">
                    <li>
                      <Link
                        href="/tienda"
                        onClick={() => { setTiendaOpen(false); setActiveCategory(null) }}
                        className="block px-5 py-2 text-xs tracking-[0.12em] uppercase text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:bg-[var(--color-bg)] transition-colors"
                      >
                        Ver todo
                      </Link>
                    </li>
                    <li><div className="border-t border-[var(--color-border)] my-1" /></li>
                    {categories.map(cat => (
                      <li key={cat.id} onMouseEnter={() => setActiveCategory(cat.subcategories.length > 0 ? cat : null)}>
                        <Link
                          href={`/tienda?cat=${cat.slug}`}
                          onClick={() => { setTiendaOpen(false); setActiveCategory(null) }}
                          className="flex items-center justify-between px-5 py-2 text-xs tracking-[0.12em] uppercase text-[var(--color-charcoal)] hover:bg-[var(--color-bg)] transition-colors"
                        >
                          {cat.name}
                          {cat.subcategories.length > 0 && <ChevronRight size={11} className="text-[var(--color-stone)] ml-2 flex-shrink-0" />}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Columna subcategorías */}
                  {activeCategory && (
                    <ul className="py-3 min-w-[190px] border-l border-[var(--color-border)]">
                      {activeCategory.subcategories.map(sub => (
                        <li key={sub.id}>
                          <Link
                            href={`/tienda?cat=${sub.slug}`}
                            onClick={() => { setTiendaOpen(false); setActiveCategory(null) }}
                            className="flex items-center justify-between px-5 py-2 text-xs tracking-[0.12em] uppercase text-[var(--color-charcoal)] hover:bg-[var(--color-bg)] transition-colors"
                          >
                            {sub.name}
                            {sub.subcategories.length > 0 && <ChevronRight size={11} className="text-[var(--color-stone)] ml-2 flex-shrink-0" />}
                          </Link>
                          {sub.subcategories.length > 0 && (
                            <ul className="pl-4 pb-1">
                              {sub.subcategories.map(leaf => (
                                <li key={leaf.id}>
                                  <Link
                                    href={`/tienda?cat=${leaf.slug}`}
                                    onClick={() => { setTiendaOpen(false); setActiveCategory(null) }}
                                    className="block px-3 py-1 text-[11px] tracking-[0.1em] uppercase text-[var(--color-stone)] hover:text-[var(--color-charcoal)] transition-colors"
                                  >
                                    {leaf.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Link href="/contacto" className="text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Logo centrado */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-8 object-contain" />
            ) : (
              <span className="font-display text-xl font-light tracking-[0.2em] uppercase text-[var(--color-charcoal)]">
                {storeName}
              </span>
            )}
          </Link>

          {/* Iconos derecha */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/cuenta" className="text-[var(--color-charcoal)] hover:text-[var(--color-stone)] transition-colors" title="Mi cuenta">
              <User size={18} strokeWidth={1.5} />
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

          {/* Mobile hamburger */}
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

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-warm-white)] flex flex-col items-center justify-center gap-8 md:hidden overflow-y-auto py-20">
          <Link href="/" onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest uppercase text-[var(--color-charcoal)]">
            Home
          </Link>
          <Link href="/tienda" onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest uppercase text-[var(--color-charcoal)]">
            Tienda
          </Link>
          {categories.length > 0 && (
            <div className="flex flex-col items-center gap-3 -mt-4">
              {categories.map(cat => (
                <Link key={cat.id} href={`/tienda?cat=${cat.slug}`} onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-[0.15em] uppercase text-[var(--color-stone)]">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
          <Link href="/contacto" onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest uppercase text-[var(--color-charcoal)]">
            Contacto
          </Link>
          <Link href="/cuenta" onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest uppercase text-[var(--color-charcoal)]">
            Mi cuenta
          </Link>
        </div>
      )}
    </>
  )
}
