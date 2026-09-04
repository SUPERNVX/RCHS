import type { CartItem } from './App'

const SLUG_BY_ID: Record<number, string> = {
  1: 'claw-stripes',
  2: 'one-tiger-nation',
  3: 'tigers-block',
  4: 'always-be-a-tiger',
  5: 'tiger-strong',
  6: 'two-tone-tiger',
  7: 'seniors',
  8: 'tigers-volleyball',
  9: 'paw-pride',
}

const ID_BY_SLUG: Record<string, number> = Object.fromEntries(
  Object.entries(SLUG_BY_ID).map(([id, slug]) => [slug, Number(id)]),
)

function slugifyText(text: string): string {
  const s = text.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')
  return s || 'RCHS'
}

function shortColor(colorName: string): string {
  const m: Record<string, string> = {
    'Heather Charcoal': 'charcoal',
    'Tiger Orange': 'orange',
    'Dark Heather': 'dark',
    Midnight: 'midnight',
    Stone: 'stone',
    Ivory: 'ivory',
  }
  return m[colorName] ?? colorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function encodeCart(cart: CartItem[]): string {
  if (cart.length === 0) return ''
  const sorted = [...cart].sort((a, b) => a.product.id - b.product.id)
  return sorted
    .map((item) => {
      const slug = SLUG_BY_ID[item.product.id] ?? `id-${item.product.id}`
      const parts = [slug, `sz-${item.size}`, `cl-${shortColor(item.colorName)}`]
      const txt = slugifyText(item.text)
      if (txt && txt !== 'RCHS') parts.push(`tx-${txt.toLowerCase()}`)
      if (item.quantity > 1) parts.push(`q${item.quantity}`)
      return parts.join('-')
    })
    .join('__')
}

export type DecodedItem = {
  id: number
  slug: string
  size: string
  colorSlug: string
  text: string
  quantity: number
}

export function decodeCode(code: string): { items: DecodedItem[]; errors: string[] } {
  const errors: string[] = []
  const raw = code.trim()
  if (!raw) return { items: [], errors: [] }
  const chunks = raw
    .split(/__+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const items: DecodedItem[] = []
  for (const chunk of chunks) {
    const lower = chunk.toLowerCase()
    const parts = lower.split('-')
    let slug = ''
    let slugEnd = -1
    for (let len = parts.length; len > 0; len--) {
      const cand = parts.slice(0, len).join('-')
      if (ID_BY_SLUG[cand]) {
        slug = cand
        slugEnd = len
        break
      }
    }
    if (!slug) {
      const idMatch = lower.match(/^id-(\d+)/)
      if (idMatch) {
        const id = Number(idMatch[1])
        const foundSlug = SLUG_BY_ID[id]
        if (foundSlug) {
          slug = foundSlug
          slugEnd = 2
        } else {
          errors.push(`Unknown ID: ${chunk}`)
          continue
        }
      } else {
        errors.push(`Invalid item: ${chunk}`)
        continue
      }
    }
    const id = ID_BY_SLUG[slug]
    let size = 'M'
    let colorSlug = 'orange'
    let text = 'RCHS'
    let quantity = 1
    let i = slugEnd
    while (i < parts.length) {
      if (parts[i] === 'sz' && i + 1 < parts.length) {
        size = parts[i + 1].toUpperCase()
        i += 2
        continue
      }
      if (parts[i] === 'cl' && i + 1 < parts.length) {
        colorSlug = parts[i + 1]
        i += 2
        if (['sz', 'cl', 'tx', 'q'].includes(parts[i] ?? '') === false && parts[i] && !parts[i].startsWith('q')) {
        }
        continue
      }
      if (parts[i] === 'tx' && i + 1 < parts.length) {
        const txParts: string[] = []
        i++
        while (i < parts.length && !['sz', 'cl', 'tx'].includes(parts[i]) && !parts[i].startsWith('q')) {
          txParts.push(parts[i])
          i++
        }
        if (txParts.length) text = txParts.join('-').toUpperCase()
        continue
      }
      if (parts[i].startsWith('q')) {
        const q = Number(parts[i].slice(1))
        if (Number.isFinite(q) && q > 0) quantity = Math.min(99, Math.floor(q))
        i++
        continue
      }
      i++
    }
    items.push({ id, slug, size, colorSlug, text, quantity })
  }
  return { items, errors }
}

export function mailtoHref(code: string, cart: CartItem[]): string {
  const total = cart.reduce((s, it) => s + it.product.price * it.quantity, 0)
  const lines = cart.map((it) => {
    const slug = SLUG_BY_ID[it.product.id] ?? `id-${it.product.id}`
    return `- ${it.product.name} (${slug}) — size ${it.size}, ${it.colorName}, "${it.text}" x${it.quantity} = $${(it.product.price * it.quantity).toFixed(2)}`
  })
  const body = [
    'Hello, I would like to place my RCHS order:',
    '',
    ...lines,
    '',
    `Total: $${total.toFixed(2)} (${cart.reduce((s, it) => s + it.quantity, 0)} items)`,
    '',
    `Order code: ${code}`,
    '',
    'Paste this code on the site verification page to review.',
  ].join('\n')
  const subject = `RCHS Order — ${code.slice(0, 40)}${code.length > 40 ? '…' : ''}`
  return `mailto:pwest@rccu1.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const CATALOG_PRICE = 32
