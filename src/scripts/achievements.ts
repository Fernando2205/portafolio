import { emit } from './bus'
import { gsap } from './gsap'
import { reducido } from './loop'

/**
 * Sección de logros: el `#1` del destacado entra con elastic.out y las
 * tarjetas de OCULUS y CLARA abren su proyecto.
 */
export function iniciarLogros () {
  const bajas: Array<() => void> = []

  const numero = document.querySelector<HTMLElement>('[data-logro-numero]')
  if (numero && !reducido) {
    const contexto = gsap.context(() => {
      gsap.from(numero, {
        scale: 0.4,
        rotation: -12,
        opacity: 0,
        transformOrigin: '0% 100%',
        duration: 1.4,
        ease: 'elastic.out(1,.6)',
        scrollTrigger: { trigger: numero, start: 'top 85%' }
      })
    })
    bajas.push(() => contexto.revert())
  }

  const tarjetas = Array.from(document.querySelectorAll<HTMLElement>('[data-ir-proyecto]'))
  const abrir = (e: Event) => {
    const tarjeta = e.currentTarget
    if (!(tarjeta instanceof HTMLElement) || !tarjeta.dataset.irProyecto) return
    emit('abrirProyecto', tarjeta.dataset.irProyecto)
  }

  for (const tarjeta of tarjetas) {
    tarjeta.addEventListener('click', abrir)
    bajas.push(() => tarjeta.removeEventListener('click', abrir))
  }

  return () => {
    for (const baja of bajas) baja()
  }
}
