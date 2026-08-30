import { useEffect, useRef, useState } from 'react'

type Props = {
  images: string[]
}

export function MobileHeroCircle({ images }: Props) {
  const items = images.slice(0, 5)
  const total = items.length
  const anglePerItem = 360 / total
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef(0)
  const rotationStartRef = useRef(0)
  const radius = 250
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      if (isDragging) return
      setRotation((prev) => prev + anglePerItem)
    }, 1500)
    return () => window.clearInterval(id)
  }, [anglePerItem, isDragging, reduced])

  function onPointerDown(e: React.PointerEvent) {
    setIsDragging(true)
    dragStartRef.current = e.clientX
    rotationStartRef.current = rotation
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    const delta = e.clientX - dragStartRef.current
    setRotation(rotationStartRef.current + delta * 0.3)
  }

  function onPointerUp() {
    if (!isDragging) return
    setIsDragging(false)
    setRotation((prev) => Math.round(prev / anglePerItem) * anglePerItem)
  }

  return (
    <div className="mobile-hero-circle" aria-label="Featured shirts circle">
      <div
        className="mobile-hero-circle-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="mobile-hero-circle-arc"
          style={{
            width: radius * 2,
            height: radius * 2,
            top: `calc(50% + ${radius * 0.4}px)`,
          }}
        />

        <div className="mobile-hero-circle-ring" style={{ transform: `translateY(${radius * 0.4}px)` }}>
          {items.map((src, index) => {
            const base = index * anglePerItem
            const cur = base + rotation
            const norm = ((cur % 360) + 540) % 360 - 180
            const isCenter = Math.abs(norm) < anglePerItem / 2
            const dist = Math.abs(norm)
            const opacity = Math.max(0.35, 1 - dist / 140)
            const scale = isCenter ? 1.05 : Math.max(0.78, 1 - dist / 200)
            return (
              <div
                key={`${src}-${index}`}
                className="mobile-hero-circle-item"
                style={{
                  transform: `rotate(${cur}deg) translateY(-${radius}px) scale(${scale})`,
                  opacity,
                  zIndex: isCenter ? 20 : Math.round(100 - dist),
                  transition: isDragging ? 'none' : 'transform 700ms ease-out, opacity 300ms',
                }}
              >
                <div className={`mobile-hero-circle-card-inner ${isCenter ? 'is-center' : ''}`}>
                  <img src={src} alt="" width={160} height={198} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mobile-hero-circle-dots" aria-hidden>
        {items.map((_, idx) => {
          const norm = ((rotation % 360) + 360) % 360
          const active = Math.round(norm / anglePerItem) % total
          const isActive = (total - active) % total === idx
          return <span key={idx} className={isActive ? 'is-active' : ''} />
        })}
      </div>
    </div>
  )
}
