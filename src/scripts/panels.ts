import { gsap } from './gsap'
import { reducido } from './loop'
import { refrescarScroll } from './scroll'

/**
 * Apertura y cierre de los paneles de detalle (trayectoria y proyectos).
 * Los paneles se renderizan en el servidor y arrancan con `hidden`, así que el
 * contenido está en el HTML para SEO aunque no se vea.
 */
export function abrirPanel (panel: HTMLElement) {
  panel.hidden = false

  if (reducido) {
    refrescarScroll()
    return
  }

  // El padding se lee del estilo ya calculado para animar hasta su valor real.
  const estilo = getComputedStyle(panel)
  const arriba = estilo.paddingTop
  const abajo = estilo.paddingBottom

  gsap.fromTo(
    panel,
    { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0, overflow: 'hidden' },
    {
      height: 'auto',
      paddingTop: arriba,
      paddingBottom: abajo,
      opacity: 1,
      duration: 0.7,
      ease: 'expo.out',
      clearProps: 'height,paddingTop,paddingBottom,overflow',
      onComplete: refrescarScroll
    }
  )

  if (panel.children.length > 0) {
    gsap.from(panel.children, {
      y: 16,
      opacity: 0,
      duration: 0.6,
      ease: 'expo.out',
      stagger: 0.06,
      delay: 0.08
    })
  }
}

export function cerrarPanel (panel: HTMLElement, alTerminar?: () => void) {
  const terminar = () => {
    panel.hidden = true
    gsap.set(panel, { clearProps: 'height,paddingTop,paddingBottom,opacity,overflow' })
    alTerminar?.()
    refrescarScroll()
  }

  if (reducido) {
    terminar()
    return
  }

  gsap.to(panel, {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    opacity: 0,
    overflow: 'hidden',
    duration: 0.38,
    ease: 'power3.inOut',
    onComplete: terminar
  })
}
