import {
  ACENTO_DORADO,
  PALETAS,
  PALETA_POR_DEFECTO,
  type NombrePaleta
} from '../data/paletas'
import { emit } from './bus'
import { CLAVES, escribirTexto, leerTexto } from './store'

/**
 * Paleta, modo claro/oscuro y acento. La misma lógica que el script inline del
 * <head> de Base.astro, que solo existe para evitar el parpadeo del primer
 * paint: si cambias cómo se calculan las variables, cámbialo en los dos sitios.
 */

let paleta: NombrePaleta = PALETA_POR_DEFECTO
let oscuro = true
let dorado = false
/** Acento que gana temporalmente sobre todo: modo Matrix y modo fiesta. */
let temporal: string | null = null

export function paletaActual () {
  return paleta
}

export function esOscuro () {
  return oscuro
}

export function esDorado () {
  return dorado
}

export function acentoActual () {
  if (temporal) return temporal
  if (dorado) return ACENTO_DORADO
  return PALETAS[paleta].acc
}

/** Color base de las partículas del canvas 3D para la paleta y modo actuales. */
export function colorParticulas () {
  const tono = oscuro ? PALETAS[paleta].dark : PALETAS[paleta].light
  return tono.pt
}

export function aplicarTema () {
  const raiz = document.documentElement
  const tono = oscuro ? PALETAS[paleta].dark : PALETAS[paleta].light
  const acento = acentoActual()

  raiz.style.setProperty('--bg', tono.bg)
  raiz.style.setProperty('--fg', tono.fg)
  raiz.style.setProperty('--mut', tono.mut)
  raiz.style.setProperty('--line', tono.line)
  raiz.style.setProperty('--card', tono.card)
  // El texto sobre el acento usa siempre el fondo oscuro de la paleta.
  raiz.style.setProperty('--onacc', PALETAS[paleta].dark.bg)
  raiz.style.setProperty('--acc', acento)
  // En claro el acento puro no contrasta como texto: se mezcla con el fg.
  raiz.style.setProperty(
    '--acct',
    oscuro ? acento : `color-mix(in oklch, ${acento} 55%, ${tono.fg})`
  )
  raiz.dataset.tema = oscuro ? 'dark' : 'light'

  emit('tema', { paleta, oscuro, acento })
}

/**
 * Envuelve un cambio de tema en una view transition con un círculo que crece
 * desde el punto del clic. Si el navegador no lo soporta o el visitante pidió
 * menos movimiento, el cambio es inmediato.
 */
function conCirculo (actualizar: () => void, evento?: { clientX: number, clientY: number }) {
  const raiz = document.documentElement
  const inicia = (document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>, finished: Promise<void> }
  }).startViewTransition
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!inicia || reducido) {
    actualizar()
    return
  }

  const x = evento ? evento.clientX : window.innerWidth / 2
  const y = evento ? evento.clientY : window.innerHeight / 2
  raiz.classList.add('vt-circulo')

  const transicion = inicia.call(document, actualizar)
  transicion.ready
    .then(() => {
      const radio = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      raiz.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
        {
          duration: 750,
          easing: 'cubic-bezier(.7,0,.2,1)',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
    .catch(() => {})
  transicion.finished.finally(() => raiz.classList.remove('vt-circulo'))
}

export function alternarTema (evento?: { clientX: number, clientY: number }) {
  conCirculo(() => {
    oscuro = !oscuro
    escribirTexto(CLAVES.tema, oscuro ? 'dark' : 'light')
    aplicarTema()
  }, evento)
  return oscuro
}

export function elegirPaleta (nombre: NombrePaleta, evento?: { clientX: number, clientY: number }) {
  conCirculo(() => {
    paleta = nombre
    escribirTexto(CLAVES.paleta, nombre)
    aplicarTema()
  }, evento)
}

export function alternarDorado () {
  dorado = !dorado
  escribirTexto(CLAVES.dorado, dorado ? '1' : '0')
  aplicarTema()
  return dorado
}

export function activarDorado () {
  dorado = true
  escribirTexto(CLAVES.dorado, '1')
  aplicarTema()
}

/** Acento temporal del modo Matrix. `null` restaura el de la paleta. */
export function acentoTemporal (color: string | null) {
  temporal = color
  aplicarTema()
}

/**
 * Lee lo guardado y sincroniza el estado del módulo con lo que el script
 * inline ya pintó. No vuelve a escribir las variables salvo que haga falta.
 */
export function inicializarTema (secretosEncontrados: number, total: number) {
  const guardada = leerTexto(CLAVES.paleta)
  if (guardada && guardada in PALETAS) paleta = guardada as NombrePaleta
  oscuro = leerTexto(CLAVES.tema) !== 'light'
  dorado = leerTexto(CLAVES.dorado) === '1' && secretosEncontrados >= total
  aplicarTema()
}
