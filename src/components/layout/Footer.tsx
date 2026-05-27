import Link from 'next/link'

interface FooterProps {
  storeName?: string
  address?: string
  phone?: string
  whatsapp?: string
  email?: string
}

export default function Footer({
  storeName = 'TIENDA',
  address = '',
  phone = '',
  whatsapp = '',
  email = '',
}: FooterProps) {
  return (
    <footer className="bg-[var(--color-charcoal)] text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-display text-2xl font-light tracking-[0.2em] uppercase text-white mb-4">
              {storeName}
            </p>
            <p className="text-xs leading-relaxed text-white/50">
              Estilo que trasciende tendencia.
            </p>
          </div>

          {/* Links tienda */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-white mb-5">Tienda</p>
            <ul className="space-y-3">
              {[
                { href: '/tienda', label: 'Todos los productos' },
                { href: '/tienda?cat=sweaters', label: 'Sweaters' },
                { href: '/tienda?cat=cardigans', label: 'Cardigans' },
                { href: '/tienda?cat=chalecos', label: 'Chalecos' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-white mb-5">Información</p>
            <ul className="space-y-3">
              {[
                { href: '/guia-de-compra', label: 'Guía de compra' },
                { href: '/metodos-de-envio', label: 'Métodos de envío' },
                { href: '/medios-de-pago', label: 'Medios de pago' },
                { href: '/politica-de-cambio', label: 'Política de cambio' },
                { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-white mb-5">Contacto</p>
            <ul className="space-y-3 text-xs text-white/50">
              {address && <li>{address}</li>}
              {phone && <li>{phone}</li>}
              {whatsapp && (
                <li>
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                    WhatsApp: {whatsapp}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors uppercase">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-widest uppercase text-white/30">
            © {new Date().getFullYear()} {storeName}
          </p>
          <p className="text-[10px] tracking-widest uppercase text-white/30">
            Desarrollo Web — CreArt
          </p>
        </div>
      </div>
    </footer>
  )
}
