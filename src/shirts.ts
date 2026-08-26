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
