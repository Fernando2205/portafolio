import { en } from './en'
import { es } from './es'
import { IDIOMA_POR_DEFECTO, esIdioma, type Idioma } from './tipos'

export const DICCIONARIOS = { es, en } as const

/** Deduce el idioma de la URL: /en/... es inglés, cualquier otra cosa español. */
export function getLang (url: URL): Idioma {
  const primerSegmento = url.pathname.split('/')[1]
  return esIdioma(primerSegmento) ? primerSegmento : IDIOMA_POR_DEFECTO
}

/** El diccionario del idioma pedido. */
export function t (lang: Idioma) {
  return DICCIONARIOS[lang]
}

/** El mismo diccionario, pero leyendo el idioma del <html lang> ya pintado. */
export function tDelDocumento () {
  const lang = document.documentElement.lang
  return DICCIONARIOS[esIdioma(lang) ? lang : IDIOMA_POR_DEFECTO]
}

export function idiomaDelDocumento (): Idioma {
  const lang = document.documentElement.lang
  return esIdioma(lang) ? lang : IDIOMA_POR_DEFECTO
}

export function otroIdioma (lang: Idioma): Idioma {
  return lang === 'es' ? 'en' : 'es'
}

/**
 * Prefija una ruta con el idioma. El español no lleva prefijo
 * (`prefixDefaultLocale: false`), así que `ruta('en', '/cv')` → `/en/cv`.
 */
export function ruta (lang: Idioma, camino = '/') {
  const limpio = camino.startsWith('/') ? camino : `/${camino}`
  if (lang === IDIOMA_POR_DEFECTO) return limpio
  return limpio === '/' ? '/en/' : `/en${limpio}`
}

export { IDIOMAS, IDIOMA_POR_DEFECTO, esIdioma } from './tipos'
export type { Idioma, Localizado } from './tipos'
