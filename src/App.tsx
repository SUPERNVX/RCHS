import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { DesignsPage } from './DesignsPage'
import SpinImage from './components/originkit/ui/spinimage'
import { FadeText } from './components/ui/fade-text'
import { MobileProductStack } from './components/mobile-product-stack'
import { getTheme, toggleTheme, type Theme } from './theme'

type IconName = 'arrow-up-right' | 'arrow-right' | 'bag' | 'menu' | 'close' | 'check' | 'plus' | 'minus' | 'star' | 'chevron-left' | 'chevron-right' | 'sun' | 'moon'

type Product = {
  id: number
  name: string
  label: string
  price: number
  color: string
  colorName: string
  image: string
  description: string
  tag: string
}

type CartItem = {
  product: Product
  size: string
  colorName: string
  text: string
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'The Tiger Tee',
    label: 'Core collection',
    price: 32,
    color: '#f2762e',
    colorName: 'Tiger Orange',
    image: 'IMG 01',
    description: 'A clean, everyday classic made for showing up in Tiger style.',
    tag: 'Best seller',
  },
  {
    id: 2,
    name: 'Richland Varsity',
    label: 'Limited run',
    price: 38,
    color: '#18202a',
    colorName: 'Midnight',
    image: 'IMG 02',
    description: 'A heavyweight school spirit layer with a timeless varsity feel.',
    tag: 'New',
  },
  {
    id: 3,
    name: 'Tiger Track Tee',
    label: 'Athletics edit',
    price: 34,
    color: '#d9d4ca',
    colorName: 'Stone',
    image: 'IMG 03',
    description: 'Lightweight, easy and ready for the field, stands or the weekend.',
    tag: 'Athletics',
  },
  {
    id: 4,
    name: 'County Classic',
    label: 'Alumni collection',
    price: 36,
    color: '#e7e2d9',
    colorName: 'Ivory',
    image: 'IMG 04',
    description: 'A soft neutral base for a personal take on the Richland identity.',
    tag: 'Classic',
  },
]

const colorOptions = [
  { name: 'Tiger Orange', value: '#f2762e' },
  { name: 'Midnight', value: '#18202a' },
  { name: 'Stone', value: '#d9d4ca' },
  { name: 'Ivory', value: '#e7e2d9' },
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

function Storefront({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeProductId, setActiveProductId] = useState(1)
  const isMobile = useIsMobile()
  const [scrollProgress, setScrollProgress] = useState(0)
  const stickySectionRef = useRef<HTMLDivElement>(null)
  const scrollProductRef = useRef(1)
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [selectedSize, setSelectedSize] = useState('M')
  const [customText, setCustomText] = useState('RCHS')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [isNoticeVisible, setIsNoticeVisible] = useState(false)
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const noticeTimerRef = useRef(0)

  function switchTheme() {
    setThemeState(toggleTheme())
  }

  function handleStackProductChange(product: Product) {
    setActiveProductId(product.id)
    const matchingColor = colorOptions.find((option) => option.name === product.colorName)
    if (matchingColor) setSelectedColor(matchingColor)
  }

  useEffect(() => () => window.clearTimeout(noticeTimerRef.current), [])

  useEffect(() => {
    if (!isCartOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCartOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isCartOpen])

  const activeProduct = products.find((product) => product.id === activeProductId) ?? products[0]
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const formattedSubtotal = useMemo(() => `$${subtotal.toFixed(2)}`, [subtotal])

  useEffect(() => {
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
          setSelectedColor(colorOptions[nextIndex])
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
  }, [])

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

  function showNotice(message: string) {
    setNotice(message)
    window.clearTimeout(noticeTimerRef.current)
    noticeTimerRef.current = window.setTimeout(() => setIsNoticeVisible(false), 2600)
    setIsNoticeVisible(true)
  }

  function addToCart() {
    const existing = cart.find((item) => item.product.id === activeProduct.id && item.size === selectedSize && item.colorName === selectedColor.name && item.text === customText)
    if (existing) {
      setCart(cart.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { product: activeProduct, size: selectedSize, colorName: selectedColor.name, text: customText, quantity: 1 }])
    }
    showNotice('Added to your bag')
  }

  function updateQuantity(index: number, delta: number) {
    setCart(cart.flatMap((item, itemIndex) => {
      if (itemIndex !== index) return [item]
      const quantity = item.quantity + delta
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  const customizerPanel = (
    <div className="customizer-panel">
      <p className="eyebrow">Make it yours</p><h3>Customize your<br /><em>school spirit.</em></h3>
      <p className="customizer-copy">Personalize the details that make this tee feel like yours.</p>
      <div className="control-group"><label>01 / Select a color <span>{selectedColor.name}</span></label><div className="color-options">{colorOptions.map((color) => <button key={color.name} className={selectedColor.name === color.name ? 'color-swatch selected' : 'color-swatch'} style={{ backgroundColor: color.value }} type="button" aria-label={color.name} aria-pressed={selectedColor.name === color.name} onClick={() => setSelectedColor(color)}><span>{selectedColor.name === color.name && <Icon name="check" size={14} />}</span></button>)}</div></div>
      <div className="control-group"><label htmlFor="custom-text">02 / Add your text <span>{customText.length}/14</span></label><input id="custom-text" value={customText} maxLength={14} onChange={(event) => setCustomText(event.target.value.toUpperCase())} placeholder="YOUR TEXT" /></div>
      <div className="control-group"><label>03 / Choose your size <span>Size guide</span></label><div className="size-options">{sizes.map((size) => <button key={size} type="button" className={selectedSize === size ? 'size-option selected' : 'size-option'} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size}>{size}</button>)}</div></div>
      <button className="button button-orange add-button" type="button" onClick={addToCart}>Add to bag <span>${activeProduct.price.toFixed(2)}</span> <Icon name="arrow-up-right" size={16} /></button>
    </div>
  )

  return (
    <div className="site-shell">
      <header className="site-header">
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
            <div className="hero-spinimage" aria-label="Spinning RCHS apparel image placeholders">
              <SpinImage images={['IMG 01', 'IMG 02', 'IMG 03', 'IMG 04', 'IMG 05', 'IMG 06', 'IMG 07', 'IMG 08']} imageWidth={150} imageHeight={200} direction="anticlockwise" path="curved" xCurve={-28} yCurve={-18} speed={1.6} rounded={4} orbitUnit="%" orbitWidthPct={58} placeholder />
            </div>
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
            <MobileProductStack products={products} onActiveChange={handleStackProductChange} />
          ) : (
          <div className="sticky-product-section relative w-screen" ref={stickySectionRef}>
            <div className="sticky-product-viewport sticky top-0 h-screen w-full">
          <div className="shop-layout relative grid w-full">
            <div className="product-preview">
              <div className="preview-topline"><span>{activeProduct.label}</span><span>Made to order</span></div>
              <div className="preview-art" style={{ '--shirt-color': selectedColor.value } as React.CSSProperties}>
                <div className="preview-glow" />
                <div className="shirt-placeholder"><span>{activeProduct.image}</span><small>product image</small></div>
                <div className="preview-label"><span>RCHS / 26</span><b>{customText || 'YOUR TEXT'}</b></div>
              </div>
              <div className="preview-bottom"><div><span className="preview-index">0{activeProduct.id} / 04</span><h3>{activeProduct.name}</h3></div><span className="price">${activeProduct.price.toFixed(2)}</span></div>
            </div>

            {customizerPanel}

            <aside className="rail-carousel absolute right-0" aria-label="Explore the Tiger collection">
              <div className="rail-header"><div><p className="eyebrow">Explore</p><strong>Tiger styles</strong></div><span>{String(activeProduct.id).padStart(2, '0')} / 04</span></div>
              <div className="rail-viewport"><div className="rail-line" />{products.map((product, index) => { const distance = index - scrollProgress * (products.length - 1); const absoluteDistance = Math.abs(distance); const curve = Math.max(0, 1 - Math.pow(Math.min(absoluteDistance, 1), 1.8)); const opacity = absoluteDistance <= 1.25 ? Math.max(0, 1 - Math.pow(absoluteDistance / 1.3, 3)) : 0; return <button key={product.id} type="button" aria-label={`Select ${product.name}`} aria-current={activeProduct.id === product.id ? 'true' : undefined} className={activeProduct.id === product.id ? 'rail-card is-active' : 'rail-card'} style={{ opacity, zIndex: Math.round(10 - absoluteDistance * 3), transform: `translate3d(${-curve * 24}px, ${distance * 148}px, 0) rotate(${-distance * 11}deg) scale(${0.8 + curve * 0.2})`, filter: `blur(${Math.min(absoluteDistance * .7, 2)}px)`, pointerEvents: opacity > .15 ? 'auto' : 'none' }} onClick={() => selectProduct(product, true)}><div className="rail-card-media" style={{ '--card-color': product.color } as React.CSSProperties}><span>{product.image}</span><small>product image</small></div><div className="rail-card-copy"><strong>{product.name}</strong><span>${product.price.toFixed(2)}</span></div></button>})}</div>
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
      </main>

      <footer className="site-footer"><div className="footer-brand"><span className="brand-mark">RC</span><span><strong>Richland County</strong><small>High School · Tigers</small></span></div><p>Official merchandise for the Tiger community.</p><span>© 2026 RCHS</span></footer>

      <div className={isCartOpen ? 'cart-overlay is-open' : 'cart-overlay'} onClick={() => setIsCartOpen(false)} />
      <aside className={isCartOpen ? 'cart-drawer is-open' : 'cart-drawer'} aria-label="Shopping bag" aria-hidden={!isCartOpen}><div className="cart-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag <span>{totalItems}</span></h2></div><button type="button" aria-label="Close shopping bag" onClick={() => setIsCartOpen(false)}><Icon name="close" /></button></div><div className="cart-items">{cart.length === 0 ? <div className="empty-cart"><div className="empty-bag"><Icon name="bag" size={24} /></div><h3>Your bag is waiting.</h3><p>Choose a piece from the collection and make it yours.</p><button className="text-link" type="button" onClick={() => setIsCartOpen(false)}>Keep browsing <Icon name="arrow-right" size={15} /></button></div> : cart.map((item, index) => <div className="cart-item" key={`${item.product.id}-${item.size}-${item.colorName}-${item.text}`}><div className="cart-item-image" style={{ '--card-color': item.product.color } as React.CSSProperties}><span>{item.product.image}</span></div><div className="cart-item-copy"><div><strong>{item.product.name}</strong><span>{item.colorName} · {item.size}{item.text && ` · ${item.text}`}</span></div><strong>${(item.product.price * item.quantity).toFixed(2)}</strong><div className="quantity"><button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(index, -1)}><Icon name="minus" size={13} /></button><span>{item.quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(index, 1)}><Icon name="plus" size={13} /></button></div></div></div>)}</div><div className="cart-footer"><div><span>Subtotal</span><strong>{formattedSubtotal}</strong></div><button className="button button-dark checkout-button" type="button" onClick={() => showNotice('Checkout is coming soon')}>Checkout <Icon name="arrow-up-right" size={16} /></button><p>Pickup at Richland County High School is always free.</p></div></aside>
      <div className={isNoticeVisible ? 'notice is-visible' : 'notice'} role="status"><span><Icon name="check" size={15} /></span>{notice}</div>
    </div>
  )
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath: string) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return path === '/designs' ? <DesignsPage onBack={() => navigate('/')} /> : <Storefront onNavigate={navigate} />
}

export default App
