'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '@/components/shop/CartContext'

interface NavbarProps {
  storeName?: string
  logoUrl?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  tiktokUrl?: string | null
  /** Color del texto/íconos del menú. Editable por tenant para que se lea bien
   *  sobre cualquier imagen de fondo del hero. Acepta 'white' | 'black' | un hex. */
  textColor?: string | null
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

function IconTikTok() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.93a8.16 8.16 0 0 0 4.78 1.52V7.01a4.85 4.85 0 0 1-1.01-.32z"/>
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tienda', label: 'Shop' },
  { href: '/contacto', label: 'Contacto' },
]

// Normaliza atajos comunes a un color CSS válido
function resolveColor(color?: string | null): string {
  if (!color) return '#ffffff'
  if (color === 'white') return '#ffffff'
  if (color === 'black') return '#1A1A1A'
  return color
}

export default function Navbar({ storeName = 'ATELIER', logoUrl, instagramUrl, facebookUrl, tiktokUrl, textColor }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()
  const color = resolveColor(textColor)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        {/* pr reserva la franja clara de la derecha (19% en desktop) para que el
            cluster de íconos quede pegado al borde de la foto, no al borde real de la pantalla */}
        <div className="w-full pl-6 md:pl-10 lg:pl-14 pr-6 md:pr-[calc(19%+2.5rem)] lg:pr-[calc(19%+3.5rem)] h-16 flex items-center">

          {/* Logo — extremo izquierdo */}
          <Link href="/" className="flex-shrink-0 mr-10">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-[27px] max-w-[150px] object-contain" />
            ) : (
              <span className="text-lg font-bold tracking-tight" style={{ color }}>
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
                className="text-xs font-medium tracking-[0.12em] hover:text-[var(--color-accent)] transition-colors relative group"
                style={{ color }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[var(--color-accent)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Redes + usuario + carrito — mismo cluster, íconos simples sin fondo */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors" style={{ color }} aria-label="Instagram">
                <IconInstagram />
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors" style={{ color }} aria-label="Facebook">
                <IconFacebook />
              </a>
            )}
            {tiktokUrl && (
              <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors" style={{ color }} aria-label="TikTok">
                <IconTikTok />
              </a>
            )}
            <Link href="/cuenta" className="hover:text-[var(--color-accent)] transition-colors" style={{ color }} aria-label="Cuenta">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link href="/carrito" className="relative hover:text-[var(--color-accent)] transition-colors" style={{ color }}>
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
            <Link href="/carrito" className="relative" style={{ color }}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-accent)] text-white text-[9px] rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ color }}>
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — siempre sobre fondo blanco, texto negro fijo */}
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
