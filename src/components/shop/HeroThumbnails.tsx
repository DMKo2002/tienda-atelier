'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroThumbnailsProps {
  thumb1: string | null
  thumb2: string | null
}

export default function HeroThumbnails({ thumb1, thumb2 }: HeroThumbnailsProps) {
  const [swapped, setSwapped] = useState(false)
  const [pulsing, setPulsing] = useState(false)

  const leftImg = swapped ? thumb2 : thumb1
  const rightImg = swapped ? thumb1 : thumb2

  function swap() {
    if (pulsing) return
    setPulsing(true)
    setTimeout(() => setSwapped(s => !s), 250)
    setTimeout(() => setPulsing(false), 550)
  }

  return (
    <>
      {/* Thumbnails — abajo izquierda */}
      <div className="absolute bottom-10 left-8 flex gap-3 z-10">
        <div className="overflow-hidden group/t1 cursor-pointer" style={{ width: '18.5vw', height: 'calc(18.5vw * 1.3125)' }} onClick={swap}>
          {leftImg ? (
            <img
              src={leftImg}
              alt=""
              className={`w-full h-full object-cover transition-all duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/t1:scale-[1.12] ${pulsing ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-[#8B7355]" />
          )}
        </div>
        <div className="overflow-hidden group/t2 cursor-pointer" style={{ width: '18.5vw', height: 'calc(18.5vw * 1.3125)' }} onClick={swap}>
          {rightImg ? (
            <img
              src={rightImg}
              alt=""
              className={`w-full h-full object-cover transition-all duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/t2:scale-[1.12] ${pulsing ? 'scale-90 opacity-60' : 'scale-100 opacity-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-[#7B3535]" />
          )}
        </div>
      </div>

      {/* Flechas — intercambian las dos fotos entre sí */}
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
