'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/components/shop/CartContext'

interface NavbarProps {
  storeName?: string
  logoUrl?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tienda', label: 'Shop' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar({ storeName = 'ATELIER', logoUrl, instagramUrl, facebookUrl }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="w-full px-6 h-16 flex items-center">

          {/* Logo — extremo izquierdo */}
          <Link href="/" className="flex-shrink-0 mr-10">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-7 max-w-[160px] object-contain" />
            ) : (
              <span className="text-base font-bold tracking-tight text-white">
                {storeName}
              </span>
            )}
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-[0.12em] text-white hover:text-[var(--color-accent)] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[var(--color-accent)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Redes + carrito */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--color-accent)] transition-colors"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[var(--color-accent)] transition-colors"
                aria-label="Facebook"
              >
                <IconFacebook />
              </a>
            )}
            <Link href="/carrito" className="relative text-white hover:text-[var(--color-accent)] transition-colors">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-accent)] text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4 ml-auto">
            <Link href="/carrito" className="relative text-white">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-accent)] text-white text-[9px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-bold tracking-widest uppercase text-[var(--color-black)] hover:text-[var(--color-accent)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
