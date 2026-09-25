import { on } from './bus'
import { gsap } from './gsap'
import { alFrame, reducido } from './loop'

/**
 * Titular del hero. Cada letra va en su propio span con máscara para poder
 * revelarla desde abajo y moverla por separado.
 *
 * - Cerca del cursor, cada letra engorda según la distancia: radio de 380px y
 *   `wght = 260 + 540·k²`.
 * - Con el scroll las letras salen volando con desplazamiento y rotación
 *   aleatorios hasta desaparecer.
 */
const RADIO = 380

interface Letras {
  exteriores: HTMLElement[]
  interiores: HTMLElement[]
}

function partirTitular (titular: HTMLElement): Letras {
  const exteriores: HTMLElement[] = []
  const interiores: HTMLElement[] = []

  const texto = titular.textContent?.trim() ?? ''
  titular.textContent = ''
  // El texto partido en letras se leería letra a letra: el aria-label lo evita.
  titular.setAttribute('aria-label', texto)

  texto.split(' ').forEach((palabra, i) => {
    if (i > 0) titular.appendChild(document.createTextNode(' '))

    const envoltura = document.createElement('span')
    envoltura.style.display = 'inline-block'
    envoltura.style.whiteSpace = 'nowrap'
    envoltura.setAttribute('aria-hidden', 'true')

    for (const letra of palabra) {
      const fuera = document.createElement('span')
      fuera.style.display = 'inline-block'
      fuera.style.overflow = 'hidden'
      fuera.style.paddingBottom = '.06em'
      fuera.style.transition = 'font-variation-settings .35s ease-out'

      const dentro = document.createElement('span')
      dentro.style.display = 'inline-block'
      dentro.dataset.letra = ''
      dentro.textContent = letra

      fuera.appendChild(dentro)
      envoltura.appendChild(fuera)
      exteriores.push(fuera)
      interiores.push(dentro)
    }

    titular.appendChild(envoltura)
  })

  return { exteriores, interiores }
}

export function iniciarHero () {
  const titular = document.querySelector<HTMLElement>('[data-hero]')
  if (!titular) return

  const { exteriores, interiores } = partirTitular(titular)
  const bajas: Array<() => void> = []

  // Si la intro va a correr, las letras esperan fuera de la máscara.
  const conIntro = document.querySelector('[data-cargador]') !== null
  if (conIntro && !reducido) gsap.set(interiores, { yPercent: 110 })

  bajas.push(on('introFin', () => {
    if (reducido) {
      gsap.set(interiores, { yPercent: 0 })
      return
    }
    gsap.fromTo(
      interiores,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.05 }
    )
  }))

  // Peso variable de cada letra según su distancia al cursor.
  let cajas: DOMRect[] = []
  bajas.push(alFrame(marco => {
    if (!marco.ratonMovido) return
    if (marco.scrollY >= window.innerHeight) return
    if (marco.rectSucio || cajas.length !== exteriores.length) {
      cajas = exteriores.map(letra => letra.getBoundingClientRect())
    }
    exteriores.forEach((letra, i) => {
      const caja = cajas[i]
      const distancia = Math.hypot(
        marco.raton.x - (caja.left + caja.width / 2),
        marco.raton.y - (caja.top + caja.height / 2)
      )
      const k = Math.max(0, 1 - distancia / RADIO)
      letra.style.fontVariationSettings = `'wght' ${Math.round(260 + 540 * k * k)}, 'opsz' 96`
    })
  }))

  if (!reducido) {
    const contexto = gsap.context(() => {
      gsap.to(exteriores, {
        yPercent: () => -(80 + Math.random() * 260),
        rotation: () => gsap.utils.random(-50, 50),
        opacity: 0,
        ease: 'none',
        stagger: { each: 0.012, from: 'random' },
        scrollTrigger: {
          trigger: '#inicio',
          start: 'top top',
          end: 'bottom 15%',
          scrub: 0.8
        }
      })

      gsap.to('[data-hero-fade]', {
        y: -70,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#inicio',
          start: '15% top',
          end: '80% top',
          scrub: true
        }
      })
    })
    bajas.push(() => contexto.revert())
  }

  return () => {
    for (const baja of bajas) baja()
  }
}
