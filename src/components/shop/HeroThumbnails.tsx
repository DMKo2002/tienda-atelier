'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroThumbnailsProps {
  thumb1: string | null
  thumb2: string | null
}

const THUMB_W = '18.5vw'
const THUMB_H = 'calc(18.5vw * 1.3125)'
const GAP = '12px' // gap-3
const OFFSET = `calc(${THUMB_W} + ${GAP})`

export default function HeroThumbnails({ thumb1, thumb2 }: HeroThumbnailsProps) {
  const [swapped, setSwapped] = useState(false)

  function swap() {
    setSwapped(s => !s)
  }

  return (
    <>
      {/* Thumbnails — se deslizan horizontalmente y cruzan de lugar entre sí */}
      <div
        className="absolute bottom-10 left-8 z-10"
        style={{ width: `calc(${THUMB_W} * 2 + ${GAP})`, height: THUMB_H }}
      >
        <div
          className="absolute top-0 left-0 overflow-hidden cursor-pointer transition-transform duration-[1500ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ width: THUMB_W, height: THUMB_H, transform: swapped ? `translateX(${OFFSET})` : 'translateX(0)' }}
          onClick={swap}
        >
          {thumb1 ? (
            <img src={thumb1} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#8B7355]" />
          )}
        </div>
        <div
          className="absolute top-0 overflow-hidden cursor-pointer transition-transform duration-[1500ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ width: THUMB_W, height: THUMB_H, left: OFFSET, transform: swapped ? `translateX(calc(-1 * ${OFFSET}))` : 'translateX(0)' }}
          onClick={swap}
        >
          {thumb2 ? (
            <img src={thumb2} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#7B3535]" />
          )}
        </div>
      </div>

      {/* Flechas — disparan el mismo cruce (solo hay 2 fotos, así que ambas hacen lo mismo) */}
      <div className="absolute bottom-3 left-8 z-10 flex gap-2">
        <button
          onClick={swap}
          aria-label="Cambiar foto"
          className="w-9 h-9 bg-[var(--color-black)] text-white flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={swap}
          aria-label="Cambiar foto"
          className="w-9 h-9 bg-[var(--color-black)] text-white flex items-center justify-center hover:bg-[var(--color-accent)] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  )
}
