import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import SpinImage from './components/originkit/ui/spinimage'
import { FadeText } from './components/ui/fade-text'
import { MobileProductCarousel } from './components/mobile-product-carousel'
import { MobileHeroCircle } from './components/mobile-hero-circle'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from './components/ui/expandable-screen'
import { getTheme, toggleTheme, type Theme } from './theme'
import { heroShirtUrls, SHIRT_LIST, shirtImages } from './shirts'

const DesignsPage = lazy(() => import('./DesignsPage').then((module) => ({ default: module.DesignsPage })))
const OrderPage = lazy(() => import('./OrderPage').then((module) => ({ default: module.OrderPage })))
const VerifyPage = lazy(() => import('./VerifyPage').then((module) => ({ default: module.VerifyPage })))

type IconName = 'arrow-up-right' | 'arrow-right' | 'bag' | 'menu' | 'close' | 'check' | 'plus' | 'minus' | 'star' | 'chevron-left' | 'chevron-right' | 'sun' | 'moon'

export type Product = {
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

export type CartItem = {
  product: Product
  size: string
  colorName: string
  text: string
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Claw Stripes',
    label: 'School Mark',
    price: 32,
    color: '#9AA0A6',
    colorName: 'Gray',
    image: 'IMG 01',
    imageSrc: shirtImages.front[1],
    description: 'Orange claw tears over OTN · RCHS on heather charcoal.',
    tag: 'Best seller',
  },
  {
    id: 2,
    name: 'One Tiger Nation',
    label: 'Community',
    price: 32,
    color: '#f2762e',
    colorName: 'Orange',
    image: 'IMG 02',
    imageSrc: shirtImages.front[2],
    description: 'Hand-rough caps on tiger orange. One school, one roar.',
    tag: 'New',
  },
  {
    id: 3,
    name: 'Tigers Block',
    label: 'Varsity',
    price: 32,
    color: '#FFFFFF',
    colorName: 'White',
    image: 'IMG 03',
    imageSrc: shirtImages.front[3],
    description: 'Classic varsity block, outlined in tiger orange.',
    tag: 'Varsity',
  },
  {
    id: 4,
    name: 'Always Be A Tiger',
    label: 'Spirit Wear',
    price: 32,
    color: '#9AA0A6',
    colorName: 'Gray',
    image: 'IMG 04',
    imageSrc: shirtImages.front[4],
    description: 'Tribal half-tiger + mantra on dark heather.',
    tag: 'Spirit',
  },
  {
    id: 5,
    name: 'Tiger Strong',
    label: 'Athletics',
    price: 32,
    color: '#0f0f0f',
    colorName: 'Black',
    image: 'IMG 05',
    imageSrc: shirtImages.front[5],
    description: 'Zebra-filled block letters in off-white on charcoal.',
    tag: 'Athletics',
  },
  {
    id: 6,
    name: 'Two-Tone Tiger',
    label: 'School Mark',
    price: 32,
    color: '#9AA0A6',
    colorName: 'Gray',
    image: 'IMG 06',
    imageSrc: shirtImages.front[6],
    description: 'Split face — half ice, half fire. White and tiger orange.',
    tag: 'Heritage',
  },
  {
    id: 7,
    name: 'Seniors',
    label: 'Senior Edition',
    price: 32,
    color: '#0f0f0f',
    colorName: 'Black',
    image: 'IMG 07',
    imageSrc: shirtImages.front[7],
    description: 'FRIENDS-inspired dotted type for the Class of 2026 on black.',
    tag: 'Seniors',
  },
  {
    id: 8,
    name: 'Tigers Volleyball',
    label: 'Volleyball',
    price: 32,
    color: '#0f0f0f',
    colorName: 'Black',
    image: 'IMG 08',
    imageSrc: shirtImages.front[8],
    description: 'Half tiger, half volleyball — TIGERS vertical in orange on black.',
    tag: 'Volleyball',
  },
  {
    id: 9,
    name: 'Paw Pride',
    label: 'Minimal',
    price: 32,
    color: '#FFFFFF',
    colorName: 'White',
    image: 'IMG 09',
    imageSrc: shirtImages.front[9],
    description: 'Tiny white paw, left chest. Quiet pride on black.',
    tag: 'Minimal',
  },
]

const colorOptions = [
  { name: 'Orange', value: '#f2762e' },
  { name: 'Gray', value: '#9AA0A6' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#0f0f0f' },
]

const sizes = ['S', 'M', 'L', 'XL', '2XL']

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }

  switch (name) {
    case 'arrow-up-right': return <svg {...common}><path d="M7 17 17 7M8 7h9v9" /></svg>
    case 'arrow-right': return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" /></svg>
    case 'bag': return <svg {...common}><path d="M6.5 8.5h11l.8 11H5.7l.8-11Z" /><path d="M9 9V6.8a3 3 0 0 1 6 0V9" /></svg>
    case 'menu': return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'close': return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
    case 'check': return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
    case 'minus': return <svg {...common}><path d="M5 12h14" /></svg>
    case 'star': return <svg {...common} fill="currentColor" stroke="none"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>
    case 'chevron-left': return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>
    case 'chevron-right': return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>
    case 'sun': return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    case 'moon': return <svg {...common}><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 680px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 680px)')
    const update = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isMobile
}

function Storefront({ onNavigate, onNavigateOrder, cart, setCart, isCartOpen, setIsCartOpen, notice, isNoticeVisible, showNotice, totalItems, formattedSubtotal, updateQuantity }: { onNavigate: (path: string) => void; onNavigateOrder: () => void; cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; isCartOpen: boolean; setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>; notice: string; isNoticeVisible: boolean; showNotice: (msg: string) => void; totalItems: number; formattedSubtotal: string; updateQuantity: (index: number, delta: number) => void }) {
  const [activeProductId, setActiveProductId] = useState(1)
  const isMobile = useIsMobile()
  const [scrollProgress, setScrollProgress] = useState(0)
  const stickySectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const scrollProductRef = useRef(1)
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [selectedSize, setSelectedSize] = useState('M')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [theme, setThemeState] = useState<Theme>(getTheme)

  function switchTheme() {
    setThemeState(toggleTheme())
  }

  useEffect(() => {
    if (!isCartOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCartOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isCartOpen, setIsCartOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    const handleClick = (event: MouseEvent) => {
      const header = headerRef.current
      if (header && event.target instanceof Node && !header.contains(event.target)) setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClick)
    }
  }, [isMenuOpen])

  useEffect(() => {
    document.title = 'RCHS Store - Richland County Tigers'
  }, [])

  const activeProduct = products.find((product) => product.id === activeProductId) ?? products[0]

  useEffect(() => {
    if (isMobile) return
    let frame = 0

    function updateFromScroll() {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const section = stickySectionRef.current
        if (!section) return
        const totalScrollable = section.offsetHeight - window.innerHeight
        const progress = totalScrollable > 0 ? Math.max(0, Math.min(1, -section.getBoundingClientRect().top / totalScrollable)) : 0
        const nextIndex = Math.min(products.length - 1, Math.floor(progress * products.length))
        setScrollProgress(progress)
        if (scrollProductRef.current !== nextIndex + 1) {
          scrollProductRef.current = nextIndex + 1
          const nextProduct = products[nextIndex]
          if (nextProduct) {
            const matched = colorOptions.find((option) => option.name === nextProduct.colorName)
            if (matched) setSelectedColor(matched)
          }
        }
        setActiveProductId((currentId) => currentId === nextIndex + 1 ? currentId : nextIndex + 1)
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
  }, [isMobile])

  function selectProduct(product: Product, syncScroll = false) {
    scrollProductRef.current = product.id
    setActiveProductId(product.id)
    setScrollProgress((product.id - 1) / (products.length - 1))
    const matchingColor = colorOptions.find((option) => option.name === product.colorName)
    if (matchingColor) setSelectedColor(matchingColor)

    if (syncScroll && stickySectionRef.current) {
      const section = stickySectionRef.current
      const totalScrollable = section.offsetHeight - window.innerHeight
      const sectionTop = window.scrollY + section.getBoundingClientRect().top
      window.scrollTo({ top: sectionTop + totalScrollable * ((product.id - 1) / (products.length - 1)), behavior: 'smooth' })
    }
  }

  function addToCart() {
    const existing = cart.find((item) => item.product.id === activeProduct.id && item.size === selectedSize && item.colorName === selectedColor.name)
    if (existing) {
      setCart(cart.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { product: activeProduct, size: selectedSize, colorName: selectedColor.name, text: 'RCHS', quantity: 1 }])
    }
    showNotice('Added to your bag')
  }

  const shirtPicker = (
    <ExpandableScreen layoutId="shirt-picker" triggerRadius="12px" contentRadius="20px">
      <ExpandableScreenTrigger>
        <div className="control-group">
          <label>02 / Select your shirt <span>{activeProduct.name}</span></label>
          <div className="shirt-picker-trigger">
            <img src={activeProduct.imageSrc} alt={activeProduct.name} width={64} height={64} />
            <div>
              <strong>{activeProduct.name}</strong>
              <span>{activeProduct.label} · ${activeProduct.price.toFixed(2)}</span>
            </div>
            <Icon name="chevron-right" size={18} />
          </div>
        </div>
      </ExpandableScreenTrigger>
      <ExpandableScreenContent className="bg-paper">
        <div className="shirt-picker-header">
          <p className="eyebrow">Choose a shirt</p>
          <h3>Select your <em>design.</em></h3>
          <p className="shirt-picker-hint">9 designs · Tap to select. Future variants per color coming soon.</p>
        </div>
        <div className="shirt-picker-grid">
          {SHIRT_LIST.map((shirt) => (
            <button
              key={shirt.id}
              type="button"
              onClick={() => {
                const product = products.find((p) => p.id === shirt.id)
                if (product) {
                  setActiveProductId(product.id)
                  const matchingColor = colorOptions.find((c) => c.name === product.colorName)
                  if (matchingColor) setSelectedColor(matchingColor)
                }
              }}
              className={activeProductId === shirt.id ? 'shirt-picker-card is-selected' : 'shirt-picker-card'}
              aria-pressed={activeProductId === shirt.id}
            >
              <img src={shirt.imageSrc} alt={shirt.name} width={280} height={280} loading="lazy" decoding="async" />
              <div className="shirt-picker-card-info">
                <strong>{shirt.name}</strong>
                <span>{shirt.label}</span>
              </div>
              {activeProductId === shirt.id && <span className="shirt-picker-check"><Icon name="check" size={14} /></span>}
            </button>
          ))}
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  )

  const customizerPanel = (
    <div className="customizer-panel">
      <p className="eyebrow">Make it yours</p><h3>Customize your<br /><em>school spirit.</em></h3>
      <p className="customizer-copy">Personalize the details that make this tee feel like yours.</p>
      <div className="control-group"><label>01 / Select a color <span>{selectedColor.name}</span></label><div className="color-options">{colorOptions.map((color) => <button key={color.name} className={selectedColor.name === color.name ? 'color-swatch selected' : 'color-swatch'} style={{ backgroundColor: color.value }} type="button" aria-label={color.name} aria-pressed={selectedColor.name === color.name} onClick={() => setSelectedColor(color)}><span>{selectedColor.name === color.name && <Icon name="check" size={14} />}</span></button>)}</div></div>
      {shirtPicker}
      <div className="control-group"><div className="control-label-row"><label>03 / Choose your size</label><button type="button" className="size-guide-toggle" aria-expanded={isSizeGuideOpen} onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}>Size guide</button></div>{isSizeGuideOpen && <table className="size-guide"><thead><tr><th scope="col">Size</th><th scope="col">Chest (in)</th><th scope="col">Length (in)</th></tr></thead><tbody><tr><td>S</td><td>34-36</td><td>27</td></tr><tr><td>M</td><td>38-40</td><td>28</td></tr><tr><td>L</td><td>42-44</td><td>29</td></tr><tr><td>XL</td><td>46-48</td><td>30</td></tr><tr><td>2XL</td><td>50-52</td><td>31</td></tr></tbody></table>}<div className="size-options">{sizes.map((size) => <button key={size} type="button" className={selectedSize === size ? 'size-option selected' : 'size-option'} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size}>{size}</button>)}</div></div>
      <button className="button button-orange add-button" type="button" onClick={addToCart}>Add to bag <span>${activeProduct.price.toFixed(2)}</span> <Icon name="arrow-up-right" size={16} /></button>
    </div>
  )

  return (
    <div className="site-shell">
      <header className="site-header" ref={headerRef}>
        <a className="brand" href="#top" aria-label="Richland County High School home">
          <span className="brand-mark">RC</span>
          <span className="brand-copy"><strong>Richland County</strong><small>High School · Tigers</small></span>
        </a>
        <nav className={isMenuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Primary navigation">
          <a href="#shop" onClick={() => setIsMenuOpen(false)}>Shop</a>
          <a href="#story" onClick={() => setIsMenuOpen(false)}>Our story</a>
          <a href="#details" onClick={() => setIsMenuOpen(false)}>Details</a>
        </nav>
        <div className="header-actions">
          <button className="bag-button" type="button" onClick={switchTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <a className="header-link" href="#shop">Build your tee <Icon name="arrow-up-right" size={15} /></a>
          <button className="bag-button" type="button" onClick={() => setIsCartOpen(true)} aria-label={`Open shopping bag, ${totalItems} items`}>
            <Icon name="bag" size={19} /><span>{totalItems}</span>
          </button>
          <button className="menu-button" type="button" aria-label="Toggle menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}><Icon name={isMenuOpen ? 'close' : 'menu'} /></button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <h1>
              <FadeText text="Wear the" direction="in" wordDelay={0.45} duration={1.3} className="flex flex-wrap gap-x-[.22em]" />
              <span className="flex flex-wrap items-baseline gap-x-[.22em]">
                <FadeText text="Tiger" direction="in" delay={1} duration={1.3} className="inline-flex gap-x-[.22em] font-editorial font-normal italic text-tiger" />
                <FadeText text="within." direction="in" delay={1.45} duration={1.3} className="inline-flex gap-x-[.22em]" />
              </span>
            </h1>
            <p className="hero-description rise" style={{ animationDelay: '2.5s' }}>A new take on school spirit. Designed by our community, made to move with yours.</p>
            <a className="button button-dark rise" style={{ animationDelay: '2.7s' }} href="#shop">Explore the collection <Icon name="arrow-right" size={16} /></a>
            <p className="hero-note rise" style={{ animationDelay: '2.85s' }}>Made for students, families &amp; the whole Tiger community.</p>
          </div>
          <div className="hero-stage" aria-label="Featured Tigers apparel placeholders">
            <div className="stage-orbit orbit-one" />
            <div className="stage-orbit orbit-two" />
            <div className="hero-spinimage" aria-label="Spinning RCHS apparel">
              <SpinImage images={heroShirtUrls} imageWidth={150} imageHeight={200} direction="anticlockwise" path="curved" xCurve={-28} yCurve={-18} speed={1.6} rounded={16} orbitUnit="%" orbitWidthPct={58} />
            </div>
            <MobileHeroCircle images={heroShirtUrls.slice(0, 5)} />
            <div className="hero-sticker">RCHS<br /><b>TIGERS</b></div>
            <div className="stage-caption"><span>01 / 04</span><span>Scroll to explore ↓</span></div>
          </div>
        </section>

        <section className="ticker" aria-label="Collection highlights">
          <div>Built for the <b>bleachers</b></div><i />
          <div>Designed for <b>everyday</b></div><i />
          <div>Made for <b>Richland</b></div><i />
          <div>Built for the <b>bleachers</b></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-intro">
            <div><p className="eyebrow">01 / The collection</p><h2>Find your<br /><em>everyday</em> uniform.</h2></div>
          </div>

          {isMobile ? (
            <MobileProductCarousel products={products} activeId={activeProductId} onSelect={(id) => selectProduct(products.find((p) => p.id === id) ?? products[0])} />
          ) : (
          <div className="sticky-product-section relative w-screen" ref={stickySectionRef}>
            <div className="sticky-product-viewport sticky top-0 h-screen w-full">
          <div className="shop-layout relative grid w-full">
            <div className="product-preview">
              <div className="preview-topline"><span>{activeProduct.label}</span><span>Made to order</span></div>
              <div className="preview-art" style={{ '--shirt-color': selectedColor.value } as React.CSSProperties}>
                <div className="preview-glow" />
                <div className="shirt-placeholder"><img src={activeProduct.imageSrc} alt={activeProduct.name} width={320} height={330} loading="eager" decoding="async" /></div>
                <div className="preview-label"><span>RCHS / 26</span><b>RCHS</b></div>
              </div>
              <div className="preview-bottom"><div><span className="preview-index">0{activeProduct.id} / {String(products.length).padStart(2, '0')}</span><h3>{activeProduct.name}</h3></div><span className="price">${activeProduct.price.toFixed(2)}</span></div>
            </div>

            {customizerPanel}

            <aside className="rail-carousel absolute right-0" aria-label="Explore the Tiger collection">
              <div className="rail-header"><div><p className="eyebrow">Explore</p><strong>Tiger styles</strong></div><span>{String(activeProduct.id).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</span></div>
              <div className="rail-viewport"><div className="rail-line" />{products.map((product, index) => { const distance = index - scrollProgress * (products.length - 1); const absoluteDistance = Math.abs(distance); const curve = Math.max(0, 1 - Math.pow(Math.min(absoluteDistance, 1), 1.8)); const opacity = absoluteDistance <= 1.25 ? Math.max(0, 1 - Math.pow(absoluteDistance / 1.3, 3)) : 0; return <button key={product.id} type="button" aria-label={`Select ${product.name}`} aria-current={activeProduct.id === product.id ? 'true' : undefined} className={activeProduct.id === product.id ? 'rail-card is-active' : 'rail-card'} style={{ opacity, zIndex: Math.round(10 - absoluteDistance * 3), transform: `translate3d(${-curve * 24}px, ${distance * 148}px, 0) rotate(${-distance * 11}deg) scale(${0.8 + curve * 0.2})`, filter: `blur(${Math.min(absoluteDistance * .7, 2)}px)`, pointerEvents: opacity > .15 ? 'auto' : 'none' }} onClick={() => selectProduct(product, true)}><div className="rail-card-media"><img src={product.imageSrc} alt={product.name} width={320} height={218} loading="lazy" decoding="async" /></div><div className="rail-card-copy"><strong>{product.name}</strong><span>${product.price.toFixed(2)}</span></div></button>})}</div>
              <div className="rail-bottom"><div className="rail-scroll-label"><span>Scroll to explore</span><div className="rail-progress"><i style={{ width: `${Math.round(scrollProgress * 100)}%` }} /></div></div><div className="rail-controls"><button type="button" aria-label="Previous product" onClick={() => selectProduct(products[(activeProductId - 2 + products.length) % products.length], true)}><Icon name="chevron-left" size={15} /></button><button type="button" aria-label="Next product" onClick={() => selectProduct(products[activeProductId % products.length], true)}><Icon name="chevron-right" size={15} /></button></div></div>
            </aside>
          </div>
            </div>
          </div>
          )}

          {isMobile && (
            <section className="mobile-customizer" aria-label="Customize your tee">
              {customizerPanel}
            </section>
          )}

          <div className="designs-callout">
            <p className="designs-callout-copy">Choose a base, make it yours, and carry a little Richland wherever you go.</p>
            <button className="button button-orange" type="button" onClick={() => onNavigate('/designs')}>View all our designs <Icon name="arrow-up-right" size={16} /></button>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-visual"><div className="story-placeholder"><span>IMG 05</span><small>community image</small></div><span className="story-stamp">EST.<br /><b>RCHS</b><br />1910</span></div>
          <div className="story-copy"><p className="eyebrow">02 / Our story</p><h2>More than a<br /><em>logo.</em></h2><p>Richland County High School is made of early mornings, loud stands, hard work and the people who keep showing up. This collection is a wearable reminder of that shared place.</p><a className="text-link" href="#details">About the collection <Icon name="arrow-right" size={15} /></a></div>
        </section>

        <section className="details-section" id="details"><div className="details-intro"><p className="eyebrow">03 / The details</p><h2>Good design<br />goes <em>further.</em></h2></div><div className="detail-grid"><div><span className="detail-number">01</span><h3>Made for movement</h3><p>Soft, durable cotton with room to move from first bell to final whistle.</p></div><div><span className="detail-number">02</span><h3>Made by our community</h3><p>Every style starts with the spirit, stories and colors of Richland County.</p></div><div><span className="detail-number">03</span><h3>Made to be yours</h3><p>Personalize your favorite piece and make the school store feel personal.</p></div></div></section>

        <section className="order-cta" aria-label="Place your order">
          <div className="order-cta-inner">
            <div className="order-cta-copy">
              <p className="eyebrow">Ready to order?</p>
              <h2>Carry a little <em>Richland</em> with you.</h2>
              <p>{totalItems === 0 ? 'Your bag is empty — add a tee and checkout in seconds. Pickup at RCHS is free.' : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your bag — ready when you are.`}</p>
            </div>
            <div className="order-cta-actions">
              <button className="button button-orange" type="button" onClick={() => setIsCartOpen(true)}>{totalItems > 0 ? `Review bag · ${formattedSubtotal}` : 'Review your bag'} <Icon name="arrow-up-right" size={16} /></button>
              <button className="button button-dark" type="button" onClick={() => onNavigate('/designs')}>Browse all 9 designs <Icon name="arrow-right" size={16} /></button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark">RC</span><span><strong>Richland County</strong><small>High School · Tigers</small></span></div><p>Official merchandise for the Tiger community.</p><span>© 2026 RCHS</span></footer>

       <div className={isCartOpen ? 'cart-overlay is-open' : 'cart-overlay'} onClick={() => setIsCartOpen(false)} />
        <aside className={isCartOpen ? 'cart-drawer is-open' : 'cart-drawer'} aria-label="Shopping bag" aria-hidden={!isCartOpen}><div className="cart-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag <span>{totalItems}</span></h2></div><button type="button" aria-label="Close shopping bag" onClick={() => setIsCartOpen(false)}><Icon name="close" /></button></div><div className="cart-items">{cart.length === 0 ? <div className="empty-cart"><div className="empty-bag"><Icon name="bag" size={24} /></div><h3>Your bag is waiting.</h3><p>Choose a piece from the collection and make it yours.</p><button className="text-link" type="button" onClick={() => setIsCartOpen(false)}>Keep browsing <Icon name="arrow-right" size={15} /></button></div> : cart.map((item, index) => <div className="cart-item" key={`${item.product.id}-${item.size}-${item.colorName}`}><div className="cart-item-image"><img src={item.product.imageSrc} alt={item.product.name} width={83} height={83} loading="lazy" decoding="async" /></div><div className="cart-item-copy"><div><strong>{item.product.name}</strong><span>{item.colorName} · {item.size}</span></div><strong>${(item.product.price * item.quantity).toFixed(2)}</strong><div className="quantity"><button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(index, -1)}><Icon name="minus" size={13} /></button><span>{item.quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(index, 1)}><Icon name="plus" size={13} /></button></div></div></div>)}</div><div className="cart-footer"><div><span>Subtotal</span><strong>{formattedSubtotal}</strong></div><button className="button button-dark checkout-button" type="button" onClick={() => { setIsCartOpen(false); onNavigateOrder() }} disabled={cart.length === 0}>Checkout <Icon name="arrow-up-right" size={16} /></button><p>Pickup at Richland County High School is always free.</p></div></aside>
      <div className={isNoticeVisible ? 'notice is-visible' : 'notice'} role="status"><span><Icon name="check" size={15} /></span>{notice}</div>
    </div>
  )
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('rchs-cart')
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [isNoticeVisible, setIsNoticeVisible] = useState(false)
  const noticeTimerRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem('rchs-cart', JSON.stringify(cart))
    } catch {
      return
    }
  }, [cart])

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => () => window.clearTimeout(noticeTimerRef.current), [])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const formattedSubtotal = useMemo(() => `$${subtotal.toFixed(2)}`, [subtotal])

  function navigate(nextPath: string) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function showNotice(message: string) {
    setNotice(message)
    window.clearTimeout(noticeTimerRef.current)
    noticeTimerRef.current = window.setTimeout(() => setIsNoticeVisible(false), 2600)
    setIsNoticeVisible(true)
  }

  function updateQuantity(index: number, delta: number) {
    setCart((prev) => prev.flatMap((item, itemIndex) => {
      if (itemIndex !== index) return [item]
      const quantity = item.quantity + delta
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  return (
    <Suspense fallback={null}>
      {path === '/order' ? (
        <OrderPage cart={cart} totalItems={totalItems} formattedSubtotal={formattedSubtotal} updateQuantity={updateQuantity} onNavigate={navigate} showNotice={showNotice} />
      ) : path.startsWith('/verify') ? (
        <VerifyPage onNavigate={navigate} />
      ) : path === '/designs' ? (
        <DesignsPage onBack={() => navigate('/')} onNavigate={navigate} cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} notice={notice} isNoticeVisible={isNoticeVisible} showNotice={showNotice} totalItems={totalItems} formattedSubtotal={formattedSubtotal} updateQuantity={updateQuantity} />
      ) : (
        <Storefront onNavigate={navigate} cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} notice={notice} isNoticeVisible={isNoticeVisible} showNotice={showNotice} totalItems={totalItems} formattedSubtotal={formattedSubtotal} updateQuantity={updateQuantity} onNavigateOrder={() => navigate('/order')} />
      )}
    </Suspense>
  )
}

export default App
