import { emit } from './bus'
import { gsap } from './gsap'
import { alFrame, limitar, reducido } from './loop'

/**
 * Sección «sobre mí»:
 *
 * - El párrafo grande se enciende palabra por palabra con el scroll, de
 *   opacidad .16 a 1, y las dos últimas palabras encendidas van en acento.
 * - La foto se revela con clip-path y hace parallax de ±70px.
 * - El enlace `~ $ habilidades →` baja a la terminal y ejecuta el comando.
 */
export function iniciarSobre () {
  const bajas: Array<() => void> = []

  const parrafo = document.querySelector<HTMLElement>('[data-sobre]')
  if (parrafo) bajas.push(encenderPalabras(parrafo))

  const foto = document.querySelector<HTMLElement>('[data-foto]')
  if (foto && !reducido) {
    const contexto = gsap.context(() => {
      gsap.fromTo(
        foto,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: foto, start: 'top 82%' }
        }
      )
      // Sin parallax: la columna va pegada (`md:sticky`) y moverla ±70px la
      // sacaría de su sitio mientras está fija.
    })
    bajas.push(() => contexto.revert())
  }

  const atajo = document.querySelector<HTMLElement>('[data-ir-habilidades]')
  if (atajo) {
    const comando = atajo.dataset.irHabilidades ?? 'habilidades'
    const ir = () => {
      document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })
      window.setTimeout(() => emit('ejecutar', comando), 500)
    }
    atajo.addEventListener('click', ir)
    bajas.push(() => atajo.removeEventListener('click', ir))
  }

  return () => {
    for (const baja of bajas) baja()
  }
}

function encenderPalabras (parrafo: HTMLElement) {
  const texto = parrafo.textContent ?? ''
  const palabras: HTMLElement[] = []

  parrafo.textContent = ''
  for (const trozo of texto.split(/(\s+)/)) {
    if (!trozo) continue
    if (/^\s+$/.test(trozo)) {
      parrafo.appendChild(document.createTextNode(trozo))
      continue
    }
    const palabra = document.createElement('span')
    palabra.textContent = trozo
    palabra.style.transition = 'opacity .35s ease, color .35s ease'
    palabra.style.opacity = reducido ? '1' : '0.16'
    parrafo.appendChild(palabra)
    palabras.push(palabra)
  }

  if (reducido || palabras.length === 0) return () => {}

  let caja: DOMRect | null = null

  return alFrame(marco => {
    if (caja && !marco.scrollSucio && !marco.rectSucio) return
    if (!caja || marco.rectSucio) caja = parrafo.getBoundingClientRect()

    const vh = window.innerHeight
    const progreso = limitar((vh * 0.85 - caja.top) / (caja.height + vh * 0.25), 0, 1)
    const encendidas = Math.round(progreso * palabras.length)

    palabras.forEach((palabra, i) => {
      palabra.style.opacity = i < encendidas ? '1' : '0.16'
      palabra.style.color = i === encendidas - 1 || i === encendidas - 2 ? 'var(--acct)' : ''
    })
  })
}
