import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { getTheme, toggleTheme, type Theme } from './theme'
import { decodeCode, CATALOG_PRICE } from './orderCode'
import { shirtImages } from './shirts'

const SLUG_META: Record<string, { title: string; front: string }> = {
  'claw-stripes': { title: 'Claw Stripes', front: shirtImages.front[1] },
  'one-tiger-nation': { title: 'One Tiger Nation', front: shirtImages.front[2] },
  'tigers-block': { title: 'Tigers Block', front: shirtImages.front[3] },
  'always-be-a-tiger': { title: 'Always Be A Tiger', front: shirtImages.front[4] },
  'tiger-strong': { title: 'Tiger Strong', front: shirtImages.front[5] },
  'two-tone-tiger': { title: 'Two-Tone Tiger', front: shirtImages.front[6] },
  seniors: { title: 'Seniors', front: shirtImages.front[7] },
  'tigers-volleyball': { title: 'Tigers Volleyball', front: shirtImages.front[8] },
  'paw-pride': { title: 'Paw Pride', front: shirtImages.front[9] },
}

function MiniIcon({ name, size = 16 }: { name: 'sun' | 'moon' | 'arrow-left'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'arrow-left') return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  if (name === 'sun') return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  return <svg {...common}><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
}

export function VerifyPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const [input, setInput] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      return p.get('code') ?? ''
    } catch {
      return ''
    }
  })

  function switchTheme() {
    setThemeState(toggleTheme())
  }

  useEffect(() => {
    document.title = 'Verify Order · RCHS'
  }, [])

  const { items, errors } = useMemo(() => decodeCode(input), [input])
  const total = items.reduce((s, it) => s + CATALOG_PRICE * it.quantity, 0)
  const totalItems = items.reduce((s, it) => s + it.quantity, 0)

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <header className="site-header">
        <button type="button" onClick={() => onNavigate('/')} className="brand" aria-label="Back to shop">
          <span className="brand-mark">RC</span>
          <span className="brand-copy"><strong>Richland County</strong><small>High School · Tigers</small></span>
        </button>
        <div className="header-actions">
          <button className="bag-button" type="button" onClick={switchTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={theme === 'dark'}>
            <MiniIcon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <button type="button" className="header-link" onClick={() => onNavigate('/')}>Back to shop</button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[860px] px-5 py-10 md:px-8">
        <p className="eyebrow">Order identification</p>
        <h1 className="font-display text-3xl font-extrabold tracking-[-.06em] md:text-4xl">Paste your <em className="font-serif font-normal italic text-tiger">code.</em></h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">Paste the string copied in <b>Order → Copy your order</b> to review and see the total.</p>

        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-card">
          <label htmlFor="verify-code" className="font-mono text-[10px] font-bold tracking-widest">ORDER CODE</label>
          <textarea
            id="verify-code"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ex: claw-stripes-sz-M-cl-orange-q2__always-be-a-tiger-sz-L-cl-dark-q1"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[var(--card)] p-4 font-mono text-xs leading-relaxed outline-none focus:border-tiger dark:border-white/10"
          />
          {errors.length > 0 && (
            <p className="mt-2 font-mono text-xs text-red-500">{errors.join(' · ')}</p>
          )}
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setInput('')} className="button button-dark">Clear</button>
            <button type="button" onClick={() => onNavigate('/order')} className="text-link">Back to order</button>
          </div>
        </div>

        {items.length > 0 && (
          <motion.div
            className="mt-10"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
          >
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-lg font-extrabold tracking-[-.04em]">Review</h2>
              <span className="font-mono text-xs text-[var(--muted)]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </div>
            <div className="space-y-4">
              {items.map((it) => {
                const meta = SLUG_META[it.slug]
                return (
                  <motion.div
                    key={`${it.slug}-${it.size}-${it.colorSlug}`}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: 'easeOut' } },
                    }}
                    className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-card"
                  >
                    <img src={meta?.front ?? shirtImages.front[1]} alt={meta?.title ?? it.slug} width={96} height={96} className="h-24 w-24 rounded-xl object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-extrabold tracking-[-.03em]">{meta?.title ?? it.slug}</h3>
                      <p className="mt-1 font-mono text-[10px] tracking-wide text-[var(--muted)]">size {it.size} · {it.colorSlug} ×{it.quantity}</p>
                      <p className="mt-2 font-display text-sm font-bold">${(CATALOG_PRICE * it.quantity).toFixed(2)} <span className="font-mono text-xs font-normal text-[var(--muted)]">· ${CATALOG_PRICE.toFixed(2)} each</span></p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              className="mt-8 flex items-center justify-between rounded-2xl bg-ink px-6 py-5 text-white"
            >
              <span className="font-display text-lg font-extrabold tracking-[-.04em]">Total</span>
              <span className="font-display text-2xl font-extrabold">${total.toFixed(2)}</span>
            </motion.div>
            <p className="mt-3 text-center font-mono text-xs text-[var(--muted)]">Code: <span className="break-all">{input.trim()}</span></p>
          </motion.div>
        )}

        {items.length === 0 && input.trim() && errors.length === 0 && (
          <p className="mt-8 text-center font-mono text-sm text-[var(--muted)]">Paste a valid code to see the review.</p>
        )}
      </main>
    </div>
  )
}
