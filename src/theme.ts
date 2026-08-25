export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('rchs-theme', theme)
  } catch {
    return
  }
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.themeWipe = next === 'dark' ? 'ltr' : 'rtl'
  const apply = () => setTheme(next)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if ('startViewTransition' in document && !reduceMotion) {
    document.startViewTransition(apply)
  } else {
    apply()
  }
  return next
}
