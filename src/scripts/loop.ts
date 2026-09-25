import { emit } from './bus'

/**
 * Un único requestAnimationFrame para todo el sitio: cursor, marquesina,
 * física, 3D y efectos del hero. Equivale al `frame()` del prototipo.
 *
 * Las lecturas de layout se cachean en cada módulo y solo se invalidan cuando
 * `marco.rectSucio` es true, es decir tras un scroll o un resize.
 */
export interface Marco {
  /** Segundos desde que arrancó la página. */
  tiempo: number
  scrollY: number
  /** Velocidad de scroll suavizada, en píxeles por frame. */
  vel: number
  /** true durante el frame siguiente a un scroll. */
  scrollSucio: boolean
  /** true durante el frame siguiente a un scroll o un resize. */
  rectSucio: boolean
  raton: { x: number, y: number }
  /** true durante el frame siguiente a un movimiento del puntero. */
  ratonMovido: boolean
}

export const marco: Marco = {
  tiempo: 0,
  scrollY: 0,
  vel: 0,
  scrollSucio: true,
  rectSucio: true,
  raton: { x: -200, y: -200 },
  ratonMovido: false
}

export const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const tactil = window.matchMedia('(pointer: coarse)').matches

type Tarea = (m: Marco) => void

const tareas = new Set<Tarea>()
let raf = 0
let ultimoY = 0
let escuchando = false

/**
 * Marca el layout como sucio. Hace falta tras un swap del ClientRouter: el bucle
 * sigue corriendo y ya habría limpiado las banderas, así que las tareas nuevas
 * no sabrían que tienen que medir.
 */
export function invalidarLayout () {
  marco.scrollSucio = true
  marco.rectSucio = true
}

/** Registra una tarea de frame. Devuelve la función para darla de baja. */
export function alFrame (tarea: Tarea) {
  tareas.add(tarea)
  arrancar()
  return () => { tareas.delete(tarea) }
}

function ciclo (ahora: number) {
  marco.tiempo = ahora / 1000
  marco.scrollY = window.scrollY
  marco.vel += (marco.scrollY - ultimoY - marco.vel) * 0.2
  ultimoY = marco.scrollY

  for (const tarea of tareas) tarea(marco)

  marco.scrollSucio = false
  marco.rectSucio = false
  marco.ratonMovido = false
  raf = requestAnimationFrame(ciclo)
}

function alScroll () {
  marco.scrollSucio = true
  marco.rectSucio = true
}

function alRedimensionar () {
  marco.rectSucio = true
  emit('medir')
}

function alMover (e: PointerEvent) {
  marco.raton.x = e.clientX
  marco.raton.y = e.clientY
  marco.ratonMovido = true
}

function arrancar () {
  if (raf) return
  if (!escuchando) {
    escuchando = true
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alRedimensionar)
    window.addEventListener('pointermove', alMover, { passive: true })
  }
  ultimoY = window.scrollY
  raf = requestAnimationFrame(ciclo)
}

export function detenerLoop () {
  cancelAnimationFrame(raf)
  raf = 0
  tareas.clear()
}

/** Recorta un número a un rango. Lo usan casi todos los módulos de frame. */
export function limitar (n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function lerp (desde: number, hasta: number, k: number) {
  return desde + (hasta - desde) * k
}
