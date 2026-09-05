import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './DesignsPage.css'
import { FadeText } from './components/ui/fade-text'
import { getTheme, toggleTheme, type Theme } from './theme'
import { shirtImages } from './shirts'
import type { CartItem, Product } from './App'

gsap.registerPlugin(ScrollTrigger)

type Design = {
  number: number
  title: string
  category: string
  description: string
  imageSrc: string
  backSrc: string
}

type Column = {
  step: number
  designs: Design[]
}

const designs: Design[] = [
  { number: 1, title: 'Claw Stripes', category: 'School Mark', description: 'Orange claw tears over OTN · RCHS on heather charcoal.', imageSrc: shirtImages.front[1], backSrc: shirtImages.back[1] },
  { number: 2, title: 'One Tiger Nation', category: 'Community', description: 'Hand-rough caps on tiger orange. One school, one roar.', imageSrc: shirtImages.front[2], backSrc: shirtImages.back[2] },
  { number: 3, title: 'Tigers Block', category: 'Varsity', description: 'Classic block letters, outlined in tiger orange on bright orange.', imageSrc: shirtImages.front[3], backSrc: shirtImages.back[3] },
  { number: 4, title: 'Always Be A Tiger', category: 'Spirit Wear', description: 'Tribal half-tiger + mantra • Always be yourself, unless you can be a tiger.', imageSrc: shirtImages.front[4], backSrc: shirtImages.back[4] },
  { number: 5, title: 'Tiger Strong', category: 'Athletics', description: 'Zebra-filled block letters in off-white on charcoal.', imageSrc: shirtImages.front[5], backSrc: shirtImages.back[5] },
  { number: 6, title: 'Two-Tone Tiger', category: 'School Mark', description: 'Split face — half ice, half fire. White and tiger orange.', imageSrc: shirtImages.front[6], backSrc: shirtImages.back[6] },
  { number: 7, title: 'Seniors', category: 'Senior Edition', description: 'FRIENDS-inspired dotted type for the Class of 2026 on black.', imageSrc: shirtImages.front[7], backSrc: shirtImages.back[7] },
  { number: 8, title: 'Tigers Volleyball', category: 'Volleyball', description: 'Half tiger, half volleyball — TIGERS vertical in orange on black.', imageSrc: shirtImages.front[8], backSrc: shirtImages.back[8] },
  { number: 9, title: 'Paw Pride', category: 'Minimal', description: 'Tiny white paw, left chest. Quiet pride on black.', imageSrc: shirtImages.front[9], backSrc: shirtImages.back[9] },
]

const columns: Column[] = [
  { step: 2, designs: designs.slice(0, 1) },
  { step: 1, designs: designs.slice(1, 3) },
  { step: 0, designs: designs.slice(3, 6) },
  { step: 1, designs: designs.slice(6, 8) },
  { step: 2, designs: designs.slice(8, 9) },
]

const PYRAMID_OFFSET = 180
const DESIGN_PRICE = 32
const PARALLAX_SPEED = 0.8
const SCRUB_TIME = 2.5
const SCROLL_DISTANCE = 2200

type DesignsPageProps = {
  onBack: () => void
  onNavigate: (path: string) => void
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  isCartOpen: boolean
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  notice: string
  isNoticeVisible: boolean
  showNotice: (msg: string) => void
  totalItems: number
  formattedSubtotal: string
  updateQuantity: (index: number, delta: number) => void
}

function MiniIcon({ name, size = 16 }: { name: 'arrow-left' | 'arrow-down' | 'arrow-up-right' | 'sliders' | 'close' | 'rotate' | 'sun' | 'moon' | 'bag' | 'check' | 'plus' | 'minus'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'arrow-left') return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  if (name === 'arrow-down') return <svg {...common}><path d="M12 5v14M18 13l-6 6-6-6" /></svg>
  if (name === 'arrow-up-right') return <svg {...common}><path d="M7 17 17 7M8 7h9v9" /></svg>
  if (name === 'sun') return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  if (name === 'moon') return <svg {...common}><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
  if (name === 'bag') return <svg {...common}><path d="M6.5 8.5h11l.8 11H5.7l.8-11Z" /><path d="M9 9V6.8a3 3 0 0 1 6 0V9" /></svg>
  if (name === 'check') return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>
  if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  if (name === 'minus') return <svg {...common}><path d="M5 12h14" /></svg>
  if (name === 'sliders') return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16M8 4v4M16 10v4M10 16v4" /></svg>
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
  return <svg {...common}><path d="M4 12a8 8 0 0 0 13.7 5.7L20 15.5M20 12a8 8 0 0 0-13.7-5.7L4 8.5M4 4v4.5h4.5M20 20v-4.5h-4.5" /></svg>
}

export function DesignsPage({ onBack, onNavigate, cart, setCart, isCartOpen, setIsCartOpen, notice, isNoticeVisible, showNotice, totalItems, formattedSubtotal, updateQuantity }: DesignsPageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [showBack, setShowBack] = useState(false)
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const modalCloseRef = useRef<HTMLButtonElement>(null)

  function switchTheme() {
    setThemeState(toggleTheme())
  }

  function addDesignToCart(design: Design) {
    const product: Product = {
      id: design.number,
      name: design.title,
      label: design.category,
      price: DESIGN_PRICE,
      color: '#f2762e',
      colorName: 'Tiger Orange',
      image: `IMG ${String(design.number).padStart(2, '0')}`,
      imageSrc: design.imageSrc,
      description: design.description,
      tag: design.category,
    }
    const existing = cart.find((item) => item.product.id === product.id && item.size === 'M' && item.colorName === product.colorName)
    if (existing) {
      setCart((prev) => prev.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart((prev) => [...prev, { product, size: 'M', colorName: product.colorName, text: 'RCHS', quantity: 1 }])
    }
    showNotice('Added to your bag')
  }

  useLayoutEffect(() => {
    document.title = 'All Designs · Richland County Tigers'
    if (window.matchMedia('(max-width: 767px)').matches) {
      const root = rootRef.current
      if (!root) return
      const cards = root.querySelectorAll<HTMLElement>('[data-design-card]')
      gsap.set(cards, { clearProps: 'all' })
      return
    }
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      const baseOffset = PYRAMID_OFFSET
      const center = root.querySelectorAll<HTMLElement>('[data-step="0"]')
      const stepOne = root.querySelectorAll<HTMLElement>('[data-step="1"]')
      const stepTwo = root.querySelectorAll<HTMLElement>('[data-step="2"]')
      const stepThree = root.querySelectorAll<HTMLElement>('[data-step="3"]')
      const cards = root.querySelectorAll<HTMLElement>('[data-design-card]')
      const grid = root.querySelector<HTMLElement>('[data-pyramid-grid]')
      const stage = root.querySelector<HTMLElement>('[data-pyramid-stage]')

      if (!grid || !stage) return
      gsap.set(center, { y: 0 })
      gsap.set(stepOne, { y: baseOffset * .9 })
      gsap.set(stepTwo, { y: baseOffset * 1.8 })
      gsap.set(stepThree, { y: baseOffset * 2.7 })
      gsap.set(cards, { opacity: .9, scale: .98 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${SCROLL_DISTANCE}`,
          scrub: SCRUB_TIME,
          pin: true,
          anticipatePin: 1,
        },
      })

      timeline.to(cards, { opacity: 1, scale: 1, duration: .3, ease: 'power1.out' }, 0)
      const centerDistance = -220 * PARALLAX_SPEED
      timeline.to(stepOne, { y: centerDistance - baseOffset * .7 * PARALLAX_SPEED, ease: 'power2.inOut' }, 0)
      timeline.to(stepTwo, { y: centerDistance - baseOffset * 1.5 * PARALLAX_SPEED, ease: 'power2.inOut' }, 0)
      timeline.to(stepThree, { y: centerDistance - baseOffset * 2.3 * PARALLAX_SPEED, ease: 'power2.inOut' }, 0)
      timeline.to(center, { y: centerDistance, ease: 'power2.inOut' }, 0.15)

      cards.forEach((card) => {
        // Decorative tilt: skip binding under reduced motion, and overwrite
        // in-flight tweens so fast mice don't stack competing tweens.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const handleMove = (event: Event) => {
          const pointerEvent = event as MouseEvent
          const rect = card.getBoundingClientRect()
          const rotateX = ((pointerEvent.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -12
          const rotateY = ((pointerEvent.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 12
          gsap.to(card, { rotateX, rotateY, transformPerspective: 800, duration: .3, ease: 'power1.out', overwrite: 'auto' })
        }
        const handleLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .5, ease: 'power2.out', overwrite: 'auto' })
        card.addEventListener('mousemove', handleMove)
        card.addEventListener('mouseleave', handleLeave)
      })
    }, root)

    return () => context.revert()
  }, [])

  useLayoutEffect(() => {
    if (!selectedDesign || !modalContentRef.current) return
    // Deliberate entrance (system response is the snap-back exit below).
    gsap.fromTo(modalContentRef.current, { scale: .8, opacity: 0, filter: 'blur(8px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: .35, ease: 'power3.out' })
  }, [selectedDesign])

  // Brief blur-masked exit before unmount so the modal doesn't teleport away.
  // Deliberate action (close press) animates slower; system snap-back is fast.
  function requestClose() {
    const node = modalContentRef.current
    if (!node) {
      setSelectedDesign(null)
      return
    }
    gsap.to(node, { opacity: 0, scale: .97, filter: 'blur(4px)', duration: .18, ease: 'power2.in', onComplete: () => setSelectedDesign(null) })
  }

  useEffect(() => {
    if (!selectedDesign) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    modalCloseRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose()
        return
      }
      if (event.key !== 'Tab' || !modalContentRef.current) return
      const focusables = Array.from(modalContentRef.current.querySelectorAll<HTMLElement>('button:not([disabled])'))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      previous?.focus()
    }
  }, [selectedDesign])

  useEffect(() => {
    if (!isCartOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCartOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isCartOpen, setIsCartOpen])

  return (
    <div ref={rootRef} className="pyramid-page min-h-screen bg-paper text-ink antialiased selection:bg-tiger selection:text-white">
      <header className="site-header">
        <button type="button" onClick={onBack} className="brand" aria-label="Back to the Richland County High School shop">
          <span className="brand-mark">RC</span>
          <span className="brand-copy"><strong>Richland County</strong><small>High School · Tigers</small></span>
        </button>
        <div className="header-actions">
          <button className="bag-button" type="button" onClick={switchTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'}>
            <MiniIcon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <button type="button" className="header-link" onClick={onBack}>Back to shop <MiniIcon name="arrow-up-right" size={15} /></button>
          <button className="bag-button" type="button" onClick={() => setIsCartOpen(true)} aria-label={`Open shopping bag, ${totalItems} items`}>
            <MiniIcon name="bag" size={19} /><span>{totalItems}</span>
          </button>
        </div>
      </header>

      <section className="flex min-h-[34vh] flex-col items-center justify-start px-5 pb-10 pt-12 text-center">
        <div className="top-line-indicator mb-4" />
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[.32em] text-tiger">The RCHS design archive</p>
        <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-.03em] md:text-5xl">
          <FadeText text="Every way to wear" direction="in" wordDelay={0.09} className="flex flex-wrap justify-center gap-x-[.26em]" />
          <FadeText text="the Tiger." direction="in" wordDelay={0.09} delay={0.55} className="mt-1 flex flex-wrap justify-center gap-x-[.26em] font-editorial text-tiger font-normal italic" />
        </h1>
        <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-[var(--muted)]">A living collection of marks, colors and ideas from the Richland County community.</p>
        <div className="mt-8 flex scroll-hint-bounce items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 font-mono text-[10px] tracking-wider text-[var(--muted)] dark:border-white/10 dark:bg-card"><MiniIcon name="arrow-down" size={14} /> Scroll to explore the archive</div>
      </section>

      <section className="pyramid-stage relative w-full overflow-hidden" data-pyramid-stage>
        <div className="flex min-h-screen w-full items-center px-3 py-12 md:px-6">
          <div className="pyramid-grid grid w-full max-w-[1780px] grid-cols-2 items-start gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4 lg:grid-cols-5 lg:gap-5" data-pyramid-grid>
            {columns.map((column, columnIndex) => <div key={`${column.step}-${columnIndex}`} className="flex flex-col gap-4" data-step={column.step} data-col-index={columnIndex}>
              {column.designs.map((design) => <button key={design.number} type="button" data-design-card className="pyramid-card square-card group relative w-full overflow-hidden rounded-2xl border border-black/10 bg-white text-left outline-none focus-visible:ring-2 focus-visible:ring-tiger dark:border-white/10 dark:bg-card" onClick={() => { setSelectedDesign(design); setShowBack(false) }} aria-label={`Open ${design.title} design`}>
                <img src={design.imageSrc} alt={design.title} width={400} height={400} loading="lazy" decoding="async" className="design-image absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="design-index absolute left-3 top-3 z-10 rounded-full bg-black/55 px-2 py-1 font-mono text-[9px] tracking-[.14em] text-white backdrop-blur">IMG {String(design.number).padStart(2, '0')}</span>
                <span className="design-center absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-1 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 pt-10 text-left"><strong className="text-sm font-extrabold leading-none tracking-[-.04em] text-white drop-shadow">{design.title}</strong><small className="font-mono text-[8px] tracking-[.16em] text-white/80">{design.category}</small></span>
                <span className="design-overlay absolute inset-0 z-20 flex flex-col justify-end p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100"><b className="font-mono text-[9px] uppercase tracking-[.12em] text-orange-300">#{String(design.number).padStart(2, '0')} {design.category}</b><span className="mt-1 text-xs font-semibold text-white">{design.description}</span></span>
              </button>)}
            </div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-5 py-10 text-center font-mono text-[10px] tracking-wider text-[var(--muted)] dark:border-white/10"><button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-tiger transition hover:text-[var(--orange-deep)]"><MiniIcon name="arrow-left" size={14} /> Back to the Tiger shop</button><p>RCHS design archive · 2026</p></footer>

       <div className={isCartOpen ? 'cart-overlay is-open' : 'cart-overlay'} onClick={() => setIsCartOpen(false)} />
      <aside className={isCartOpen ? 'cart-drawer is-open' : 'cart-drawer'} aria-label="Shopping bag" aria-hidden={!isCartOpen}><div className="cart-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag <span>{totalItems}</span></h2></div><button type="button" aria-label="Close shopping bag" onClick={() => setIsCartOpen(false)}><MiniIcon name="close" /></button></div><div className="cart-items">{cart.length === 0 ? <div className="empty-cart"><div className="empty-bag"><MiniIcon name="bag" size={24} /></div><h3>Your bag is waiting.</h3><p>Choose a design and make it yours.</p><button className="text-link" type="button" onClick={() => setIsCartOpen(false)}>Keep browsing <MiniIcon name="arrow-up-right" size={15} /></button></div> : cart.map((item, index) => <div className="cart-item" key={`${item.product.id}-${item.size}-${item.colorName}`}><div className="cart-item-image"><img src={item.product.imageSrc} alt={item.product.name} width={83} height={83} loading="lazy" decoding="async" /></div><div className="cart-item-copy"><div><strong>{item.product.name}</strong><span>{item.colorName} · {item.size}</span></div><strong>${(item.product.price * item.quantity).toFixed(2)}</strong><div className="quantity"><button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(index, -1)}><MiniIcon name="minus" size={13} /></button><span>{item.quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(index, 1)}><MiniIcon name="plus" size={13} /></button></div></div></div>)}</div><div className="cart-footer"><div><span>Subtotal</span><strong>{formattedSubtotal}</strong></div><button className="button button-dark checkout-button" type="button" onClick={() => { setIsCartOpen(false); onNavigate('/order') }} disabled={cart.length === 0}>Checkout <MiniIcon name="arrow-up-right" size={16} /></button><p>Pickup at Richland County High School is always free.</p></div></aside>
      <div className={isNoticeVisible ? 'notice is-visible' : 'notice'} role="status"><span><MiniIcon name="check" size={15} /></span>{notice}</div>

      {selectedDesign && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-5 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label={`${selectedDesign.title} preview`} onClick={() => requestClose()}><div ref={modalContentRef} className="design-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="design-modal-close absolute right-0 top-0 z-10 text-white/70 transition hover:text-white" aria-label="Close design preview" ref={modalCloseRef} onClick={() => requestClose()}><MiniIcon name="close" /></button><div className="design-modal-title"><p>{selectedDesign.category}</p><h2>{selectedDesign.title}</h2><span>{selectedDesign.description}</span></div><div className="design-modal-art overflow-hidden rounded-2xl bg-white p-2"><div className={`flip-card ${showBack ? 'is-flipped' : ''}`} onClick={() => setShowBack((v) => !v)}><div className="flip-inner"><div className="flip-face flip-front"><img src={selectedDesign.imageSrc} alt={`${selectedDesign.title} front`} width={620} height={620} className="h-auto w-full rounded-xl object-cover" /></div><div className="flip-face flip-back"><img src={selectedDesign.backSrc} alt={`${selectedDesign.title} back`} width={620} height={620} className="h-auto w-full rounded-xl object-cover" /></div></div></div><div className="mt-3 flex items-center justify-between px-2 pb-2"><span className="font-mono text-[10px] tracking-widest text-black/60">{showBack ? 'BACK' : 'FRONT'}</span><button type="button" onClick={() => setShowBack((v) => !v)} className="font-mono text-[10px] tracking-widest text-tiger underline">{showBack ? 'View front →' : 'View back →'}</button></div><button type="button" onClick={() => { if (selectedDesign) addDesignToCart(selectedDesign) }} className="button button-orange mx-auto mt-2 flex w-full max-w-[320px] justify-center">Add to bag — ${DESIGN_PRICE} <MiniIcon name="arrow-up-right" size={15} /></button></div></div></div>}
    </div>
  )
}
