import { emit } from './bus'
import { gsap } from './gsap'
import { reducido } from './loop'

/**
 * Sección de logros: el recorrido del destacado (regional → nacional) se
 * dibuja de izquierda a derecha, cada puesto entra con elastic.out, y todo lo
 * que lleva `data-ir-proyecto` abre su proyecto.
 */
export function iniciarLogros () {
  const bajas: Array<() => void> = []

  const recorrido = document.querySelector<HTMLElement>('[data-recorrido]')
  if (recorrido && !reducido) {
    const contexto = gsap.context(() => {
      const linea = recorrido.querySelector('[data-recorrido-linea]')
      const puntos = recorrido.querySelectorAll('[data-recorrido-punto]')
      const numeros = recorrido.querySelectorAll('[data-recorrido-num]')
      // Cada número entra cuando la línea llega a su punto.
      const paso = 0.7
      const tl = gsap.timeline({ scrollTrigger: { trigger: recorrido, start: 'top 85%' } })
      tl.from(linea, { scaleX: 0, duration: paso * (puntos.length - 1), ease: 'power2.inOut' }, 0)
      puntos.forEach((punto, i) => {
        tl.from(punto, { scale: 0, duration: 0.4, ease: 'back.out(3)' }, i * paso)
        tl.from(numeros[i], {
          scale: 0.4,
          rotation: -12,
          opacity: 0,
          transformOrigin: '0% 100%',
          duration: 1.4,
          ease: 'elastic.out(1,.6)'
        }, i * paso + 0.1)
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
