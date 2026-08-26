import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

type StackProduct = {
  id: number
  name: string
  label: string
  price: number
  color: string
  colorName: string
  image: string
  imageSrc: string
  description: string
  tag: string
}

function MobileProductStack({ products, onActiveChange }: { products: StackProduct[]; onActiveChange: (product: StackProduct) => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(-1)
  const productsRef = useRef(products)
  const onActiveChangeRef = useRef(onActiveChange)

  useEffect(() => {
    productsRef.current = products
    onActiveChangeRef.current = onActiveChange
  })

  useEffect(() => {
    let frame = 0

    function updateFromScroll() {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const section = sectionRef.current
        if (!section) return
        const totalScrollable = section.offsetHeight - window.innerHeight
        const progress = totalScrollable > 0 ? Math.max(0, Math.min(1, -section.getBoundingClientRect().top / totalScrollable)) : 0
        const nextIndex = Math.min(productsRef.current.length - 1, Math.floor(progress * productsRef.current.length))
        if (indexRef.current === nextIndex) return
        indexRef.current = nextIndex
        setIndex(nextIndex)
        onActiveChangeRef.current(productsRef.current[nextIndex])
      })
    }

    updateFromScroll()
    window.addEventListener('scroll', updateFromScroll, { passive: true })
    window.addEventListener('resize', updateFromScroll)
    return () => {
      window.removeEventListener('scroll', updateFromScroll)
      window.removeEventListener('resize', updateFromScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  function goTo(nextIndex: number) {
    const section = sectionRef.current
    if (!section || nextIndex === index) return
    const totalScrollable = section.offsetHeight - window.innerHeight
    const sectionTop = window.scrollY + section.getBoundingClientRect().top
    window.scrollTo({ top: sectionTop + totalScrollable * ((nextIndex + 0.5) / products.length), behavior: 'smooth' })
  }

  function getCardStyle(position: number) {
    const diff = position - index
    if (diff === 0) return { y: 0, scale: 1, opacity: 1, rotateX: 0, z: 5 }
    if (diff === -1) return { y: -150, scale: 0.84, opacity: 0.5, rotateX: 8, z: 4 }
    if (diff === -2) return { y: -260, scale: 0.7, opacity: 0.24, rotateX: 15, z: 3 }
    if (diff === 1) return { y: 150, scale: 0.84, opacity: 0.5, rotateX: -8, z: 4 }
    if (diff === 2) return { y: 260, scale: 0.7, opacity: 0.24, rotateX: -15, z: 3 }
    return { y: diff > 0 ? 380 : -380, scale: 0.6, opacity: 0, rotateX: diff > 0 ? -20 : 20, z: 0 }
  }

  const active = products[index]

  return (
    <section ref={sectionRef} className="mobile-stack-section" aria-label="Explore the Tiger collection">
      <div className="mobile-stack-viewport">
        <div className="mobile-stack-topline"><span>{active.label}</span><span>Made to order</span></div>
        <div className="mobile-stack-stage">
          {products.map((product, position) => {
            const style = getCardStyle(position)
            return (
              <motion.div
                key={product.id}
                className="mobile-stack-card"
                initial={false}
                animate={{ y: style.y, scale: style.scale, opacity: style.opacity, rotateX: style.rotateX }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ zIndex: style.z, transformStyle: 'preserve-3d' }}
              >
                <div className="stack-card-face">
                  <img src={product.imageSrc} alt={product.name} width={300} height={330} loading={position === 0 ? 'eager' : 'lazy'} decoding="async" />
                </div>
                <div className="stack-card-copy"><strong>{product.name}</strong><span>${product.price.toFixed(2)}</span></div>
              </motion.div>
            )
          })}
        </div>
        <div className="mobile-stack-counter">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div className="mobile-stack-dots">
            {products.map((product, position) => (
              <button key={product.id} type="button" className={position === index ? 'is-active' : undefined} aria-label={`Go to ${product.name}`} aria-current={position === index ? 'true' : undefined} onClick={() => goTo(position)} />
            ))}
          </div>
          <span>{String(products.length).padStart(2, '0')}</span>
        </div>
        <p className="mobile-stack-hint">Scroll to explore ↓</p>
      </div>
    </section>
  )
}

export { MobileProductStack }
