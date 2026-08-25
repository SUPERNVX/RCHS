import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './DesignsPage.css'
import { FadeText } from './components/ui/fade-text'
import { getTheme, toggleTheme, type Theme } from './theme'

gsap.registerPlugin(ScrollTrigger)

type Design = {
  number: number
  title: string
  category: string
  description: string
  background: string
  foreground: string
}

type Column = {
  step: number
  designs: Design[]
}

const designs: Design[] = [
  { number: 1, title: 'Tiger Signal', category: 'School mark', description: 'A bold signal for the stands.', background: 'linear-gradient(135deg, #e85f25, #f59a4b)', foreground: '#fff7ed' },
  { number: 2, title: 'County Lines', category: 'Graphic study', description: 'Clean lines, strong identity.', background: 'linear-gradient(135deg, #252a2d, #667177)', foreground: '#f2762e' },
  { number: 3, title: 'Orange Current', category: 'Gradient mesh', description: 'Energy in every direction.', background: 'linear-gradient(145deg, #f2762e, #f5d9bb 48%, #19232b)', foreground: '#171717' },
  { number: 4, title: 'Friday Night', category: 'Game day', description: 'Built for the lights.', background: 'linear-gradient(135deg, #111820, #263949)', foreground: '#f6a06a' },
  { number: 5, title: 'RCHS / 26', category: 'Type study', description: 'The year we show up.', background: '#ece7dd', foreground: '#17212a' },
  { number: 6, title: 'Tiger Track', category: 'Athletics edit', description: 'Made for the move.', background: 'linear-gradient(135deg, #d34d20, #f2762e)', foreground: '#fff' },
  { number: 7, title: 'First Bell', category: 'Everyday', description: 'Start with spirit.', background: 'linear-gradient(135deg, #20262b, #39444a)', foreground: '#f0c49b' },
  { number: 8, title: 'The Roar', category: 'School mark', description: 'A little louder.', background: 'linear-gradient(135deg, #f2762e 0 50%, #171717 50%)', foreground: '#fff' },
  { number: 9, title: 'Tiger Print', category: 'Pattern study', description: 'A familiar rhythm.', background: 'repeating-linear-gradient(135deg, #e5ded2 0 11px, #c9c0b1 11px 13px)', foreground: '#18202a' },
  { number: 10, title: 'County Club', category: 'Alumni edit', description: 'Wear the place home.', background: '#18232b', foreground: '#f2762e' },
  { number: 11, title: 'Orange State', category: 'Color study', description: 'No quiet colors here.', background: 'linear-gradient(145deg, #f2762e, #f7bb84)', foreground: '#171717' },
  { number: 12, title: 'Under The Lights', category: 'Game day', description: 'For every final whistle.', background: 'linear-gradient(145deg, #151c25, #3c5165)', foreground: '#f4ede1' },
  { number: 13, title: 'Tiger Standard', category: 'Core collection', description: 'The one you reach for.', background: '#efe9de', foreground: '#f2762e' },
  { number: 14, title: 'Made In Richland', category: 'Community', description: 'A shared point of view.', background: 'linear-gradient(135deg, #e55d23, #20282c)', foreground: '#f7f0e8' },
  { number: 15, title: 'Varsity / 1910', category: 'Heritage', description: 'Old roots, new energy.', background: '#20262a', foreground: '#dca16f' },
  { number: 16, title: 'Tiger Weather', category: 'Outerwear', description: 'For cooler sidelines.', background: 'linear-gradient(135deg, #ded8cc, #aaa89e)', foreground: '#18212a' },
  { number: 17, title: 'The County', category: 'Type study', description: 'Where we are from.', background: 'linear-gradient(135deg, #273640, #f2762e)', foreground: '#fff' },
  { number: 18, title: 'All In', category: 'Team edit', description: 'Every voice, one roar.', background: '#f2762e', foreground: '#171717' },
  { number: 19, title: 'RCHS Athletics', category: 'Athletics edit', description: 'Move like a Tiger.', background: 'linear-gradient(135deg, #141a21, #526372)', foreground: '#f2762e' },
  { number: 20, title: 'After The Game', category: 'Everyday', description: 'Keep the feeling going.', background: '#e9e3d8', foreground: '#f2762e' },
  { number: 21, title: 'Forever Tiger', category: 'Limited run', description: 'The spirit stays.', background: 'linear-gradient(135deg, #f2762e, #9d3216)', foreground: '#fff7ed' },
]

const columns: Column[] = [
  { step: 3, designs: designs.slice(0, 3) },
  { step: 2, designs: designs.slice(3, 6) },
  { step: 1, designs: designs.slice(6, 9) },
  { step: 0, designs: designs.slice(9, 12) },
  { step: 1, designs: designs.slice(12, 15) },
  { step: 2, designs: designs.slice(15, 18) },
  { step: 3, designs: designs.slice(18, 21) },
]

const PYRAMID_OFFSET = 180
const PARALLAX_SPEED = 0.8
const SCRUB_TIME = 2.5
const SCROLL_DISTANCE = 2200

function MiniIcon({ name, size = 16 }: { name: 'arrow-left' | 'arrow-down' | 'arrow-up-right' | 'sliders' | 'close' | 'rotate' | 'sun' | 'moon'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'arrow-left') return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  if (name === 'arrow-down') return <svg {...common}><path d="M12 5v14M18 13l-6 6-6-6" /></svg>
  if (name === 'arrow-up-right') return <svg {...common}><path d="M7 17 17 7M8 7h9v9" /></svg>
  if (name === 'sun') return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  if (name === 'moon') return <svg {...common}><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
  if (name === 'sliders') return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16M8 4v4M16 10v4M10 16v4" /></svg>
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
  return <svg {...common}><path d="M4 12a8 8 0 0 0 13.7 5.7L20 15.5M20 12a8 8 0 0 0-13.7-5.7L4 8.5M4 4v4.5h4.5M20 20v-4.5h-4.5" /></svg>
}

export function DesignsPage({ onBack }: { onBack: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const modalContentRef = useRef<HTMLDivElement>(null)

  function switchTheme() {
    setThemeState(toggleTheme())
  }

  useLayoutEffect(() => {
    document.title = 'All Designs · Richland County Tigers'
    const root = rootRef.current
    if (!root) return

    const context = gsap.context(() => {
      const mobile = window.innerWidth < 768
      const baseOffset = mobile ? PYRAMID_OFFSET * .45 : PYRAMID_OFFSET
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
        const handleMove = (event: Event) => {
          const pointerEvent = event as MouseEvent
          const rect = card.getBoundingClientRect()
          const rotateX = ((pointerEvent.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -12
          const rotateY = ((pointerEvent.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 12
          gsap.to(card, { rotateX, rotateY, transformPerspective: 800, duration: .3, ease: 'power1.out' })
        }
        const handleLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .5, ease: 'power2.out' })
        card.addEventListener('mousemove', handleMove)
        card.addEventListener('mouseleave', handleLeave)
      })
    }, root)

    return () => context.revert()
  }, [])

  useLayoutEffect(() => {
    if (!selectedDesign || !modalContentRef.current) return
    gsap.fromTo(modalContentRef.current, { scale: .8, opacity: 0, filter: 'blur(8px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: .45, ease: 'back.out(1.7)' })
  }, [selectedDesign])

  useEffect(() => {
    if (!selectedDesign) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedDesign(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedDesign])

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
        <div className="mt-8 flex animate-bounce items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 font-mono text-[10px] tracking-wider text-[var(--muted)] dark:border-white/10 dark:bg-card"><MiniIcon name="arrow-down" size={14} /> Scroll to explore the archive</div>
      </section>

      <section className="pyramid-stage relative w-full overflow-hidden" data-pyramid-stage>
        <div className="flex min-h-screen w-full items-center px-3 py-12 md:px-6">
          <div className="pyramid-grid grid w-full max-w-[1780px] grid-cols-2 items-start gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4 lg:grid-cols-7 lg:gap-5" data-pyramid-grid>
            {columns.map((column, columnIndex) => <div key={`${column.step}-${columnIndex}`} className="flex flex-col gap-4" data-step={column.step}>
              {column.designs.map((design) => <button key={design.number} type="button" data-design-card className="pyramid-card square-card group relative w-full overflow-hidden rounded-2xl border border-black/10 bg-white text-left outline-none focus-visible:ring-2 focus-visible:ring-tiger dark:border-white/10 dark:bg-card" style={{ '--design-bg': design.background, '--design-fg': design.foreground } as CSSProperties} onClick={() => setSelectedDesign(design)} aria-label={`Open ${design.title} design`}>
                <span className="design-surface absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                <span className="design-index absolute left-3 top-3 z-10 font-mono text-[9px] tracking-[.14em] opacity-70" style={{ color: design.foreground }}>IMG {String(design.number).padStart(2, '0')}</span>
                <span className="design-center relative z-10 flex h-full flex-col items-center justify-start px-4 pt-8 text-center" style={{ color: design.foreground }}><strong>{design.title}</strong><small>design placeholder</small></span>
                <span className="design-overlay absolute inset-0 z-20 flex flex-col justify-end p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100"><b className="font-mono text-[9px] uppercase tracking-[.12em] text-orange-300">#{String(design.number).padStart(2, '0')} {design.category}</b><span className="mt-1 text-xs font-semibold text-white">{design.description}</span></span>
              </button>)}
            </div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-5 py-10 text-center font-mono text-[10px] tracking-wider text-[var(--muted)] dark:border-white/10"><button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-tiger transition hover:text-[var(--orange-deep)]"><MiniIcon name="arrow-left" size={14} /> Back to the Tiger shop</button><p>RCHS design archive · 2026</p></footer>

      {selectedDesign && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-5 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label={`${selectedDesign.title} preview`} onClick={() => setSelectedDesign(null)}><div ref={modalContentRef} className="design-modal" onClick={(event) => event.stopPropagation()}><button type="button" className="design-modal-close absolute right-0 top-0 z-10 text-white/70 transition hover:text-white" aria-label="Close design preview" onClick={() => setSelectedDesign(null)}><MiniIcon name="close" /></button><div className="design-modal-title"><p>{selectedDesign.category}</p><h2>{selectedDesign.title}</h2><span>{selectedDesign.description}</span></div><div className="design-modal-art" style={{ '--design-bg': selectedDesign.background, '--design-fg': selectedDesign.foreground } as CSSProperties}><div className="design-modal-placeholder"><strong>IMG {String(selectedDesign.number).padStart(2, '0')}</strong><small>design placeholder</small></div></div></div></div>}
    </div>
  )
}
