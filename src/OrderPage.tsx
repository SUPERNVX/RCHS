import { useEffect, useMemo, useState } from 'react'
import { getTheme, toggleTheme, type Theme } from './theme'
import { encodeCart, mailtoHref } from './orderCode'
import type { CartItem } from './App'

type OrderPageProps = {
  cart: CartItem[]
  totalItems: number
  formattedSubtotal: string
  updateQuantity: (index: number, delta: number) => void
  onNavigate: (path: string) => void
  showNotice: (msg: string) => void
}

function MiniIcon({ name, size = 16 }: { name: 'arrow-left' | 'sun' | 'moon' | 'bag' | 'check' | 'copy' | 'mail' | 'plus' | 'minus' | 'close'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (name === 'arrow-left') return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  if (name === 'sun') return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  if (name === 'moon') return <svg {...common}><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" /></svg>
  if (name === 'bag') return <svg {...common}><path d="M6.5 8.5h11l.8 11H5.7l.8-11Z" /><path d="M9 9V6.8a3 3 0 0 1 6 0V9" /></svg>
  if (name === 'check') return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>
  if (name === 'copy') return <svg {...common}><rect x="9" y="9" width="10" height="10" rx="2" /><path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>
  if (name === 'mail') return <svg {...common}><path d="M4 6h16v12H4z" /><path d="M4 7l8 7 8-7" /></svg>
  if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  if (name === 'minus') return <svg {...common}><path d="M5 12h14" /></svg>
  return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
}

export function OrderPage({ cart, totalItems, updateQuantity, onNavigate, showNotice }: OrderPageProps) {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  const [copied, setCopied] = useState(false)
  const code = useMemo(() => encodeCart(cart), [cart])
  const total = useMemo(() => cart.reduce((s, it) => s + 32 * it.quantity, 0), [cart])
  const mailHref = useMemo(() => mailtoHref(code, cart), [code, cart])

  function switchTheme() {
    setThemeState(toggleTheme())
  }

  useEffect(() => {
    document.title = 'Your Order · RCHS'
  }, [])

  async function handleCopy() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      showNotice('Code copied')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showNotice('Copy code manually')
    }
  }

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
          <button type="button" className="header-link" onClick={() => onNavigate('/verify')}>Verify order</button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1120px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-10">
          <p className="eyebrow">Your order</p>
          <h1 className="font-display text-3xl font-extrabold tracking-[-.06em] md:text-4xl">Review your <em className="font-serif font-normal italic text-tiger">selection.</em></h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">Review everything before sending. Your order is finalized by email to <b className="text-ink">pwest@rccu1.net</b>.</p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center dark:border-white/10 dark:bg-card">
            <p className="font-display text-lg font-bold">Your bag is empty.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Add some shirts in Shop or All Designs.</p>
            <button type="button" onClick={() => onNavigate('/')} className="button button-orange mx-auto mt-6">Back to shop</button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.35fr_.85fr]">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.colorName}-${item.text}`} className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-card">
                  <img src={item.product.imageSrc} alt={item.product.name} width={96} height={96} className="h-24 w-24 rounded-xl object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-sm font-extrabold leading-none tracking-[-.03em]">{item.product.name}</h3>
                        <p className="mt-1 font-mono text-[10px] tracking-wide text-[var(--muted)]">{item.colorName} · {item.size}{item.text ? ` · ${item.text}` : ''}</p>
                      </div>
                      <strong className="font-display text-sm">${(32 * item.quantity).toFixed(2)}</strong>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">${(32).toFixed(2)} each</p>
                    <div className="quantity mt-3">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(index, -1)} className="grid h-7 w-7 place-items-center rounded-full border border-black/10 dark:border-white/15"><MiniIcon name="minus" size={13} /></button>
                      <span className="font-mono text-sm">{item.quantity}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(index, 1)} className="grid h-7 w-7 place-items-center rounded-full border border-black/10 dark:border-white/15"><MiniIcon name="plus" size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-card lg:sticky lg:top-[88px]">
              <h2 className="font-display text-lg font-extrabold tracking-[-.04em]">Summary</h2>
              <div className="mt-4 space-y-2 border-b border-black/10 pb-4 text-sm dark:border-white/10">
                <div className="flex justify-between"><span className="text-[var(--muted)]">Items ({totalItems})</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted)]">Pickup at RCHS</span><span className="text-tiger">Free</span></div>
              </div>
              <div className="mt-4 flex justify-between font-display text-lg font-extrabold"><span>Total</span><span>${total.toFixed(2)}</span></div>

              <a href={mailHref} className="button button-orange mt-6 w-full justify-center">Place order — Send email <MiniIcon name="mail" size={16} /></a>
              <p className="mt-2 text-center font-mono text-[10px] leading-relaxed text-[var(--muted)]">Opens your email client with the order ready for <b>pwest@rccu1.net</b></p>

              <div className="mt-6 rounded-xl bg-[var(--card)] p-4">
                <p className="font-mono text-[10px] font-bold tracking-widest">YOUR ORDER CODE</p>
                <p className="mt-2 break-all rounded-lg border border-black/10 bg-white p-3 font-mono text-[11px] leading-relaxed dark:border-white/10 dark:bg-[var(--surface-raised)]">{code || '—'}</p>
                <button type="button" onClick={handleCopy} disabled={!code} className="button button-dark mt-3 w-full justify-center disabled:opacity-40">
                  <MiniIcon name={copied ? 'check' : 'copy'} size={15} />{copied ? 'Copied!' : 'Copy your order'}
                </button>
                <p className="mt-2 text-center text-xs text-[var(--muted)]">Paste this code in the email or verification below.</p>
              </div>

              <button type="button" onClick={() => onNavigate('/verify')} className="text-link mx-auto mt-4 flex">Verify order →</button>
            </div>
          </div>
        )}

        <section className="mt-16 border-t border-black/10 pt-10 dark:border-white/10" aria-label="Quick verification">
          <h2 className="font-display text-xl font-extrabold tracking-[-.05em]">Have a code? Verify here</h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">Paste the code copied above to review your order and see the total.</p>
          <button type="button" onClick={() => onNavigate(`/verify?code=${encodeURIComponent(code)}`)} disabled={!code} className="button button-dark mt-4 disabled:opacity-40">Open verification with your code</button>
        </section>
      </main>
    </div>
  )
}
