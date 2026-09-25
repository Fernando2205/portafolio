import { on } from './bus'
import { alFrame, limitar, reducido } from './loop'

/**
 * Las dos filas de la cinta van en direcciones opuestas. La velocidad sube con
 * la del scroll, la dirección se invierte al subir y las filas se inclinan
 * (skewX) según esa misma velocidad.
 *
 * La animación se pausa con IntersectionObserver cuando la cinta no se ve.
 */
export function iniciarMarquesina () {
  const filas = Array.from(document.querySelectorAll<HTMLElement>('[data-cinta]'))
  if (filas.length === 0 || reducido) return

  const seccion = filas[0].parentElement
  const desplazamiento = filas.map(() => 0)
  const mitades = filas.map(() => 1)
  let direccion = 1
  let visible = true

  function medir () {
    filas.forEach((fila, i) => {
      const primera = fila.firstElementChild
      if (primera instanceof HTMLElement) mitades[i] = primera.offsetWidth || 1
    })
  }

  medir()
  // Con la fuente variable ya cargada el ancho cambia: hay que volver a medir.
  document.fonts?.ready.then(medir).catch(() => {})

  const bajaMedir = on('medir', medir)

  let observador: IntersectionObserver | undefined
  if (seccion) {
    observador = new IntersectionObserver(
      entradas => { visible = entradas[0]?.isIntersecting ?? true },
      { rootMargin: '100px' }
    )
    observador.observe(seccion)
  }

  const bajaFrame = alFrame(marco => {
    if (!visible) return

    const v = marco.vel
    if (Math.abs(v) > 0.5) direccion = v > 0 ? 1 : -1
    const paso = (0.7 + Math.min(14, Math.abs(v) * 0.5)) * direccion
    const inclinacion = limitar(-v * 0.35, -12, 12)

    filas.forEach((fila, i) => {
      const mitad = mitades[i]
      // La fila de abajo va al contrario que la de arriba.
      desplazamiento[i] += i === 0 ? -paso : paso
      if (desplazamiento[i] <= -mitad) desplazamiento[i] += mitad
      if (desplazamiento[i] > 0) desplazamiento[i] -= mitad
      fila.style.transform =
        `translate3d(${desplazamiento[i]}px,0,0) skewX(${inclinacion}deg)`
    })
  })

  return () => {
    bajaFrame()
    bajaMedir()
    observador?.disconnect()
  }
}
