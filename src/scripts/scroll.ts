import { emit } from './bus'
import { gsap, ScrollTrigger } from './gsap'
import { reducido } from './loop'
import { descifrar } from './scramble'

/**
 * Animaciones de entrada comunes a todas las secciones y detección de la
 * sección visible. Las piezas con animación propia (hero, foto, terminal…)
 * montan su ScrollTrigger en su propio módulo.
 *
 * Con prefers-reduced-motion no se anima nada y todo queda visible: los estados
 * iniciales se ponen desde JS, nunca desde CSS.
 */
const SECCIONES = [
  'inicio',
  'sobre-mi',
  'trayectoria',
  'logros',
  'proyectos',
  'terminal',
  'stack',
  'contacto'
]

type Estado = gsap.TweenVars

function lote (selector: string, desde: Estado, hasta: Estado, inicio: string) {
  const elementos = gsap.utils.toArray<HTMLElement>(selector)
  if (elementos.length === 0) return
  gsap.set(elementos, desde)
  ScrollTrigger.batch(elementos, {
    start: inicio,
    once: true,
    onEnter: grupo => gsap.to(grupo, { ...hasta, ease: 'expo.out' })
  })
}

let pendiente = 0

/** Recalcula las posiciones de los ScrollTrigger, agrupando llamadas. */
export function refrescarScroll () {
  window.clearTimeout(pendiente)
  pendiente = window.setTimeout(() => ScrollTrigger.refresh(), 140)
}

export function iniciarScroll () {
  const contexto = gsap.context(() => {
    // Sección visible: alimenta la ruta del logo y la forma de las partículas.
    for (const id of SECCIONES) {
      const seccion = document.getElementById(id)
      if (!seccion) continue
      ScrollTrigger.create({
        trigger: seccion,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: disparador => {
          if (disparador.isActive) emit('seccion', id)
        }
      })
    }

    if (reducido) return

    for (const titulo of gsap.utils.toArray<HTMLElement>('[data-h]')) {
      gsap.from(titulo, {
        yPercent: 115,
        rotation: 3,
        transformOrigin: '0% 100%',
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: titulo, start: 'top 90%' }
      })
    }

    for (const etiqueta of gsap.utils.toArray<HTMLElement>('[data-scramble]')) {
      ScrollTrigger.create({
        trigger: etiqueta,
        start: 'top 92%',
        once: true,
        onEnter: () => descifrar(etiqueta)
      })
    }

    lote('[data-reveal]', { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 'top 90%')
    lote('[data-row]', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.1, stagger: 0.09 }, 'top 94%')
    lote('[data-soft]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 'top 94%')
    lote('[data-ach]', { opacity: 0, y: 50, rotation: 2 }, { opacity: 1, y: 0, rotation: 0, duration: 1.1, stagger: 0.12 }, 'top 92%')
    lote('[data-ti]', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, stagger: 0.08 }, 'top 92%')
  })

  // Con la fuente variable cargada cambian las alturas: hay que recolocar.
  document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {})

  return () => {
    window.clearTimeout(pendiente)
    contexto.revert()
  }
}
