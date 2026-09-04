import { useRef, useState } from 'react'

type CarouselProduct = {
  id: number
  name: string
  label: string
  price: number
  imageSrc: string
}

export function MobileProductCarousel({
  products,
  activeId,
  onSelect,
}: {
  products: CarouselProduct[]
  activeId: number
  onSelect: (id: number) => void
}) {
  const [dragX, setDragX] = useState(0)
  const startX = useRef(0)
  const dragging = useRef(false)
  const activeIndex = products.findIndex((p) => p.id === activeId)
  const safeIndex = activeIndex === -1 ? 0 : activeIndex
  const active = products[safeIndex]

  function go(delta: number) {
    const next = (safeIndex + delta + products.length) % products.length
    onSelect(products[next].id)
  }

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true
    startX.current = e.clientX
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    setDragX(e.clientX - startX.current)
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - startX.current
    setDragX(0)
    if (Math.abs(dx) > 50) {
      go(dx < 0 ? 1 : -1)
    }
  }

  return (
    <div className="mobile-h-carousel">
      <div
        className="mobile-h-card"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ transform: `translateX(${dragX * 0.2}px)` }}
      >
        <button
          type="button"
          aria-label="Previous product"
          className="mobile-h-arrow left"
          onClick={() => go(-1)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
        </button>

        <div className="mobile-h-image">
          <img src={active.imageSrc} alt={active.name} width={360} height={360} loading="eager" decoding="async" />
        </div>

        <button
          type="button"
          aria-label="Next product"
          className="mobile-h-arrow right"
          onClick={() => go(1)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <div className="mobile-h-meta">
        <span className="mobile-h-label">{active.label}</span>
        <strong className="mobile-h-name">{active.name}</strong>
        <span className="mobile-h-price">${active.price.toFixed(2)}</span>
      </div>

      <div className="mobile-h-indicator">
        <span>{String(safeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</span>
        <div className="mobile-h-dots">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to ${p.name}`}
              aria-current={i === safeIndex ? 'true' : undefined}
              className={i === safeIndex ? 'is-active' : undefined}
              onClick={() => onSelect(p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
