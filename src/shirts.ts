const BASE = import.meta.env.BASE_URL

function shirtUrl(filename: string) {
  return `${BASE}shirts/${encodeURIComponent(filename)}`
}

export const shirtImages = {
  front: {
    1: shirtUrl('1 front.webp'),
    2: shirtUrl('2 front.webp'),
    3: shirtUrl('3 front.webp'),
    4: shirtUrl('4 front.webp'),
    5: shirtUrl('5 front.webp'),
    6: shirtUrl('6 front.webp'),
    7: shirtUrl('7 front.webp'),
    8: shirtUrl('8 front.webp'),
    9: shirtUrl('9 front.webp'),
  },
  back: {
    1: shirtUrl('1 back.webp'),
    2: shirtUrl('2-3 back.webp'),
    3: shirtUrl('2-3 back.webp'),
    4: shirtUrl('4 back.webp'),
    5: shirtUrl('5 back.webp'),
    6: shirtUrl('6 back.webp'),
    7: shirtUrl('7-9 back.webp'),
    8: shirtUrl('7-9 back.webp'),
    9: shirtUrl('7-9 back.webp'),
  },
} as const

export const SHIRT_META: Record<number, { name: string; price: number; label: string }> = {
  1: { name: 'Claw Stripes', price: 32, label: 'School Mark' },
  2: { name: 'One Tiger Nation', price: 32, label: 'Community' },
  3: { name: 'Tigers Block', price: 32, label: 'Varsity' },
  4: { name: 'Always Be A Tiger', price: 32, label: 'Spirit Wear' },
  5: { name: 'Tiger Strong', price: 32, label: 'Athletics' },
  6: { name: 'Two-Tone Tiger', price: 32, label: 'School Mark' },
  7: { name: 'Seniors', price: 32, label: 'Senior Edition' },
  8: { name: 'Tigers Volleyball', price: 32, label: 'Volleyball' },
  9: { name: 'Paw Pride', price: 32, label: 'Minimal' },
}

export const SHIRT_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
  id,
  ...SHIRT_META[id],
  imageSrc: shirtImages.front[id as keyof typeof shirtImages.front],
  backSrc: shirtImages.back[id as keyof typeof shirtImages.back],
}))

export const heroShirtUrls = [
  shirtImages.front[1],
  shirtImages.front[2],
  shirtImages.front[3],
  shirtImages.front[4],
  shirtImages.front[5],
  shirtImages.front[6],
  shirtImages.front[7],
  shirtImages.front[8],
]
