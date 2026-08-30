import { useEffect, useRef, useState } from 'react'

type Props = {
  images: string[]
  size?: number
}

export function MobileHeroCircle({ images, size = 112 }: Props) {
  const sliced = images.slice(0, 5)
  const n = sliced.length
  const [rotation, setRotation] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced || n <= 1) return
    intervalRef.current = window.setInterval(() => {
      setRotation((prev) => prev + (2 * Math.PI) / n)
    }, 1500)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [n, reduced])

  return (
    <div className="mobile-hero-circle" aria-label="Featured shirts circle">
      <div className="mobile-hero-circle-stage">
        {sliced.map((src, i) => {
          const angle = (i / n) * Math.PI * 2 + rotation
          const R = 92
          const x = Math.cos(angle) * R
          const y = Math.sin(angle) * R * 0.52
          const depth = (Math.cos(angle) + 1) / 2
          const scale = 0.85 + 0.15 * depth
          const opacity = 0.72 + 0.28 * depth
          const zIndex = Math.round(depth * 10)
          return (
            <div
              key={`${src}-${i}`}
              className="mobile-hero-circle-card"
              style={{
                width: size,
                height: size * 1.32,
                left: `calc(50% + ${x}px - ${size / 2}px)`,
                top: `calc(50% + ${y}px - ${(size * 1.32) / 2}px)`,
                transform: `scale(${scale})`,
                opacity,
                zIndex,
              }}
            >
              <img src={src} alt="" width={size} height={Math.round(size * 1.32)} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
